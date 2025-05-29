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
import { Button, Divider, Group, Progress, Slider, Stack, Text } from '@mantine/core';

import { EndedOverlay } from './EndedOverlay';
import { InsertForm } from './InsertForm';
import { JoinOverlay } from './JoinOverlay';
import classes from './styles.module.css';

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
		<Stack className={classes.root}>
			{!auctionData.hasJoined && !hasEnded && <JoinOverlay />}
			{hasEnded && <EndedOverlay />}
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
					<BidTable />
				</Stack>
			</Group>
			<Group className={classes.footer}>
				<Group className={classes.content}>
					<Group className={classes.cell}>
						<Text className={classes.value}>{format.number(totalPermits)}</Text>
						<Text className={classes.unit}>Permits Bid</Text>
					</Group>
					<Slider
						classNames={{
							root: classes.slider,
							thumb: classes.thumb,
						}}
						marks={[
							{ value: 25, label: Math.round(0.25 * auctionData.permits) },
							{ value: 50, label: Math.round(0.5 * auctionData.permits) },
							{ value: 75, label: Math.round(0.75 * auctionData.permits) },
						]}
						value={(totalPermits / auctionData.permits) * 100}
					/>
					<Group className={classes.cell}>
						<Text className={classes.value}>
							{format.number(auctionData.permits - totalPermits)}
						</Text>
						<Text className={classes.unit}>Permits Left</Text>
					</Group>
				</Group>
				<Divider orientation="vertical" />
				<Button
					className={classes.cta}
					disabled={readOnly || bids.length === 0}
					onClick={bidConfirmationModalActions.open}
				>
					Place Bids
				</Button>
			</Group>
		</Stack>
	);
}
