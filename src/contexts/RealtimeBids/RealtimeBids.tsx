'use client';

import { camelCase } from 'change-case/keys';
import { useParams } from 'next/navigation';
import { PropsWithChildren, createContext, useCallback, useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

export interface IRealtimeBidsContext {
	status: 'idle' | 'error' | 'loading' | 'new';
	setStatus: (status: IRealtimeBidsContext['status']) => void;

	latest: {
		type: 'new_bid' | 'bidder_join' | 'bidder_leave';
		data: {
			activeBidders: number;
			winningBidsCount: number;
		};
	};
}
const DefaultData: IRealtimeBidsContext = {
	status: 'loading',
	setStatus: () => {},

	latest: {
		type: 'bidder_join',
		data: {
			activeBidders: 0,
			winningBidsCount: 0,
		},
	},
};
const Context = createContext<IRealtimeBidsContext>(DefaultData);

export const RealtimeBidsProvider = ({ children, ...props }: PropsWithChildren) => {
	const queryClient = useQueryClient();
	const { auctionId } = useParams();

	const [status, setStatus] = useState<IRealtimeBidsContext['status']>(DefaultData.status);
	const [latest, setLatest] = useState<IRealtimeBidsContext['latest']>(DefaultData.latest);

	const handleOnOpen = useCallback(() => setStatus('idle'), [setStatus]);
	const handleOnError = useCallback(() => setStatus('error'), [setStatus]);
	const handleOnMessage = useCallback(
		() => (event: MessageEvent) => {
			const payload = camelCase(JSON.parse(event.data), 3) as IRealtimeBidsContext['latest'];
			if (payload.type === 'new_bid') setStatus('new');
			setLatest(payload);

			//	Invalidate any related queries
			queryClient.invalidateQueries({
				queryKey: ['marketplace', auctionId, 'paginatedBids'],
			});
			queryClient.invalidateQueries({
				queryKey: ['marketplace', auctionId, 'paginatedWinningBids'],
			});
		},
		[setLatest],
	);

	useEffect(() => {
		const queryUrl = new URL('/v1/notify/bidders', process.env.NEXT_PUBLIC_BACKEND_URL);
		queryUrl.searchParams.append('auction_id', auctionId as string);

		const eventSource = new EventSource(queryUrl, { withCredentials: true });
		eventSource.onopen = handleOnOpen;
		eventSource.onerror = handleOnError;

		//	Listen for new bids
		eventSource.onmessage = handleOnMessage();

		//	Add cleanup function
		return () => eventSource.close();
	}, [auctionId]);

	return (
		<Context.Provider
			value={{
				status,
				setStatus,

				latest,
				...props,
			}}
			children={children}
		/>
	);
};

export { DefaultData as DefaultRealtimeBidsContextData, Context as RealtimeBidsContext };
