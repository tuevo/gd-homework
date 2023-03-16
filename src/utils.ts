import { IWorkspaceDescriptor } from "@gooddata/sdk-backend-spi/esm/workspace";
import { newAbsoluteDateFilter, newRelativeDateFilter, ObjRef } from "@gooddata/sdk-model";
import { DataPoint, NullableFiltersOrPlaceholders } from "@gooddata/sdk-ui";
import { DateFilterOption } from "@gooddata/sdk-ui-filters";

export interface IWorkspaceSourceState {
    isLoading: boolean;
    error?: Error;
    data?: IWorkspaceDescriptor[];
}
export const defaultSourceState: IWorkspaceSourceState = { isLoading: true };

export interface IGdChartCreateFiltersUtilArguments {
    dateDataSet: string | ObjRef;
    dateFilterOption?: DateFilterOption;
}
export const gdChartUtils = {
    createFilters(args: IGdChartCreateFiltersUtilArguments): NullableFiltersOrPlaceholders {
        const { dateFilterOption } = args;
        if (!dateFilterOption) {
            return [];
        }

        const { dateDataSet } = args;
        const type = dateFilterOption?.type;
        if (type === "absoluteForm") {
            const { from, to } = dateFilterOption;
            if (from !== undefined && to !== undefined) {
                return [newAbsoluteDateFilter(dateDataSet, from, to)];
            }
        } else if (type === "relativeForm" || type === "relativePreset") {
            const { granularity, from, to } = dateFilterOption;
            if (from !== undefined && to !== undefined && granularity) {
                return [newRelativeDateFilter(dateDataSet, granularity, +from, +to)];
            }
        }

        return [];
    },
};

interface IGdTotalRevenue {
    formattedValue: string;
    value: number;
}
export enum GdCalculationType {
    MaxRevenueAcrossDiffProducts = "1",
    MinRevenueAcrossDiffProducts = "2",
}
export interface IGdCalculateTotalRevenueUtilArgs {
    dataPoints: DataPoint[];
    calculationType: GdCalculationType;
}
export const gdCalculationUtils = {
    calculateTotalRevenue(args: IGdCalculateTotalRevenueUtilArgs): IGdTotalRevenue | undefined {
        const { dataPoints, calculationType } = args;
        const points = (dataPoints || []).filter((p) => p.rawValue !== null && p.formattedValue() !== null);
        if (!points.length) {
            return undefined;
        }

        if (
            [
                GdCalculationType.MaxRevenueAcrossDiffProducts,
                GdCalculationType.MinRevenueAcrossDiffProducts,
            ].includes(calculationType)
        ) {
            let revenue: IGdTotalRevenue = {
                value: +points[0].rawValue!.toString(),
                formattedValue: points[0].formattedValue()!,
            };

            for (const p of points) {
                const value = +p.rawValue!.toString();
                const formattedValue = p.formattedValue()!;

                let comparator = false;
                switch (calculationType) {
                    case GdCalculationType.MaxRevenueAcrossDiffProducts:
                        comparator = value > revenue.value;
                        break;

                    case GdCalculationType.MinRevenueAcrossDiffProducts:
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
    },
};
