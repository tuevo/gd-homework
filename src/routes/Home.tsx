import { newRelativeDateFilter } from "@gooddata/sdk-model";
import { DataPoint, LoadingComponent, useExecutionDataView } from "@gooddata/sdk-ui";
import { LineChart } from "@gooddata/sdk-ui-charts";
import { DateFilterHelpers, defaultDateFilterOptions } from "@gooddata/sdk-ui-filters";
import { Card, Col, Row, Select, Typography } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { CustomDateFilter, CustomDateFilterData } from "../components/controls/CustomDateFilter";
import Page from "../components/Page";
import { useAuth } from "../contexts/Auth";
import { AuthStatus } from "../contexts/Auth/state";
import * as Md from "../md/full";
import styles from "./Home.module.scss";

type RevenueData = { formattedValue: string; value: number };

enum CalculationType {
    MaxRevenueAcrossDiffProducts = "1",
    MinRevenueAcrossDiffProducts = "2",
}

const Home: React.FC = () => {
    // Date Filter data
    const [filter, setFilter] = useState<CustomDateFilterData>({
        selectedFilterOption: defaultDateFilterOptions.allTime,
        excludeCurrentPeriod: false,
    });
    const { selectedFilterOption } = filter;
    const filters =
        !selectedFilterOption || selectedFilterOption?.type === "allTime"
            ? []
            : [
                  newRelativeDateFilter(
                      Md.DateDatasets.Date,
                      "GDC.time.month",
                      selectedFilterOption.from as number,
                      selectedFilterOption.to as number,
                  ),
              ];

    const titleSuffix = selectedFilterOption
        ? DateFilterHelpers.getDateFilterTitle(selectedFilterOption, "en-US")
        : "";

    // Custom Component data
    const { result, status } = useExecutionDataView({
        execution: {
            seriesBy: [Md.Revenue, Md.Product.Default],
            filters,
            slicesBy: [Md.DateDatasets.Date.Month.Short],
        },
    });
    const [dataPoints, setDataPoints] = useState<DataPoint[] | undefined>();
    const [selectedCalculation, setSelectedCalculation] = useState<CalculationType>(
        CalculationType.MaxRevenueAcrossDiffProducts,
    );
    const totalRevenue: RevenueData | undefined = useMemo(() => {
        const points = (dataPoints || []).filter((p) => p.rawValue !== null && p.formattedValue() !== null);
        if (!points.length) {
            return undefined;
        }

        if (
            [
                CalculationType.MaxRevenueAcrossDiffProducts,
                CalculationType.MinRevenueAcrossDiffProducts,
            ].includes(selectedCalculation)
        ) {
            let revenue: RevenueData = {
                value: +points[0].rawValue!.toString(),
                formattedValue: points[0].formattedValue()!,
            };

            for (const p of points) {
                const value = +p.rawValue!.toString();
                const formattedValue = p.formattedValue()!;

                let comparator = false;
                switch (selectedCalculation) {
                    case CalculationType.MaxRevenueAcrossDiffProducts:
                        comparator = value > revenue.value;
                        break;

                    case CalculationType.MinRevenueAcrossDiffProducts:
                        comparator = value < revenue.value;
                        break;

                    default:
                        break;
                }

                if (comparator) {
                    revenue = { value, formattedValue };
                }
            }

            return revenue;
        }

        return undefined;
    }, [selectedCalculation, dataPoints]);

    const onCalculationChanged = (value: CalculationType) => {
        setSelectedCalculation(value);
    };

    useEffect(() => {
        try {
            const newDataPoints = result
                ?.data()
                .series()
                .toArray()
                .map((item) => item.dataPoints())
                .flat();
            setDataPoints(newDataPoints);
        } catch (_) {}
    }, [result]);

    const { authStatus } = useAuth();
    if (authStatus !== AuthStatus.AUTHORIZED)
        return (
            <Page>
                <Typography.Title>Please login</Typography.Title>
            </Page>
        );

    return (
        <Page>
            <Typography.Title>My Dashboard {titleSuffix}</Typography.Title>

            <Card size="small">
                <CustomDateFilter
                    filter={filter}
                    setFilter={(filter) =>
                        setFilter({
                            selectedFilterOption: filter.selectedFilterOption,
                            excludeCurrentPeriod: filter.excludeCurrentPeriod,
                        })
                    }
                />
            </Card>

            <div className={styles.dataVisualization}>
                <Row gutter={[20, 10]} align="top">
                    <Col span={16}>
                        <LineChart
                            filters={filters}
                            measures={[Md.Revenue]}
                            segmentBy={Md.Product.Default}
                            trendBy={Md.DateDatasets.Date.Month.Short}
                        />
                    </Col>

                    <Col span={8}>
                        <Card bodyStyle={{ height: "100%" }} className={styles.customComponentWrapper}>
                            <div className={styles.inner}>
                                {status === "loading" && <LoadingComponent />}
                                {status !== "loading" && (
                                    <>
                                        <Typography.Title>
                                            {status === "success" && totalRevenue !== undefined
                                                ? totalRevenue.formattedValue
                                                : "N/A"}
                                        </Typography.Title>
                                        <div className={styles.calculationSelectWrapper}>
                                            <Select
                                                defaultValue={CalculationType.MaxRevenueAcrossDiffProducts}
                                                style={{ width: "100%" }}
                                                onChange={onCalculationChanged}
                                                options={[
                                                    {
                                                        value: CalculationType.MaxRevenueAcrossDiffProducts,
                                                        label: "Maximum Revenue across different products",
                                                    },
                                                    {
                                                        value: CalculationType.MinRevenueAcrossDiffProducts,
                                                        label: "Minimum Revenue across different products",
                                                    },
                                                ]}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </Page>
    );
};

export default Home;
