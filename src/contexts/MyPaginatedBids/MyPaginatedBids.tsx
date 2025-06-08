'use client';

import { useParams } from 'next/navigation';
import { createContext, useContext, useMemo } from 'react';

import { KeysetPaginatedQueryProvider, SingleAuctionContext } from '@/contexts';
import { throwError } from '@/helpers';
import { getPaginatedBids } from '@/lib/bids/open';
import { CurrentUserContext } from '@/pages/globalContext';
import { IBidData } from '@/schema/models';
import {
	KeysetPaginatedContextState,
	KeysetPaginatedProviderProps,
	getDefaultKeysetPaginatedContextState,
} from '@/types';

export interface IMyPaginatedBidsContext extends KeysetPaginatedContextState<IBidData> {}
const DefaultData: KeysetPaginatedContextState<IBidData> =
	getDefaultKeysetPaginatedContextState<IBidData>();
const Context = createContext<IMyPaginatedBidsContext>(DefaultData);

export const MyPaginatedBidsProvider = ({
	defaultCursor,
	defaultPerPage,
	children,
}: KeysetPaginatedProviderProps) => {
	const auction = useContext(SingleAuctionContext);
	const { auctionId } = useParams();
	const { currentUser } = useContext(CurrentUserContext);

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
			queryKey={[currentUser.id, 'marketplace', auctionId as string, 'myPaginatedBids']}
			queryFn={(cursor, perPage) => () =>
				throwError(
					getPaginatedBids({
						auctionId: auctionId as string,
						bidderId: currentUser.id,
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

export { DefaultData as DefaultMyPaginatedBidsContextData, Context as MyPaginatedBidsContext };
