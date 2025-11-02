'use client';

import { useParams } from 'next/navigation';
import { createContext, useCallback, useContext, useMemo } from 'react';
import { useQueryState, parseAsInteger, parseAsStringLiteral } from 'nuqs';
import { useConditionalQueryStates } from '@/hooks';
import { MyUserProfileContext } from '@/contexts';
import { PermitsQueryFiltersData, PermitsFilter, DefaultPermitsQueryFiltersData, PermitsFilterType } from '@/schema/models';

import { OffsetPaginatedQueryProvider } from '@/contexts';
import { throwError } from '@/helpers';
import { useAuctionAvailability } from '@/hooks';
import { getPaginatedWinningBids } from '@/lib/bids/open';
import { IBidData } from '@/schema/models';
import {
	OffsetPaginatedContextState,
	OffsetPaginatedProviderProps,
	getDefaultOffsetPaginatedContextState,
} from '@/types';

export interface IPaginatedWinningBidsContext extends OffsetPaginatedContextState<IBidData> {
	filters: PermitsQueryFiltersData;
	setAllFilters: (filters: PermitsQueryFiltersData) => void;
	setSingleFilter: (key: 'type', value: PermitsFilterType[] | undefined) => void;
	removeFilter: (key: keyof PermitsQueryFiltersData) => void;
	resetFilters: () => void;
}
const DefaultData: IPaginatedWinningBidsContext = {
	...getDefaultOffsetPaginatedContextState<IBidData>(),
	filters: DefaultPermitsQueryFiltersData,
	setAllFilters: () => { },
	setSingleFilter: () => { },
	removeFilter: () => { },
	resetFilters: () => { },
};
const Context = createContext<IPaginatedWinningBidsContext>(DefaultData);

export interface PaginatedWinningBidsProviderProps extends OffsetPaginatedProviderProps {
	defaultFilters?: PermitsQueryFiltersData;
}
export const PaginatedWinningBidsProvider = ({
	defaultFilters = { type: ['all'] },
	syncWithSearchParams = false,
	id = 'paginatedWinningBids',
	...props
}: PaginatedWinningBidsProviderProps) => {
	const { auctionId } = useParams();
	const { areBidsAvailable } = useAuctionAvailability();
	const myUser = useContext(MyUserProfileContext);
	const isAdmin = useMemo(() => myUser?.data?.type === 'admin', [myUser?.data?.type]);

	const [, setPage] = useQueryState(
		'page',
		parseAsInteger.withDefault(props.defaultPage || DefaultData.page),
	);
	const [filters, setAllFilters] = useConditionalQueryStates<PermitsQueryFiltersData>({
		type: parseAsStringLiteral(PermitsFilter),

		defaultValue: defaultFilters || DefaultData.filters,
		syncWithSearchParams,

		//	Go back to the first page when filters change
		onValueChange: () => setPage(props.defaultPage || DefaultData.page),
	});

	const resetFilters = useCallback<IPaginatedWinningBidsContext['resetFilters']>(
		() => setAllFilters(DefaultData.filters),
		[],
	);

	const removeFilter = useCallback<IPaginatedWinningBidsContext['removeFilter']>(
		(key) => {
			setAllFilters({ ...filters, [key]: DefaultData.filters[key] });
		},
		[filters],
	);

	const setSingleFilter = useCallback<IPaginatedWinningBidsContext['setSingleFilter']>(
		(key, value) => {
			setAllFilters({
				...filters,
				[key]: (value && value.length > 0) ? [...(Array.isArray(value) ? value : [value])] : DefaultData.filters[key],
			});
		},
		[filters],
	);

	const queryKey = useMemo(
		() => ['marketplace', auctionId as string, 'paginatedWinningBids', JSON.stringify(filters)],
		[auctionId, filters],
	);
	const queryFn = useMemo(
		() => (page: number, perPage: number) => () =>
			throwError(
				getPaginatedWinningBids({
					auctionId: auctionId as string,
					page,
					perPage,
					// Add filter params to API call when backend supports it
					// type: filters.type === 'all' ? undefined : filters.type,
				}),
				`getPaginatedWinningBids:${auctionId}`,
			),
		[auctionId, filters],
	);

	return (
		<OffsetPaginatedQueryProvider
			context={Context}
			defaultData={DefaultData}
			queryKey={queryKey}
			queryFn={queryFn}
			id={id}
			disabled={!areBidsAvailable && !isAdmin}
			filters={filters}
			setAllFilters={setAllFilters}
			setSingleFilter={setSingleFilter}
			removeFilter={removeFilter}
			resetFilters={resetFilters}
			{...props}
		/>
	);
};

export {
	DefaultData as DefaultPaginatedWinningBidsContextData,
	Context as PaginatedWinningBidsContext,
};
