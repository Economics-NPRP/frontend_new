'use client';

import { useParams } from 'next/navigation';
import { createContext } from 'react';

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

export interface IPaginatedWinningBidsContext extends OffsetPaginatedContextState<IBidData> {}
const DefaultData = getDefaultOffsetPaginatedContextState<IBidData>();
const Context = createContext<IPaginatedWinningBidsContext>(DefaultData);

export const PaginatedWinningBidsProvider = ({
	defaultPage,
	defaultPerPage,
	children,
}: OffsetPaginatedProviderProps) => {
	const { auctionId } = useParams();
	const { areBidsAvailable } = useAuctionAvailability();

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
					`getPaginatedWinningBids:${auctionId}`,
				)
			}
			id="paginatedWinningBids"
			disabled={!areBidsAvailable}
			children={children}
		/>
	);
};

export {
	DefaultData as DefaultPaginatedWinningBidsContextData,
	Context as PaginatedWinningBidsContext,
};
