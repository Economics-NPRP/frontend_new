'use client';

import { PropsWithChildren, ReactNode } from 'react';

import {
	AllWinningBidsProvider,
	MyOpenAuctionResultsProvider,
	MyPaginatedBidsProvider,
	PaginatedBidsProvider,
	PaginatedOpenAuctionResultsProvider,
	PaginatedWinningBidsProvider,
} from '@/contexts';
import { withProviders } from '@/helpers';
import { Stack } from '@mantine/core';
import { useScrollIntoView } from '@mantine/hooks';

import { AuctionResultsPageContext } from './constants';

export interface AuctionResultsProps {
	bids: ReactNode;
	details: ReactNode;
	ticket: ReactNode;
}
export default function AuctionResults({ bids, details, ticket }: AuctionResultsProps) {
	return withProviders(
		<>
			<Stack>
				{ticket}
				{details}
				{bids}
			</Stack>
		</>,
		{ provider: PaginatedBidsProvider, props: { defaultPerPage: 20 } },
		{ provider: AllWinningBidsProvider },
		{ provider: PaginatedWinningBidsProvider, props: { defaultPerPage: 20 } },
		{ provider: MyPaginatedBidsProvider, props: { defaultPerPage: 20 } },
		{ provider: PaginatedOpenAuctionResultsProvider },
		{ provider: MyOpenAuctionResultsProvider },
		{ provider: PageProvider },
	);
}

const PageProvider = ({ children }: PropsWithChildren) => {
	const { scrollIntoView: scrollToHistory, targetRef: historyRef } = useScrollIntoView();
	return (
		<AuctionResultsPageContext.Provider
			value={{
				scrollToHistory,
				historyRef,
			}}
		>
			{children}
		</AuctionResultsPageContext.Provider>
	);
};
