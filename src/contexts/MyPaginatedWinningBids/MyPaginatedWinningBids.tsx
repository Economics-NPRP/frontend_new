'use client';

import { BaseOffsetPaginatedQueryContextProvider } from 'contexts/BaseContextProviders';
import { useParams } from 'next/navigation';
import { createContext } from 'react';

import { throwError } from '@/helpers';
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
	const { auctionId } = useParams();

	return (
		<BaseOffsetPaginatedQueryContextProvider
			defaultPage={defaultPage}
			defaultPerPage={defaultPerPage}
			context={Context}
			defaultData={DefaultData}
			queryKey={['marketplace', '@catalogue', 'myPaginatedWinningBids', auctionId as string]}
			queryFn={(page, perPage) => () =>
				throwError(
					getMyPaginatedWinningBids({
						auctionId: auctionId as string,
						page,
						perPage,
					}),
				)
			}
			children={children}
		/>
	);
};

export {
	DefaultData as DefaultMyPaginatedWinningBidsContextData,
	Context as MyPaginatedWinningBidsContext,
};
