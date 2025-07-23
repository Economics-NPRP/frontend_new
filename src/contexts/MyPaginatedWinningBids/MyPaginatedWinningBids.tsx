'use client';

import { useParams } from 'next/navigation';
import { createContext, useContext } from 'react';

import { MyUserProfileContext, OffsetPaginatedQueryProvider } from '@/contexts';
import { throwError } from '@/helpers';
import { useAuctionAvailability } from '@/hooks';
import { getMyPaginatedWinningBids } from '@/lib/bids/open';
import { IBidData } from '@/schema/models';
import {
	OffsetPaginatedContextState,
	OffsetPaginatedProviderProps,
	getDefaultOffsetPaginatedContextState,
} from '@/types';

export interface IMyPaginatedWinningBidsContext extends OffsetPaginatedContextState<IBidData> {}
const DefaultData = getDefaultOffsetPaginatedContextState<IBidData>();
const Context = createContext<IMyPaginatedWinningBidsContext>(DefaultData);

export const MyPaginatedWinningBidsProvider = ({
	defaultPage,
	defaultPerPage,
	children,
}: OffsetPaginatedProviderProps) => {
	const myUser = useContext(MyUserProfileContext);
	const { auctionId } = useParams();
	const { areBidsAvailable } = useAuctionAvailability();

	return (
		<OffsetPaginatedQueryProvider
			defaultPage={defaultPage}
			defaultPerPage={defaultPerPage}
			context={Context}
			defaultData={DefaultData}
			queryKey={[
				myUser.data.id,
				'marketplace',
				auctionId as string,
				'myPaginatedWinningBids',
			]}
			queryFn={(page, perPage) => () =>
				throwError(
					getMyPaginatedWinningBids({
						auctionId: auctionId as string,
						page,
						perPage,
					}),
					`getMyPaginatedWinningBids:${auctionId}`,
				)
			}
			id="myPaginatedWinningBids"
			disabled={!areBidsAvailable}
			children={children}
		/>
	);
};

export {
	DefaultData as DefaultMyPaginatedWinningBidsContextData,
	Context as MyPaginatedWinningBidsContext,
};
