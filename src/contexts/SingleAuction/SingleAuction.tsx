'use client';

import { useParams } from 'next/navigation';
import { PropsWithChildren, createContext } from 'react';

import { BaseQueryContextProvider } from '@/contexts';
import { throwError } from '@/helpers';
import { getSingleAuction } from '@/lib/auctions';
import { DefaultAuctionData, IAuctionData } from '@/schema/models';
import { ServerContextState, getDefaultContextState } from '@/types';

export interface ISingleAuctionContext extends ServerContextState<IAuctionData> {}
const DefaultData = getDefaultContextState(DefaultAuctionData);
const Context = createContext<ISingleAuctionContext>(DefaultData);

export const SingleAuctionProvider = ({ children }: PropsWithChildren) => {
	const { auctionId } = useParams();

	return (
		<BaseQueryContextProvider
			context={Context}
			defaultData={DefaultData}
			queryKey={['marketplace', '@catalogue', 'singleAuction', auctionId as string]}
			queryFn={() => throwError(getSingleAuction(auctionId as string))}
			children={children}
		/>
	);
};

export { DefaultData as DefaultSingleAuctionContextData, Context as SingleAuctionContext };
