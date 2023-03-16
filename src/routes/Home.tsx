import { DataPoint, useExecutionDataView } from "@gooddata/sdk-ui";
import { LineChart } from "@gooddata/sdk-ui-charts";
import { DateFilterHelpers, defaultDateFilterOptions } from "@gooddata/sdk-ui-filters";
import { Card, Col, Row, Typography } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CustomDateFilter, CustomDateFilterData } from "../components/controls/CustomDateFilter";
import { CustomComponent } from "../components/CustomComponent/CustomComponent";
import Page from "../components/Page";
import { useAuth } from "../contexts/Auth";
import { AuthStatus } from "../contexts/Auth/state";
import * as Md from "../md/full";
import { GdCalculationType, gdCalculationUtils, gdChartUtils } from "../utils";
import styles from "./Home.module.scss";

const Home: React.FC = () => {
    // Date Filter data
    const [filter, setFilter] = useState<CustomDateFilterData>({
        selectedFilterOption: defaultDateFilterOptions.allTime,
        excludeCurrentPeriod: false,
    });
    const { selectedFilterOption } = filter;
    const filters = useMemo(
        () =>
            gdChartUtils.createFilters({
                dateDataSet: Md.DateDatasets.Date,
                dateFilterOption: selectedFilterOption,
            }),
        [selectedFilterOption],
    );

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
    const [selectedCalculation, setSelectedCalculation] = useState<GdCalculationType>(
        GdCalculationType.MaxRevenueAcrossDiffProducts,
    );
    const totalRevenue = useMemo(
        () =>
            gdCalculationUtils.calculateTotalRevenue({
                dataPoints: dataPoints || [],
                calculationType: selectedCalculation,
            }),
        [selectedCalculation, dataPoints],
    );

    const onCalculationChanged = (value: GdCalculationType) => {
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
                <Typography.Title>
                    <Link to="/login">Login</Link> to My Dashboard
                </Typography.Title>
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
                    <Col span={24} lg={16}>
                        <LineChart
                            filters={filters}
                            measures={[Md.Revenue]}
                            segmentBy={Md.Product.Default}
                            trendBy={Md.DateDatasets.Date.Month.Short}
                        />
                    </Col>

                    <Col span={24} lg={8}>
                        <CustomComponent
                            status={status}
                            totalRevenue={totalRevenue?.formattedValue}
                            onCalculationChanged={onCalculationChanged}
                        />
                    </Col>
                </Row>
            </div>
        </Page>
    );
};

export default Home;
