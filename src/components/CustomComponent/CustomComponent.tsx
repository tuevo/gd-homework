import { LoadingComponent } from "@gooddata/sdk-ui";
import { Card, Select, Typography } from "antd";
import { GdCalculationType } from "../../utils";
import styles from "./CustomComponent.module.scss";

interface IProps {
    status: "loading" | "success" | "pending" | "error";
    totalRevenue?: string;
    onCalculationChanged?: (value: GdCalculationType) => void;
}

export const CustomComponent = ({ status, totalRevenue, onCalculationChanged }: IProps) => {
    return (
        <Card bodyStyle={{ height: "100%" }} className={styles.customComponentWrapper}>
            <div className={styles.inner}>
                {status === "loading" && <LoadingComponent />}
                {status !== "loading" && (
                    <>
                        <Typography.Title>
                            {status === "success" && totalRevenue !== undefined ? totalRevenue : "N/A"}
                        </Typography.Title>
                        <div className={styles.calculationSelectWrapper}>
                            <Select
                                defaultValue={GdCalculationType.MaxRevenueAcrossDiffProducts}
                                style={{ width: "100%" }}
                                onChange={onCalculationChanged}
                                options={[
                                    {
                                        value: GdCalculationType.MaxRevenueAcrossDiffProducts,
                                        label: "Maximum Revenue across different products",
                                    },
                                    {
                                        value: GdCalculationType.MinRevenueAcrossDiffProducts,
                                        label: "Minimum Revenue across different products",
                                    },
                                ]}
                            />
                        </div>
                    </>
                )}
            </div>
        </Card>
    );
};
