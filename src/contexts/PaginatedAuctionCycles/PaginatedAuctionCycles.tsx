'use client';

import { createContext, useMemo, useState } from 'react';

import { AuctionCycleStatusFilter } from '@/components/Tables/AuctionCycles';
import {
	SortedOffsetPaginatedQueryProvider,
	SortedOffsetPaginatedQueryProviderProps,
} from '@/contexts';
import { throwError } from '@/helpers';
import { getPaginatedCycles } from '@/lib/cycles';
import { IAuctionCycleData } from '@/schema/models';
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
	setStatus: () => {},
};
const Context = createContext<IPaginatedAuctionCyclesContext>(DefaultData);

export const PaginatedAuctionCyclesProvider = (props: SortedOffsetPaginatedProviderProps) => {
	const [status, setStatus] = useState<AuctionCycleStatusFilter>(DefaultData.status);

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
			id="paginatedAuctionCycles"
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
