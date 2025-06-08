'use client';

import { useParams } from 'next/navigation';
import { createContext, useContext, useMemo } from 'react';

import { KeysetPaginatedQueryProvider, SingleAuctionContext } from '@/contexts';
import { throwError } from '@/helpers';
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

export const PaginatedBidsProvider = ({
	defaultCursor,
	defaultPerPage,
	children,
}: KeysetPaginatedProviderProps) => {
	const auction = useContext(SingleAuctionContext);
	const { auctionId } = useParams();

	const areBidsAvailable = useMemo(
		() =>
			auction.isSuccess &&
			(auction.data.type === 'open' ||
				(auction.data.type === 'sealed' &&
					new Date(auction.data.endDatetime).getTime() < Date.now())),
		[auction.data.type, auction.data.endDatetime],
	);

	return (
		<KeysetPaginatedQueryProvider
			defaultCursor={defaultCursor}
			defaultPerPage={defaultPerPage}
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
				)
			}
			disabled={!areBidsAvailable}
			children={children}
		/>
	);
};

export { DefaultData as DefaultPaginatedBidsContextData, Context as PaginatedBidsContext };
