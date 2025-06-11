'use client';

import { PropsWithChildren, ReactNode } from 'react';

import {
	AllOpenAuctionResultsProvider,
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
import classes from './styles.module.css';

export interface AuctionResultsProps {
	bids: ReactNode;
	details: ReactNode;
	ticket: ReactNode;
}
export default function AuctionResults({ bids, details, ticket }: AuctionResultsProps) {
	return withProviders(
		<>
			<Stack className={classes.root}>
				{ticket}
				{details}
				{bids}
			</Stack>
		</>,
		{ provider: PaginatedBidsProvider, props: { defaultPerPage: 20 } },
		{ provider: AllOpenAuctionResultsProvider },
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
