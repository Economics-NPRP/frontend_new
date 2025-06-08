'use client';

import { useParams } from 'next/navigation';
import { createContext, useContext, useMemo } from 'react';

import { OffsetPaginatedQueryProvider, SingleAuctionContext } from '@/contexts';
import { throwError } from '@/helpers';
import { getPaginatedWinningBids } from '@/lib/bids/open';
import { IBidData } from '@/schema/models';
import {
	OffsetPaginatedContextState,
	OffsetPaginatedProviderProps,
	getDefaultOffsetPaginatedContextState,
} from '@/types';

export interface IPaginatedWinningBidsContext extends OffsetPaginatedContextState<IBidData> {}
const DefaultData = getDefaultOffsetPaginatedContextState<IBidData>();
const Context = createContext<IPaginatedWinningBidsContext>(DefaultData);

export const PaginatedWinningBidsProvider = ({
	defaultPage,
	defaultPerPage,
	children,
}: OffsetPaginatedProviderProps) => {
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
		<OffsetPaginatedQueryProvider
			defaultPage={defaultPage}
			defaultPerPage={defaultPerPage}
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
			disabled={!areBidsAvailable}
			children={children}
		/>
	);
};

export {
	DefaultData as DefaultPaginatedWinningBidsContextData,
	Context as PaginatedWinningBidsContext,
};
