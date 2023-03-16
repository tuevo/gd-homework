import { IWorkspaceDescriptor } from "@gooddata/sdk-backend-spi/esm/workspace";
import { newAbsoluteDateFilter, newRelativeDateFilter, ObjRef } from "@gooddata/sdk-model";
import { DateFilterOption } from "@gooddata/sdk-ui-filters";

export interface IWorkspaceSourceState {
    isLoading: boolean;
    error?: Error;
    data?: IWorkspaceDescriptor[];
}
export const defaultSourceState: IWorkspaceSourceState = { isLoading: true };

interface IGdChartCreateFiltersUtilArguments {
    dateDataSet: string | ObjRef;
    dateFilterOption?: DateFilterOption;
}
export const gdChartUtils = {
    createFilters: (args: IGdChartCreateFiltersUtilArguments) => {
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
