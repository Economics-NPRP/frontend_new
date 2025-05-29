'use client';

import { useContext } from 'react';

import { AuctionCard } from '@/components/AuctionCard';
import { Group, Stack, Title } from '@mantine/core';

import { AuctionDetailsContext } from '../_components/Providers/constants';

export default function Suggestions() {
	const { auctionData } = useContext(AuctionDetailsContext);

	return (
		<Stack>
			<Title order={2}>Suggested Auctions</Title>
			<Group className="grid grid-cols-12 gap-4">
				<AuctionCard auction={auctionData} />
				<AuctionCard auction={auctionData} />
				<AuctionCard auction={auctionData} />
				<AuctionCard auction={auctionData} />
			</Group>
		</Stack>
	);
}
