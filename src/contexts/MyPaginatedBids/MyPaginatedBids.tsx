'use client';

import { useParams } from 'next/navigation';
import { createContext, useContext } from 'react';

import { KeysetPaginatedQueryProvider } from '@/contexts';
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
	const { auctionId } = useParams();
	const { currentUser } = useContext(CurrentUserContext);

	return (
		<KeysetPaginatedQueryProvider
			defaultCursor={defaultCursor}
			defaultPerPage={defaultPerPage}
			context={Context}
			defaultData={DefaultData}
			queryKey={[
				'marketplace',
				'@catalogue',
				'myPaginatedBids',
				auctionId as string,
				currentUser.id,
			]}
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
			children={children}
		/>
	);
};

export { DefaultData as DefaultMyPaginatedBidsContextData, Context as MyPaginatedBidsContext };
