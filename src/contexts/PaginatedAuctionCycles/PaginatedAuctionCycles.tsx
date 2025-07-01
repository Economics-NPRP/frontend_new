'use client';

import { createContext, useMemo, useState } from 'react';

import { AuctionCycleStatusFilter } from '@/components/Tables/AuctionCycles';
import {
	SortedOffsetPaginatedQueryProvider,
	SortedOffsetPaginatedQueryProviderProps,
} from '@/contexts';
import { throwError } from '@/helpers';
import { getPaginatedFirms } from '@/lib/users/firms';
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
		20,
		'start_datetime',
		'desc',
	),
	status: 'all' as AuctionCycleStatusFilter,
	setStatus: () => {},
};
const Context = createContext<IPaginatedAuctionCyclesContext>(DefaultData);

export const PaginatedAuctionCyclesProvider = ({
	defaultPage,
	defaultPerPage,
	defaultSortBy,
	defaultSortDirection,
	children,
}: SortedOffsetPaginatedProviderProps) => {
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
				//	TODO: Implement the actual API call to fetch paginated auction cycles once backend is ready
				getPaginatedFirms({
					page,
					perPage,
					sortBy,
					sortDirection,
				}),
				'getPaginatedAuctionCycles',
			),
		[status],
	);

	return (
		<SortedOffsetPaginatedQueryProvider
			defaultPage={defaultPage}
			defaultPerPage={defaultPerPage}
			defaultSortBy={defaultSortBy}
			defaultSortDirection={defaultSortDirection}
			context={Context}
			defaultData={DefaultData}
			queryKey={queryKey}
			queryFn={queryFn}
			//	TODO: Temporarily disabling the query function until the API is ready
			disabled
			children={children}
			status={status}
			setStatus={setStatus}
		/>
	);
};

export {
	DefaultData as DefaultPaginatedAuctionCyclesContextData,
	Context as PaginatedAuctionCyclesContext,
};
