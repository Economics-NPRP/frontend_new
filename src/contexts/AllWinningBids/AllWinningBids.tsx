'use client';

import { useParams } from 'next/navigation';
import { createContext } from 'react';

import { OffsetPaginatedQueryProvider } from '@/contexts';
import { throwError } from '@/helpers';
import { getPaginatedWinningBids } from '@/lib/bids/open';
import { IBidData } from '@/schema/models';
import {
	OffsetPaginatedContextState,
	OffsetPaginatedProviderProps,
	getDefaultOffsetPaginatedContextState,
} from '@/types';

export interface IAllWinningBidsContext extends OffsetPaginatedContextState<IBidData> {}
const DefaultData = getDefaultOffsetPaginatedContextState<IBidData>();
const Context = createContext<IAllWinningBidsContext>(DefaultData);

export const AllWinningBidsProvider = ({ children }: OffsetPaginatedProviderProps) => {
	const { auctionId } = useParams();

	return (
		<OffsetPaginatedQueryProvider
			defaultPage={1}
			defaultPerPage={99999999999} //	Set a very high number to fetch all winning bids
			context={Context}
			defaultData={DefaultData}
			queryKey={['marketplace', auctionId as string, 'paginatedWinningBids']}
			queryFn={(page, perPage) => () =>
				throwError(
					getPaginatedWinningBids({
						auctionId: auctionId as string,
						page,
						perPage,
					}),
				)
			}
			children={children}
		/>
	);
};

export { DefaultData as DefaultAllWinningBidsContextData, Context as AllWinningBidsContext };
