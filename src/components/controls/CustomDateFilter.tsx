// (C) 2007-2022 GoodData Corporation
import { DateFilterGranularity } from "@gooddata/sdk-model";
import { DateFilter, DateFilterOption, defaultDateFilterOptions } from "@gooddata/sdk-ui-filters";

const availableGranularities: DateFilterGranularity[] = [
    "GDC.time.date",
    "GDC.time.month",
    "GDC.time.quarter",
    "GDC.time.year",
];

export interface CustomDateFilterData {
    excludeCurrentPeriod: boolean;
    selectedFilterOption?: DateFilterOption;
}

interface Props {
    filter: CustomDateFilterData;
    setFilter: (filter: CustomDateFilterData) => void;
}

export const CustomDateFilter = ({ filter, setFilter }: Props) => {
    const { excludeCurrentPeriod, selectedFilterOption } = filter;
    const onApply = (selectedFilterOption: DateFilterOption, excludeCurrentPeriod: boolean) => {
        setFilter({
            selectedFilterOption,
            excludeCurrentPeriod,
        });
    };

    return (
        <div style={{ width: 300 }}>
            <DateFilter
                excludeCurrentPeriod={excludeCurrentPeriod}
                selectedFilterOption={selectedFilterOption}
                filterOptions={defaultDateFilterOptions}
                availableGranularities={availableGranularities}
                customFilterName="Date Filter"
                dateFilterMode="active"
                onApply={onApply}
            />
        </div>
    );
};
