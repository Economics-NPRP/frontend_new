'use client';

import { BaseKeysetPaginatedQueryContextProvider } from 'contexts/BaseContextProviders';
import { useParams } from 'next/navigation';
import { createContext } from 'react';

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
	const { auctionId } = useParams();

	return (
		<BaseKeysetPaginatedQueryContextProvider
			defaultCursor={defaultCursor}
			defaultPerPage={defaultPerPage}
			context={Context}
			defaultData={DefaultData}
			queryKey={['marketplace', '@catalogue', 'paginatedBids', auctionId as string]}
			queryFn={(cursor, perPage) => () =>
				throwError(
					getPaginatedBids({
						auctionId: auctionId as string,
						cursor,
						perPage,
					}),
				)
			}
			children={children}
		/>
	);
};

export { DefaultData as DefaultPaginatedBidsContextData, Context as PaginatedBidsContext };
