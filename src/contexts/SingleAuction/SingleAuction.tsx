'use client';

import { useParams } from 'next/navigation';
import { createContext } from 'react';

import { QueryProvider } from '@/contexts';
import { throwError } from '@/helpers';
import { getSingleAuction } from '@/lib/auctions';
import { DefaultAuctionData, IAuctionData } from '@/schema/models';
import { CoreProviderProps, ServerContextState, getDefaultContextState } from '@/types';

export interface ISingleAuctionContext extends ServerContextState<IAuctionData> {}
const DefaultData = getDefaultContextState(DefaultAuctionData);
const Context = createContext<ISingleAuctionContext>(DefaultData);

export const SingleAuctionProvider = ({ id = 'singleAuction', ...props }: CoreProviderProps) => {
	const { auctionId } = useParams();

	return (
		<QueryProvider
			context={Context}
			defaultData={DefaultData}
			queryKey={['marketplace', auctionId as string, 'singleAuction']}
			queryFn={() => () =>
				throwError(getSingleAuction(auctionId as string), `getSingleAuction:${auctionId}`)
			}
			id={id}
			{...props}
		/>
	);
};

export { DefaultData as DefaultSingleAuctionContextData, Context as SingleAuctionContext };
