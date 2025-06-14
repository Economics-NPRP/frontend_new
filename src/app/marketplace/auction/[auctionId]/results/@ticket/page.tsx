'use client';

import { useContext, useMemo } from 'react';

import { Switch } from '@/components/SwitchCase';
import { MyOpenAuctionResultsContext, SingleAuctionContext } from '@/contexts';
import { useAuctionAvailability } from '@/hooks';
import { Loading } from '@/pages/marketplace/auction/[auctionId]/results/@ticket/Loading';
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

	const currentState = useMemo(() => {
		if (myOpenAuctionResults.isLoading || auction.isLoading) return 'loading';
		if (!auction.data.hasJoined) return 'unjoined';
		if (auction.data.hasJoined && !areResultsAvailable) return 'live';
		if (areResultsAvailable && isWinner) return 'winner';
		if (areResultsAvailable && !isWinner) return 'loser';
	}, [auction.data, areResultsAvailable, isWinner]);

	return (
		<Stack className={classes.root}>
			<Group className={classes.header}>
				<Button component="a" href={'/marketplace'} leftSection={<IconArrowUpLeft />}>
					Return to Catalogue
				</Button>
			</Group>
			<Switch value={currentState}>
				<Switch.Loading>
					<Loading />
				</Switch.Loading>
				<Switch.Case when="unjoined">
					<Unjoined />
				</Switch.Case>
				<Switch.Live>
					<Ongoing />
				</Switch.Live>
				<Switch.Case when="winner">
					<Winner />
				</Switch.Case>
				<Switch.Case when="loser">
					<Loser />
				</Switch.Case>
			</Switch>
		</Stack>
	);
}
