// (C) 2007-2022 GoodData Corporation
import { DateFilterGranularity } from "@gooddata/sdk-model";
import { DateFilter, DateFilterOption, defaultDateFilterOptions } from "@gooddata/sdk-ui-filters";

const dateFrom = new Date();
dateFrom.setMonth(dateFrom.getMonth() - 1);

const availableGranularities: DateFilterGranularity[] = [
    "GDC.time.date",
    "GDC.time.month",
    "GDC.time.quarter",
    "GDC.time.year",
];

interface Filter {
    excludeCurrentPeriod: boolean;
    selectedFilterOption?: DateFilterOption;
}

interface CustomDateFilterProps {
    filter: Filter;
    setFilter: (filter: Filter) => void;
}

export const CustomDateFilter = ({ filter, setFilter }: CustomDateFilterProps) => {
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
