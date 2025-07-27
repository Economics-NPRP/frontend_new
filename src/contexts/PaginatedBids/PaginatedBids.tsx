'use client';

import { useParams } from 'next/navigation';
import { createContext } from 'react';

import { KeysetPaginatedQueryProvider } from '@/contexts';
import { throwError } from '@/helpers';
import { useAuctionAvailability } from '@/hooks';
import { getPaginatedBids } from '@/lib/bids/open';
import { IBidData } from '@/schema/models';
import {
	KeysetPaginatedContextState,
	KeysetPaginatedProviderProps,
	getDefaultKeysetPaginatedContextState,
} from '@/types';

export interface IPaginatedBidsContext extends KeysetPaginatedContextState<IBidData> {}
const DefaultData = getDefaultKeysetPaginatedContextState<IBidData>();
const Context = createContext<IPaginatedBidsContext>(DefaultData);

export const PaginatedBidsProvider = (props: KeysetPaginatedProviderProps) => {
	const { auctionId } = useParams();
	const { areBidsAvailable } = useAuctionAvailability();

	return (
		<KeysetPaginatedQueryProvider
			context={Context}
			defaultData={DefaultData}
			queryKey={['marketplace', auctionId as string, 'paginatedBids']}
			queryFn={(cursor, perPage) => () =>
				throwError(
					getPaginatedBids({
						auctionId: auctionId as string,
						cursor,
						perPage,
					}),
					`getPaginatedBids:${auctionId}`,
				)
			}
			id="paginatedBids"
			disabled={!areBidsAvailable}
			{...props}
		/>
	);
};

export { DefaultData as DefaultPaginatedBidsContextData, Context as PaginatedBidsContext };
