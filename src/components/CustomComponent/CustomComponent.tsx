import { LoadingComponent } from "@gooddata/sdk-ui";
import { Card } from "antd";
import { GdCalculationType } from "../../utils";
import { CalculationSelect } from "./CalculationSelect";
import styles from "./CustomComponent.module.scss";
import { TotalRevenue } from "./TotalRevenue";

interface IProps {
    status: "loading" | "success" | "pending" | "error";
    totalRevenue?: string;
    onCalculationChanged?: (type: GdCalculationType) => void;
}

export const CustomComponent = ({ status, totalRevenue, onCalculationChanged }: IProps) => {
    return (
        <Card bodyStyle={{ height: "100%" }} className={styles.customComponentWrapper}>
            <div className={styles.inner}>
                {status === "loading" && <LoadingComponent />}
                {status !== "loading" && (
                    <>
                        <TotalRevenue
                            value={status === "success" && totalRevenue !== undefined ? totalRevenue : "N/A"}
                        />
                        <div className={styles.calculationSelectWrapper}>
                            <CalculationSelect onChange={onCalculationChanged} />
                        </div>
                    </>
                )}
            </div>
        </Card>
    );
};
