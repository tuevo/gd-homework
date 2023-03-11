import { newMeasure, newRelativeDateFilter } from "@gooddata/sdk-model";
import { IDataSeries, LoadingComponent, useExecutionDataView } from "@gooddata/sdk-ui";
import { LineChart } from "@gooddata/sdk-ui-charts";
import { defaultDateFilterOptions } from "@gooddata/sdk-ui-filters";
import { Card, Col, Row, Typography, Statistic, Select } from "antd";
import React, { useEffect, useState } from "react";
import { CustomDateFilter, CustomDateFilterData } from "../components/controls/CustomDateFilter";
import Page from "../components/Page";
import { useAuth } from "../contexts/Auth";
import { AuthStatus } from "../contexts/Auth/state";
import * as Md from "../md/full";
import styles from "./Home.module.scss";

enum CalculationOptionValue {
    MaxReverseAcrossDiffProducts = "1",
    MinReverseAcrossDiffProducts = "2",
    Quantiles = "3",
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

    // Custom Component data
    const { result, status } = useExecutionDataView({
        execution: {
            seriesBy: [Md.Revenue, Md.Product.Default],
            filters,
            slicesBy: [Md.DateDatasets.Date.Month.Short],
        },
    });
    const [{ willFail }] = useState({
        executionNumber: 0,
        willFail: false,
    });
    const measure = willFail ? newMeasure("thisDoesNotExits") : Md.TotalRevenue;
    const [measureSeries, setMeasureSeries] = useState<IDataSeries | undefined>();

    const onCalculationChanged = (value: CalculationOptionValue) => {
        console.log(`selected ${value}`);
    };

    useEffect(() => {
        try {
            const data = result?.data().series().firstForMeasure(measure);
            setMeasureSeries(data);
        } catch (_) {}
    }, [measure, result]);

    const { authStatus } = useAuth();
    if (authStatus !== AuthStatus.AUTHORIZED)
        return (
            <Page>
                <Typography.Title>Please login</Typography.Title>
            </Page>
        );

    return (
        <Page>
            <Typography.Title>My Dashboard</Typography.Title>

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

            <div className={styles.content}>
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
                            {status === "loading" && <LoadingComponent />}
                            {status === "success" && (
                                <div className={styles.inner}>
                                    <Statistic
                                        value={measureSeries?.dataPoints()[0].formattedValue() ?? "N/A"}
                                    />
                                    <div className={styles.calculationSelectWrapper}>
                                        <Select
                                            defaultValue={CalculationOptionValue.MaxReverseAcrossDiffProducts}
                                            style={{ width: "100%" }}
                                            onChange={onCalculationChanged}
                                            options={[
                                                {
                                                    value: CalculationOptionValue.MaxReverseAcrossDiffProducts,
                                                    label: "Maximum Revenue across different products",
                                                },
                                                {
                                                    value: CalculationOptionValue.MinReverseAcrossDiffProducts,
                                                    label: "Minimum Revenue across different products",
                                                },
                                                {
                                                    value: CalculationOptionValue.Quantiles,
                                                    label: "Quantiles (median would be a good default)",
                                                },
                                            ]}
                                        />
                                    </div>
                                </div>
                            )}
                        </Card>
                    </Col>
                </Row>
            </div>
        </Page>
    );
};

export default Home;
