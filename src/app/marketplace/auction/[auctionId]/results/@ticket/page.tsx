'use client';

import { useContext, useMemo } from 'react';

import { MyOpenAuctionResultsContext, SingleAuctionContext } from '@/contexts';
import { useAuctionAvailability } from '@/hooks';
import { Loser } from '@/pages/marketplace/auction/[auctionId]/results/@ticket/Loser';
import { Ongoing } from '@/pages/marketplace/auction/[auctionId]/results/@ticket/Ongoing';
import { Unjoined } from '@/pages/marketplace/auction/[auctionId]/results/@ticket/Unjoined';
import { Winner } from '@/pages/marketplace/auction/[auctionId]/results/@ticket/Winner';
import { Button, Group, Stack } from '@mantine/core';
import { IconArrowUpLeft } from '@tabler/icons-react';

import classes from './styles.module.css';

export default function Ticket() {
	const auction = useContext(SingleAuctionContext);
	const myOpenAuctionResults = useContext(MyOpenAuctionResultsContext);

	const { areResultsAvailable } = useAuctionAvailability();

	const isWinner = useMemo(
		() => myOpenAuctionResults.data.permitsReserved > 0 && areResultsAvailable,
		[myOpenAuctionResults.data],
	);

	return (
		<Stack className={classes.root}>
			<Group className={classes.header}>
				<Button
					component="a"
					href={`/marketplace/auction/${auction.data.id}`}
					leftSection={<IconArrowUpLeft />}
				>
					Return to Auction Page
				</Button>
			</Group>
			{!auction.data.hasJoined && <Unjoined />}
			{!areResultsAvailable && <Ongoing />}
			{areResultsAvailable && isWinner && <Winner />}
			{areResultsAvailable && !isWinner && <Loser />}
		</Stack>
	);
}
