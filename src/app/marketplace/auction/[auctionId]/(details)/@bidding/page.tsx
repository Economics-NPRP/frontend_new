'use client';

import { useFormatter } from 'next-intl';
import { useContext, useMemo } from 'react';

import { CurrencyBadge } from '@/components/Badge';
import { SmallCountdown } from '@/components/Countdown';
import { generateTrendData } from '@/helpers';
import { BidTable } from '@/pages/marketplace/auction/[auctionId]/(details)/_components/BidTable';
import {
	AuctionBiddingContext,
	AuctionDetailsContext,
} from '@/pages/marketplace/auction/[auctionId]/(details)/_components/Providers';
import { Sparkline } from '@mantine/charts';
import { Button, Divider, Group, Slider, Stack, Text, Title } from '@mantine/core';
import { IconGavel, IconTrophy } from '@tabler/icons-react';

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
			<Group className={classes.body}>
				<Stack className={classes.content}>
					<Group className={classes.header}>
						<Stack className={classes.label}>
							<Title order={2} className={classes.title}>
								Bidding Table
							</Title>
							<Text className={classes.subtitle}>
								Add your bids to the table below. When you're ready, click the
								"Place Bids" button to submit them all at once.
							</Text>
						</Stack>
						{/* TODO: replace with medium countdown when available */}
						<SmallCountdown
							className={classes.countdown}
							targetDate={auctionData.endDatetime}
						/>
					</Group>
					<Divider />
					<BidTable />
				</Stack>
				<Stack className={classes.sidebar}>
					<Group className={classes.minBid}>
						<Stack className={classes.content}>
							<Text className={classes.key}>Minimum Winning Bid</Text>
							<Group className={classes.value}>
								<CurrencyBadge />
								<Text className={classes.amount}>
									{format.number(
										data[data.length - 1]['Minimum Winning Bid'],
										'money',
									)}
								</Text>
							</Group>
							<Text className={classes.subtext}>
								<b>34%</b> increase in the past 24 hours
							</Text>
						</Stack>
						<Sparkline
							w={140}
							h={80}
							data={data.map((data) => data['Minimum Winning Bid'])}
							curveType="natural"
						/>
					</Group>
					<Group className={classes.minIncrement}>
						<Text className={classes.key}>Minimum Bid Increment</Text>
						<Group className={classes.value}>
							<CurrencyBadge />
							<Text className={classes.amount}>
								{/* TODO: update with actual value from auction */}
								{format.number(1, 'money')}
							</Text>
						</Group>
					</Group>
					<Group className={`${classes.bids} bg-grid-md`}>
						<Button
							className={classes.button}
							variant="outline"
							rightSection={<IconTrophy size={16} />}
						>
							View Winning Bids
						</Button>
						<Button
							className={classes.button}
							variant="outline"
							rightSection={<IconGavel size={16} />}
						>
							View Your Bids
						</Button>
					</Group>
					<InsertForm />
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
						value={
							auctionData.permits > 0 ? (totalPermits / auctionData.permits) * 100 : 0
						}
					/>
					<Group className={classes.cell}>
						<Text className={classes.value}>
							{format.number(auctionData.permits - totalPermits)}
						</Text>
						<Text className={classes.unit}>Permits Left</Text>
					</Group>
				</Group>
				<Divider orientation="vertical" />
				<Group className={classes.total}>
					<CurrencyBadge />
					<Text className={classes.value}>{format.number(grandTotal, 'money')}</Text>
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
