import { Card, Col, Row, Typography } from "antd";
import React, { useState } from "react";
import Page from "../components/Page";
import styles from "./Home.module.scss";
import { CustomDateFilter } from "../components/controls/CustomDateFilter";
import { DateGranularity, newRelativeDateFilter } from "@gooddata/sdk-model";
import { defaultDateFilterOptions } from "@gooddata/sdk-ui-filters";
import * as Md from "../md/full";
import { LineChart } from "@gooddata/sdk-ui-charts";

const Home: React.FC = () => {
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

    return (
        <Page>
            <Typography.Title>Dashboard Title</Typography.Title>
            <Card bordered={false}>
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
                <Row gutter={10}>
                    <Col span={16}>
                        <LineChart measures={[Md.Revenue]} filters={filters} />
                    </Col>
                    <Col span={8}>
                        <Card bordered={false}>Custom component</Card>
                    </Col>
                </Row>
            </div>
        </Page>
    );
};

export default Home;
