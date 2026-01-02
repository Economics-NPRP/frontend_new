'use client';

import { parseAsArrayOf, parseAsBoolean, parseAsInteger, parseAsFloat, parseAsString, parseAsStringLiteral, useQueryState } from 'nuqs';
import { createContext, useCallback, useMemo } from 'react';

import { SectorList } from '@/constants/SectorData';
import {
	SortedOffsetPaginatedQueryProvider,
	SortedOffsetPaginatedQueryProviderProps,
} from '@/contexts';
import { throwError } from '@/helpers';
import { useConditionalQueryStates } from '@/hooks';
import { getPaginatedFirmAuctions } from '@/lib/auctions';
import {
	AuctionStatusListFilter,
	AuctionTypeListFilter,
	IAuctionData,
} from '@/schema/models';
import {
	DefaultFirmQueryFiltersData,
	FirmQueryFiltersData,
} from '@/schema/models/FirmAuctionFilter';
import {
	SortedOffsetPaginatedContextState,
	SortedOffsetPaginatedProviderProps,
	getDefaultSortedOffsetPaginatedContextState,
} from '@/types';

export interface IPaginatedFirmAuctionsContext extends SortedOffsetPaginatedContextState<IAuctionData> {
	filters: FirmQueryFiltersData;
	setAllFilters: (filters: FirmQueryFiltersData) => void;
	setSingleFilter: (
		key: 'auctionType' | 'auctionStatus' | 'firmId' | 'isPrimaryMarket' | 'startDatetimeFrom' | 'startDatetimeTo' | 'endDatetimeFrom' | 'endDatetimeTo' | 'minPermits' | 'maxPermits' | 'ownerId' | 'auctionId',
		value: string | number | boolean | undefined,
	) => void;
	setArrayFilter: (key: 'sector', value: Array<string>) => void;
	addToFilterArray: (key: 'sector', ...value: Array<string>) => void;
	removeFilter: (key: keyof FirmQueryFiltersData, value?: string) => void;
	resetFilters: () => void;
}
const DefaultData: IPaginatedFirmAuctionsContext = {
	...getDefaultSortedOffsetPaginatedContextState<IAuctionData>(1, 12, 'created_at', 'desc'),

	filters: DefaultFirmQueryFiltersData,
	setAllFilters: () => { },
	setSingleFilter: () => { },
	setArrayFilter: () => { },
	addToFilterArray: () => { },
	removeFilter: () => { },
	resetFilters: () => { },
};
const Context = createContext<IPaginatedFirmAuctionsContext>(DefaultData);

export interface PaginatedFirmAuctionsProviderProps extends SortedOffsetPaginatedProviderProps {
	defaultFilters?: FirmQueryFiltersData;
}
export const PaginatedFirmAuctionsProvider = ({
	defaultFilters,
	syncWithSearchParams = false,
	id = 'paginatedFirmAuctions',
	...props
}: PaginatedFirmAuctionsProviderProps) => {
	const [, setPage] = useQueryState(
		'page',
		parseAsInteger.withDefault(props.defaultPage || DefaultData.page),
	);
	const [filters, setAllFilters] = useConditionalQueryStates<FirmQueryFiltersData>({
		firmId: parseAsString,
		sector: parseAsArrayOf(parseAsStringLiteral(SectorList)),
		auctionType: parseAsStringLiteral(AuctionTypeListFilter),
		auctionStatus: parseAsStringLiteral(AuctionStatusListFilter),
		isPrimaryMarket: parseAsBoolean,
		startDatetimeFrom: parseAsString,
		startDatetimeTo: parseAsString,
		endDatetimeFrom: parseAsString,
		endDatetimeTo: parseAsString,
		minPermits: parseAsFloat,
		maxPermits: parseAsFloat,
		ownerId: parseAsString,
		auctionId: parseAsString,

		defaultValue: defaultFilters || DefaultData.filters,
		syncWithSearchParams,

		//	Go back to the first page when filters change
		onValueChange: () => setPage(props.defaultPage || DefaultData.page),
	});

	const resetFilters = useCallback<IPaginatedFirmAuctionsContext['resetFilters']>(
		() => setAllFilters(DefaultData.filters),
		[],
	);

	const removeFilter = useCallback<IPaginatedFirmAuctionsContext['removeFilter']>(
		(key, value) => {
			if (value && Array.isArray(filters[key]))
				setAllFilters({
					...filters,
					[key]: (filters[key] as Array<string>).filter((v) => v !== value),
				});
			else setAllFilters({ ...filters, [key]: DefaultData.filters[key] });
		},
		[filters],
	);

	const setSingleFilter = useCallback<IPaginatedFirmAuctionsContext['setSingleFilter']>(
		(key, value) =>
			setAllFilters({
				...filters,
				[key]: value !== undefined ? value : DefaultData.filters[key],
			} as FirmQueryFiltersData),
		[filters],
	);

	const setArrayFilter = useCallback<IPaginatedFirmAuctionsContext['setArrayFilter']>(
		(key, value) =>
			setAllFilters({
				...filters,
				//	@ts-expect-error - should be gone once we add a new type to array filter key
				[key]: Array.from(new Set(value)),
			}),
		[filters],
	);

	const addToFilterArray = useCallback<IPaginatedFirmAuctionsContext['addToFilterArray']>(
		(key, ...value) =>
			setAllFilters({
				...filters,
				//	@ts-expect-error - should be gone once we add a new type to array filter key
				[key]: Array.from(new Set([...(filters[key] as Array<string>), ...value])),
			}),
		[filters],
	);

	const queryKey = useMemo(
		() => ['marketplace', 'paginatedFirmAuctions', JSON.stringify(filters)],
		[filters],
	);
	const queryFn = useMemo<
		SortedOffsetPaginatedQueryProviderProps<IPaginatedFirmAuctionsContext>['queryFn']
	>(
		() => (page, perPage, sortBy, sortDirection) => () =>
			throwError(
				getPaginatedFirmAuctions({
					page,
					perPage,
					sortBy,
					sortDirection,
					...filters,
					
					auctionType: filters.auctionType,
					auctionStatus: filters.auctionStatus,

					firmId: filters.firmId,
					isPrimaryMarket: filters.isPrimaryMarket,
					startDatetimeFrom: filters.startDatetimeFrom,
					startDatetimeTo: filters.startDatetimeTo,
					endDatetimeFrom: filters.endDatetimeFrom,
					endDatetimeTo: filters.endDatetimeTo,
					minPermits: filters.minPermits,
					maxPermits: filters.maxPermits,
					auctionId: filters.auctionId,
					ownerId: filters.ownerId,
					sector: filters.sector,
				}),
				'getPaginatedFirmAuctions',
			),
		[filters],
	);

	return (
		<SortedOffsetPaginatedQueryProvider
			context={Context}
			defaultData={DefaultData}
			queryKey={queryKey}
			queryFn={queryFn}
			id={id}
			syncWithSearchParams={syncWithSearchParams}
			filters={filters}
			setAllFilters={setAllFilters}
			setSingleFilter={setSingleFilter}
			setArrayFilter={setArrayFilter}
			addToFilterArray={addToFilterArray}
			removeFilter={removeFilter}
			resetFilters={resetFilters}
			{...props}
		/>
	);
};

export { DefaultData as DefaultPaginatedFirmAuctionsContextData, Context as PaginatedFirmAuctionsContext };
