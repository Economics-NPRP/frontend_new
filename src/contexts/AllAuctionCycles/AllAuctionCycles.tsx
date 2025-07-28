'use client';

import { useParams } from 'next/navigation';
import { createContext } from 'react';

import { OffsetPaginatedQueryProvider } from '@/contexts';
import { throwError } from '@/helpers';
import { getPaginatedCycles } from '@/lib/cycles';
import { IAuctionCycleData } from '@/schema/models';
import {
	SortedOffsetPaginatedContextState,
	SortedOffsetPaginatedProviderProps,
	getDefaultSortedOffsetPaginatedContextState,
} from '@/types';

export interface IAllAuctionCyclesContext
	extends SortedOffsetPaginatedContextState<IAuctionCycleData> {}
const DefaultData = getDefaultSortedOffsetPaginatedContextState<IAuctionCycleData>();
const Context = createContext<IAllAuctionCyclesContext>(DefaultData);

export const AllAuctionCyclesProvider = ({
	defaultSortBy,
	defaultSortDirection,
	id = 'allAuctionCycles',
	...props
}: SortedOffsetPaginatedProviderProps) => {
	const { auctionId } = useParams();

	return (
		<OffsetPaginatedQueryProvider
			defaultPage={1}
			defaultPerPage={100} //	TODO: check why backend is limiting to 100
			defaultSortBy={defaultSortBy}
			defaultSortDirection={defaultSortDirection}
			context={Context}
			defaultData={DefaultData}
			queryKey={['dashboard', 'admin', 'paginatedAuctionCycles']}
			queryFn={(page, perPage) => () =>
				throwError(
					getPaginatedCycles({
						page,
						perPage,
					}),
					`getAllAuctionCycles:${auctionId}`,
				)
			}
			id={id}
			{...props}
		/>
	);
};

export { DefaultData as DefaultAllAuctionCyclesContextData, Context as AllAuctionCyclesContext };
