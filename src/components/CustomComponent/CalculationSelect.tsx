import { Select } from "antd";
import { useTranslation } from "react-i18next";
import { GdCalculationType } from "../../utils";

interface IProps {
    onChange?: (type: GdCalculationType) => void;
}

export const CalculationSelect = ({ onChange }: IProps) => {
    const { t } = useTranslation();

    return (
        <Select
            defaultValue={GdCalculationType.MaxRevenueAcrossDiffProducts}
            style={{ width: "100%" }}
            onChange={onChange}
            options={[
                {
                    value: GdCalculationType.MaxRevenueAcrossDiffProducts,
                    label: t("maxRevenueAcrossDifProducts"),
                },
                {
                    value: GdCalculationType.MinRevenueAcrossDiffProducts,
                    label: t("minRevenueAcrossDifProducts"),
                },
            ]}
        />
    );
};
