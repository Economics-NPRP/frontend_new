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
			<Stack className={classes.header}>
				<Title order={2} className={classes.title}>
					No Permits Awarded
				</Title>
				<Text className={classes.subtitle}>
					You did not win any permits in this auction. However, you may still view the
					bidding history and analyze the auction results.
				</Text>
			</Stack>
			<Button className={classes.button} onClick={scrollToHistory}>
				View Bidding History
			</Button>
			<Divider className={classes.divider} label="OR" />
			<Text className={classes.subtext}>
				Check out some similar auctions that you might be interested in:
			</Text>
			<Group className={classes.auctions}>
				<AuctionCard auction={auction.data} />
				<AuctionCard auction={auction.data} />
				<AuctionCard auction={auction.data} />
				<AuctionCard auction={auction.data} />
			</Group>
		</Stack>
	);
};
