'use client';

import { useConditionalQueryState } from 'hooks/useConditionalQueryState';
import { parseAsInteger, parseAsStringLiteral, useQueryState } from 'nuqs';
import { createContext, useMemo } from 'react';

import {
	SortedOffsetPaginatedQueryProvider,
	SortedOffsetPaginatedQueryProviderProps,
} from '@/contexts';
import { throwError } from '@/helpers';
import { getPaginatedCycles } from '@/lib/cycles';
import {
	AuctionCycleStatusFilter,
	AuctionCycleStatusListFilter,
	IAuctionCycleData,
} from '@/schema/models';
import {
	SortedOffsetPaginatedContextState,
	SortedOffsetPaginatedProviderProps,
	getDefaultSortedOffsetPaginatedContextState,
} from '@/types';

export interface IPaginatedAuctionCyclesContext
	extends SortedOffsetPaginatedContextState<IAuctionCycleData> {
	status: AuctionCycleStatusFilter;
	setStatus: (status: AuctionCycleStatusFilter) => void;
}
const DefaultData = {
	...getDefaultSortedOffsetPaginatedContextState<IAuctionCycleData>(
		1,
		10,
		'start_datetime',
		'desc',
	),
	status: 'all' as AuctionCycleStatusFilter,
	setStatus: () => { },
};
const Context = createContext<IPaginatedAuctionCyclesContext>(DefaultData);

export const PaginatedAuctionCyclesProvider = ({
	syncWithSearchParams,
	id = 'paginatedAuctionCycles',
	defaultStatus,
	...props
}: SortedOffsetPaginatedProviderProps & { defaultStatus?: AuctionCycleStatusFilter }) => {
	const [, setPage] = useQueryState(
		'page',
		parseAsInteger.withDefault(props.defaultPage || DefaultData.page),
	);
	const [status, setStatus] = useConditionalQueryState({
		key: 'status',
		defaultValue: defaultStatus || DefaultData.status,
		parser: parseAsStringLiteral(AuctionCycleStatusListFilter),
		syncWithSearchParams,
		onValueChange: () => setPage(props.defaultPage || DefaultData.page),
	});

	const queryKey = useMemo(
		() => ['dashboard', 'admin', 'paginatedAuctionCycles', status],
		[status],
	);
	const queryFn = useMemo<
		SortedOffsetPaginatedQueryProviderProps<IPaginatedAuctionCyclesContext>['queryFn']
	>(
		() => (page, perPage, sortBy, sortDirection) => () =>
			throwError(
				getPaginatedCycles({
					page,
					perPage,
					sortBy,
					sortDirection,
					status: status === 'all' ? undefined : status,
				}),
				'getPaginatedAuctionCycles',
			),
		[status],
	);

	return (
		<SortedOffsetPaginatedQueryProvider
			context={Context}
			defaultData={DefaultData}
			queryKey={queryKey}
			queryFn={queryFn}
			id={id}
			syncWithSearchParams={syncWithSearchParams}
			status={status}
			setStatus={setStatus}
			{...props}
		/>
	);
};

export {
	DefaultData as DefaultPaginatedAuctionCyclesContextData,
	Context as PaginatedAuctionCyclesContext,
};
