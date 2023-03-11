import { DateGranularity, newRelativeDateFilter } from "@gooddata/sdk-model";
import { LineChart } from "@gooddata/sdk-ui-charts";
import { defaultDateFilterOptions } from "@gooddata/sdk-ui-filters";
import { Card, Col, Row, Typography } from "antd";
import React, { useState } from "react";
import { CustomDateFilter } from "../components/controls/CustomDateFilter";
import Page from "../components/Page";
import { useAuth } from "../contexts/Auth";
import { AuthStatus } from "../contexts/Auth/state";
import * as Md from "../md/full";
import styles from "./Home.module.scss";
import { LoadingComponent, ErrorComponent, useExecutionDataView } from "@gooddata/sdk-ui";
import { newMeasure } from "@gooddata/sdk-model";

const Home: React.FC = () => {
    // Date Filter
    const [filter, setFilter] = useState({
        selectedFilterOption: defaultDateFilterOptions.relativePreset![DateGranularity.month][1],
        excludeCurrentPeriod: false,
    });
    const { selectedFilterOption } = filter;
    const filters =
        selectedFilterOption.type === "allTime"
            ? []
            : [
                  newRelativeDateFilter(
                      Md.DateDatasets.Date,
                      selectedFilterOption.granularity,
                      selectedFilterOption.from,
                      selectedFilterOption.to,
                  ),
              ];

    // Custom Component
    const { result, error, status } = useExecutionDataView({
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
    const measureSeries = result?.data().series().firstForMeasure(measure);

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
                <Row gutter={10} align="top">
                    <Col span={16}>
                        <LineChart
                            filters={filters}
                            measures={[Md.Revenue]}
                            segmentBy={Md.Product.Default}
                            trendBy={Md.DateDatasets.Date.Month.Short}
                        />
                    </Col>

                    <Col span={8}>
                        <Card>
                            {status === "error" && (
                                <div>
                                    <div className="gd-message error">
                                        <div className="gd-message-text">Oops, simulated error! Retry?</div>
                                    </div>
                                    <ErrorComponent
                                        message="There was an error getting your execution"
                                        description={JSON.stringify(error, null, 2)}
                                    />
                                </div>
                            )}
                            {status === "loading" && (
                                <div>
                                    <div className="gd-message progress">
                                        <div className="gd-message-text">Loading…</div>
                                    </div>
                                    <LoadingComponent />
                                </div>
                            )}
                            {status === "success" && (
                                <Typography.Title>
                                    <p className="kpi s-execute-kpi">
                                        {measureSeries?.dataPoints()[0].formattedValue()}
                                    </p>
                                </Typography.Title>
                            )}
                        </Card>
                    </Col>
                </Row>
            </div>
        </Page>
    );
};

export default Home;
