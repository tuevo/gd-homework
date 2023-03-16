import { Select } from "antd";
import { GdCalculationType } from "../../utils";

interface IProps {
    onChange?: (type: GdCalculationType) => void;
}

export const CalculationSelect = ({ onChange }: IProps) => {
    return (
        <Select
            defaultValue={GdCalculationType.MaxRevenueAcrossDiffProducts}
            style={{ width: "100%" }}
            onChange={onChange}
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
    );
};
