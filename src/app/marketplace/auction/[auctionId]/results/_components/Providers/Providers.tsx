'use client';

import { PropsWithChildren } from 'react';

import { AuctionResultsPageContext } from '@/pages/marketplace/auction/[auctionId]/results/_components/Providers/constants';
import { useScrollIntoView } from '@mantine/hooks';

export const PageProvider = ({ children }: PropsWithChildren) => {
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
