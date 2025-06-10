'use client';

import { MyOpenAuctionResultsContext } from 'contexts/MyOpenAuctionResults';
import { SingleAuctionContext } from 'contexts/SingleAuction';
import { useContext, useMemo } from 'react';

import { Loser } from '@/pages/marketplace/auction/[auctionId]/results/@ticket/Loser';
import { Winner } from '@/pages/marketplace/auction/[auctionId]/results/@ticket/Winner';
import { Button, Group, Stack } from '@mantine/core';
import { IconArrowUpLeft } from '@tabler/icons-react';

import classes from './styles.module.css';

export default function Ticket() {
	const auction = useContext(SingleAuctionContext);
	const myOpenAuctionResults = useContext(MyOpenAuctionResultsContext);

	const isEnded = useMemo(
		() => new Date(auction.data.endDatetime).getTime() < Date.now(),
		[auction.data.endDatetime],
	);
	const isWinner = useMemo(
		() => myOpenAuctionResults.data.permitsReserved > 0 && isEnded,
		[myOpenAuctionResults.data],
	);

	return (
		<Stack className={classes.root}>
			<Group className={classes.header}>
				<Button
					component="a"
					href={`/marketplace/auction/${auction.data.id}`}
					variant="outline"
					leftSection={<IconArrowUpLeft />}
				>
					Return to Auction Page
				</Button>
			</Group>
			{isWinner && <Winner />}
			{!isWinner && <Loser />}
		</Stack>
	);
}
