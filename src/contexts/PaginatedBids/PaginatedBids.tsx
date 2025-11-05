'use client';

import { useParams } from 'next/navigation';
import { createContext, useContext, useMemo } from 'react';
import { MyUserProfileContext } from '@/contexts';

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

export const PaginatedBidsProvider = ({
	id = 'paginatedBids',
	...props
}: KeysetPaginatedProviderProps) => {
	const { auctionId } = useParams();
	const { areBidsAvailable } = useAuctionAvailability();
	const myUser = useContext(MyUserProfileContext)
	const isAdmin = useMemo(() => myUser?.data?.type === 'admin', [myUser?.data?.type]);

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
			id={id}
			disabled={!areBidsAvailable && !isAdmin}
			{...props}
		/>
	);
};

export { DefaultData as DefaultPaginatedBidsContextData, Context as PaginatedBidsContext };
