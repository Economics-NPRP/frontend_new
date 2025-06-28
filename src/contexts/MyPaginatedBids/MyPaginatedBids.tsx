'use client';

import { useParams } from 'next/navigation';
import { createContext, useContext } from 'react';

import { KeysetPaginatedQueryProvider, MyUserProfileContext } from '@/contexts';
import { throwError } from '@/helpers';
import { useAuctionAvailability } from '@/hooks';
import { getPaginatedBids } from '@/lib/bids/open';
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
	const myUser = useContext(MyUserProfileContext);
	const { auctionId } = useParams();
	const { areBidsAvailable } = useAuctionAvailability();

	return (
		<KeysetPaginatedQueryProvider
			defaultCursor={defaultCursor}
			defaultPerPage={defaultPerPage}
			context={Context}
			defaultData={DefaultData}
			queryKey={[myUser.data.id, 'marketplace', auctionId as string, 'myPaginatedBids']}
			queryFn={(cursor, perPage) => () =>
				throwError(
					getPaginatedBids({
						auctionId: auctionId as string,
						bidderId: myUser.data.id,
						cursor,
						perPage,
					}),
					`getMyPaginatedBids:${auctionId}`,
				)
			}
			disabled={!areBidsAvailable}
			children={children}
		/>
	);
};

export { DefaultData as DefaultMyPaginatedBidsContextData, Context as MyPaginatedBidsContext };
