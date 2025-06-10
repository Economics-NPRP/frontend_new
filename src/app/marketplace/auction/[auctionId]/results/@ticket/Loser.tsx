import { useContext } from 'react';

import { AuctionCard } from '@/components/AuctionCard';
import { SingleAuctionContext } from '@/contexts';
import { AuctionResultsPageContext } from '@/pages/marketplace/auction/[auctionId]/results/constants';
import { Button, Divider, Group, Stack, Text, Title } from '@mantine/core';

import classes from './styles.module.css';

export const Loser = () => {
	const auction = useContext(SingleAuctionContext);
	const { scrollToHistory } = useContext(AuctionResultsPageContext);

	return (
		<Stack className={`${classes.loser} ${classes.ticket}`}>
			<Stack className="items-center justify-center gap-0">
				<Title order={2}>No Permits Awarded</Title>
				<Text className="paragraph-md">
					You did not win any permits in this auction. However, you may still view the
					bidding history and analyze the auction results.
				</Text>
			</Stack>
			<Button onClick={scrollToHistory}>View Bidding History</Button>
			<Divider label="OR" />
			<Text className="text-center paragraph-md">
				Check out some similar auctions that you might be interested in:
			</Text>
			<Group className="grid grid-cols-12 gap-4">
				<AuctionCard auction={auction.data} />
				<AuctionCard auction={auction.data} />
				<AuctionCard auction={auction.data} />
				<AuctionCard auction={auction.data} />
			</Group>
		</Stack>
	);
};
