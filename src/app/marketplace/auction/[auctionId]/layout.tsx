import { ReactNode } from 'react';

import { Stack } from '@mantine/core';

export interface AuctionDetailsProps {
	bids: ReactNode;
	details: ReactNode;
	prompt: ReactNode;
}
export default async function AuctionPage({ bids, details, prompt }: AuctionDetailsProps) {
	return (
		<Stack>
			{details}
			{bids}
			{prompt}
		</Stack>
	);
}
