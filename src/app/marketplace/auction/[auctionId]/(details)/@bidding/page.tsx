'use client';

import { useFormatter } from 'next-intl';
import { useContext, useMemo } from 'react';

import { CurrencyBadge } from '@/components/Badge';
import { generateTrendData } from '@/helpers';
import { BidTable } from '@/pages/marketplace/auction/[auctionId]/(details)/_components/BidTable';
import {
	AuctionBiddingContext,
	AuctionDetailsContext,
} from '@/pages/marketplace/auction/[auctionId]/(details)/_components/Providers';
import { LineChart } from '@mantine/charts';
import { Button, Group, Progress, Stack, Text } from '@mantine/core';

import { EndedOverlay } from './EndedOverlay';
import { InsertForm } from './InsertForm';
import { JoinOverlay } from './JoinOverlay';

export default function Prompt() {
	const format = useFormatter();
	const { auctionData } = useContext(AuctionDetailsContext);
	const { bids, totalPermits, grandTotal, bidConfirmationModalActions } =
		useContext(AuctionBiddingContext);

	//	TODO: also check every second if the auction is still active
	const hasEnded = useMemo(
		() => new Date(auctionData.endDatetime).getTime() < Date.now(),
		[auctionData.endDatetime],
	);

	const readOnly = useMemo(() => !auctionData.hasJoined || hasEnded, [auctionData, hasEnded]);

	const data = useMemo(
		() =>
			generateTrendData({
				points: 20,
				trend: 'exponential',
				noise: 0.25,
				base: 6,
				growth: 1.25,
				label: 'Minimum Winning Bid',
			}),
		[],
	);

	return (
		<Stack className="relative">
			{!auctionData.hasJoined && !hasEnded && <JoinOverlay />}
			{hasEnded && <EndedOverlay />}
			<Stack>
				<Text>Buy Now Price</Text>
				<Group>
					<CurrencyBadge />
					<Text>1,400.00</Text>
				</Group>
				<Button disabled={readOnly}>Buy Now</Button>
			</Stack>
			<Group>
				<Stack>
					<LineChart
						w={320}
						h={240}
						data={data}
						dataKey="x"
						series={[{ name: 'Minimum Winning Bid', color: 'maroon.6' }]}
						curveType="natural"
						tickLine="xy"
						gridAxis="xy"
						xAxisLabel="Time"
						yAxisLabel="Minimum Winning Bid"
						xAxisProps={{
							type: 'number',
							domain: [0, 19],
							interval: 'preserveStartEnd',
						}}
					/>
					<Text>Minimum Winning Bid</Text>
					<Group>
						<CurrencyBadge />
						<Text>
							{format.number(data[data.length - 1]['Minimum Winning Bid'], 'money')}
						</Text>
					</Group>
				</Stack>
				<Stack>
					<InsertForm />
					<Group>
						<Text>{totalPermits} permits bid</Text>
						<Progress w={480} value={(totalPermits / auctionData.permits) * 100} />
						<Text>{auctionData.permits - totalPermits} permits left</Text>
					</Group>
					<BidTable />
					<Stack>
						<Text>Grand Total</Text>
						<Group>
							<Stack>
								<Text>Permits</Text>
								<Text>{format.number(totalPermits)}</Text>
							</Stack>
							<Stack>
								<Text>Emissions (tCO2e)</Text>
								<Text>{format.number(totalPermits * 1000)}</Text>
							</Stack>
							<Stack>
								<Text>Bid</Text>
								<Group>
									<CurrencyBadge />
									<Text>{format.number(grandTotal, 'money')}</Text>
								</Group>
							</Stack>
						</Group>
					</Stack>
				</Stack>
			</Group>
			<Button
				disabled={readOnly || bids.length === 0}
				onClick={bidConfirmationModalActions.open}
			>
				Place Bids
			</Button>
		</Stack>
	);
}
