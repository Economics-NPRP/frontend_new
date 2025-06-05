'use client';

import { SingleAuctionContext } from 'contexts/SingleAuction';
import { useContext } from 'react';

import { AuctionCard } from '@/components/AuctionCard';
import { Group, Stack, Title } from '@mantine/core';

export default function Suggestions() {
	const auction = useContext(SingleAuctionContext);

	return (
		<Stack>
			<Title order={2}>Suggested Auctions</Title>
			<Group className="grid grid-cols-12 gap-4">
				<AuctionCard auction={auction.data} />
				<AuctionCard auction={auction.data} />
				<AuctionCard auction={auction.data} />
				<AuctionCard auction={auction.data} />
			</Group>
		</Stack>
	);
}
