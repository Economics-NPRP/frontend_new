'use client';

import { parseAsArrayOf, parseAsInteger, parseAsString, parseAsStringLiteral, useQueryState } from 'nuqs';
import { createContext, useCallback, useEffect, useMemo, useContext } from 'react';

import { SectorList } from '@/constants/SectorData';
import {
	MyUserProfileContext,
	SortedOffsetPaginatedQueryProvider,
	SortedOffsetPaginatedQueryProviderProps,
} from '@/contexts';
import { throwError } from '@/helpers';
import { useConditionalQueryStates } from '@/hooks';
import { getPaginatedAuctions, getPaginatedFirmAuctions } from '@/lib/auctions';
import {
	AuctionJoinedStatusListFilter,
	AuctionOwnershipListFilter,
	AuctionStatusListFilter,
	AuctionTypeListFilter,
	DefaultQueryFiltersData,
	IAuctionData,
	QueryFiltersData,
} from '@/schema/models';
import {
	SortedOffsetPaginatedContextState,
	SortedOffsetPaginatedProviderProps,
	getDefaultSortedOffsetPaginatedContextState,
} from '@/types';
import { toEndpointStatus } from 'contexts/PaginatedAuctions/constants';

export interface IPaginatedAuctionsContext extends SortedOffsetPaginatedContextState<IAuctionData> {
	filters: QueryFiltersData;
	setAllFilters: (filters: QueryFiltersData) => void;
	setSingleFilter: (
		key: 'type' | 'status' | 'joined' | 'ownership',
		value: string | undefined,
	) => void;
	setArrayFilter: (key: 'sector', value: Array<string>) => void;
	addToFilterArray: (key: 'sector', ...value: Array<string>) => void;
	removeFilter: (key: keyof QueryFiltersData, value?: string) => void;
	resetFilters: () => void;
}
const DefaultData: IPaginatedAuctionsContext = {
	...getDefaultSortedOffsetPaginatedContextState<IAuctionData>(1, 12, 'created_at', 'desc'),

	filters: DefaultQueryFiltersData,
	setAllFilters: () => { },
	setSingleFilter: () => { },
	setArrayFilter: () => { },
	addToFilterArray: () => { },
	removeFilter: () => { },
	resetFilters: () => { },
};
const Context = createContext<IPaginatedAuctionsContext>(DefaultData);

export interface PaginatedAuctionsProviderProps extends SortedOffsetPaginatedProviderProps {
	defaultFilters?: QueryFiltersData;
	owned?: boolean;
}
export const PaginatedAuctionsProvider = ({
	defaultFilters,
	owned = false,
	syncWithSearchParams = false,
	id = 'paginatedAuctions',
	...props
}: PaginatedAuctionsProviderProps) => {
	const profile = useContext(MyUserProfileContext);

	const [, setPage] = useQueryState(
		'page',
		parseAsInteger.withDefault(props.defaultPage || DefaultData.page),
	);
	const [filters, setAllFilters] = useConditionalQueryStates<QueryFiltersData>({
		type: parseAsStringLiteral(AuctionTypeListFilter),
		status: parseAsStringLiteral(AuctionStatusListFilter),
		sector: parseAsArrayOf(parseAsStringLiteral(SectorList)),
		joined: parseAsStringLiteral(AuctionJoinedStatusListFilter),
		ownership: parseAsStringLiteral(AuctionOwnershipListFilter),
		ownerId: parseAsString,

		defaultValue: defaultFilters || DefaultData.filters,
		syncWithSearchParams,

		//	Go back to the first page when filters change
	});


	useEffect(() => {
		// Only reset page if filters object reference changes, indicating a potential filter update.
		// NOTE: This might still trigger on initial load if filters are set from URL. 
		// Ideally we only want to reset page if the filter VALUES change compared to previous.
		setPage(props.defaultPage || DefaultData.page);
	}, [filters, setPage, props.defaultPage]);

	const resetFilters = useCallback<IPaginatedAuctionsContext['resetFilters']>(
		() => setAllFilters(DefaultData.filters),
		[],
	);

	const removeFilter = useCallback<IPaginatedAuctionsContext['removeFilter']>(
		(key, value) => {
			if (value)
				setAllFilters({
					...filters,
					[key]: (filters[key] as Array<string>).filter((v) => v !== value),
				});
			else setAllFilters({ ...filters, [key]: DefaultData.filters[key] });
		},
		[filters],
	);

	const setSingleFilter = useCallback<IPaginatedAuctionsContext['setSingleFilter']>(
		(key, value) =>
			setAllFilters({
				...filters,
				[key]: value || DefaultData.filters[key],
			}),
		[filters],
	);

	const setArrayFilter = useCallback<IPaginatedAuctionsContext['setArrayFilter']>(
		(key, value) =>
			setAllFilters({
				...filters,
				//	@ts-expect-error - should be gone once we add a new type to array filter key
				[key]: Array.from(new Set(value)),
			}),
		[filters],
	);

	const addToFilterArray = useCallback<IPaginatedAuctionsContext['addToFilterArray']>(
		(key, ...value) =>
			setAllFilters({
				...filters,
				//	@ts-expect-error - should be gone once we add a new type to array filter key
				[key]: Array.from(new Set([...filters[key]!, ...value])),
			}),
		[filters],
	);

	const queryKey = useMemo(
		() => ['marketplace', 'paginatedAuctions', JSON.stringify(filters), owned ? profile?.data?.id : null],
		[filters, owned, profile?.data?.id],
	);
	const queryFn = useMemo<
		SortedOffsetPaginatedQueryProviderProps<IPaginatedAuctionsContext>['queryFn']
	>(
		() => (page, perPage, sortBy, sortDirection) => () => {
			const effectiveOwnerId = owned ? profile?.data?.id : (filters.ownerId || undefined);
			return throwError(
				filters.joined === 'joined' ?
					getPaginatedFirmAuctions({
						page,
						perPage,
						sortBy,
						sortDirection,
						auctionType: filters.type,
						auctionStatus: filters.status && toEndpointStatus[filters.status],
						ownerId: effectiveOwnerId,
						sector: filters.sector
					})
					:
					getPaginatedAuctions({
						page,
						perPage,
						sortBy,
						sortDirection,
						type: filters.type,
						ownership: filters.ownership,
						ownerId: effectiveOwnerId,
						sector: filters.sector,
						isLive: filters.status === 'ongoing',
						hasEnded: filters.status === 'ended',
						isPending: filters.status === 'upcoming',
					}),
				'getPaginatedAuctions',
			);
		},
		[filters, owned, profile?.data?.id],
	);

	return (
		<SortedOffsetPaginatedQueryProvider
			context={Context}
			defaultData={DefaultData}
			queryKey={queryKey}
			queryFn={queryFn}
			id={id}
			syncWithSearchParams={syncWithSearchParams}
			disabled={owned && !profile?.data?.id}
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

export { DefaultData as DefaultPaginatedAuctionsContextData, Context as PaginatedAuctionsContext };
