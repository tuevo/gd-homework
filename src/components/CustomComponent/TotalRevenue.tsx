import { Typography } from "antd";

interface IProps {
    value: string;
}

export const TotalRevenue = ({ value }: IProps) => {
    return <Typography.Title className="abc">{value}</Typography.Title>;
};
