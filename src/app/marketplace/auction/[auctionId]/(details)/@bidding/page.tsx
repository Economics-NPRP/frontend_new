'use client';

import { useFormatter, useTranslations } from 'next-intl';
import { useCallback, useContext, useMemo } from 'react';

import { CurrencyBadge } from '@/components/Badge';
import { MediumCountdown } from '@/components/Countdown';
import { Switch } from '@/components/SwitchCase';
import { RealtimeBidsContext, SingleAuctionContext } from '@/contexts';
import { generateTrendData } from '@/helpers';
import { useAuctionAvailability } from '@/hooks';
import { LoadingOverlay } from '@/pages/marketplace/auction/[auctionId]/(details)/@bidding/LoadingOverlay';
import { UpcomingOverlay } from '@/pages/marketplace/auction/[auctionId]/(details)/@bidding/UpcomingOverlay';
import { BiddingTable } from '@/pages/marketplace/auction/[auctionId]/(details)/_components/BiddingTable';
import { AuctionDetailsPageContext } from '@/pages/marketplace/auction/[auctionId]/(details)/_components/Providers';
import { Sparkline } from '@mantine/charts';
import {
	Button,
	Divider,
	Group,
	Indicator,
	Slider,
	Stack,
	Text,
	Title,
	Tooltip,
} from '@mantine/core';
import { IconGavel } from '@tabler/icons-react';

import { EndedOverlay } from './EndedOverlay';
import { InsertForm } from './InsertForm';
import { JoinOverlay } from './JoinOverlay';
import classes from './styles.module.css';

export default function Prompt() {
	const t = useTranslations();
	const format = useFormatter();
	const auction = useContext(SingleAuctionContext);
	const realtimeBids = useContext(RealtimeBidsContext);
	const {
		openBidsDrawer,
		biddingTableRef,
		bids,
		totalPermits,
		grandTotal,
		bidConfirmationModalActions,
	} = useContext(AuctionDetailsPageContext);

	const { isUpcoming, hasEnded, isLive } = useAuctionAvailability();

	const readOnly = useMemo(() => !auction.data.hasJoined || hasEnded, [auction.data, hasEnded]);

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

	const handleOpenDrawer = useCallback(() => {
		realtimeBids.setStatus('idle');
		openBidsDrawer();
	}, [realtimeBids, openBidsDrawer]);

	const currentState = useMemo(() => {
		if (auction.isLoading) return 'loading';
		if (isUpcoming) return 'upcoming';
		if (isLive && !auction.data.hasJoined) return 'unjoined';
		if (hasEnded) return 'ended';
	}, [auction.isLoading, isUpcoming, isLive, auction.data.hasJoined, hasEnded]);

	return (
		<Stack className={classes.root}>
			<Switch value={currentState}>
				<Switch.Loading>
					<LoadingOverlay />
				</Switch.Loading>
				<Switch.Upcoming>
					<UpcomingOverlay />
				</Switch.Upcoming>
				<Switch.Unjoined>
					<JoinOverlay />
				</Switch.Unjoined>
				<Switch.Ended>
					<EndedOverlay />
				</Switch.Ended>
			</Switch>
			<Group className={classes.body}>
				<Stack className={classes.content}>
					<Group className={classes.header}>
						<Stack className={classes.label}>
							<Title order={2} className={classes.title}>
								{t('marketplace.auction.details.bidding.header.title')}
							</Title>
							<Text className={classes.subtitle}>
								{t('marketplace.auction.details.bidding.header.subtitle')}
							</Text>
							<Text className={classes.bidders}>
								{t('marketplace.auction.details.bidding.header.bidders', {
									value: realtimeBids.latest.data.activeBidders,
								})}
							</Text>
						</Stack>
						<MediumCountdown
							className={classes.countdown}
							targetDate={auction.data.endDatetime}
						/>
					</Group>
					<BiddingTable ref={biddingTableRef} />
				</Stack>
				<Stack className={classes.sidebar}>
					<Group className={classes.minBid}>
						<Stack className={classes.content}>
							<Text className={classes.key}>{t('constants.minWinningBid.full')}</Text>
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
								<b>{format.number(34.52, 'money')}%</b>{' '}
								{t('marketplace.auction.details.bidding.sidebar.minBid.subtext')}
							</Text>
						</Stack>
						<Sparkline
							className={classes.sparkline}
							w={140}
							h={80}
							color="#000000"
							data={data.map((data) => data['Minimum Winning Bid'])}
							curveType="natural"
						/>
					</Group>
					<Group className={classes.minIncrement}>
						<Text className={classes.key}>{t('constants.minBidIncrement.full')}</Text>
						<Group className={classes.value}>
							<CurrencyBadge />
							<Text className={classes.amount}>
								{/* TODO: update with actual value from auction */}
								{format.number(1, 'money')}
							</Text>
						</Group>
					</Group>
					<Group className={`${classes.bids} bg-grid-md`}>
						<Indicator
							className={classes.indicator}
							size={8}
							color="red"
							disabled={realtimeBids.status !== 'new'}
							processing
						>
							<Button
								className={classes.button}
								variant="outline"
								rightSection={<IconGavel size={16} />}
								onClick={handleOpenDrawer}
							>
								{t('constants.view.allBids.label')}
							</Button>
						</Indicator>
					</Group>
					<InsertForm />
				</Stack>
			</Group>
			<Group className={classes.footer}>
				<Group className={classes.content}>
					<Group className={classes.cell}>
						<Text className={classes.value}>{format.number(totalPermits)}</Text>
						<Text className={classes.unit}>
							{t('marketplace.auction.details.bidding.footer.progress.left.unit')}
						</Text>
					</Group>
					<Slider
						classNames={{
							root: classes.slider,
							bar: classes.bar,
							mark: classes.mark,
							thumb: classes.thumb,
						}}
						marks={[
							{ value: 25, label: Math.round(0.25 * auction.data.permits) },
							{ value: 50, label: Math.round(0.5 * auction.data.permits) },
							{ value: 75, label: Math.round(0.75 * auction.data.permits) },
						]}
						value={
							auction.data.permits > 0
								? (totalPermits / auction.data.permits) * 100
								: 0
						}
					/>
					<Group className={classes.cell}>
						<Text className={classes.value}>
							{format.number(auction.data.permits - totalPermits)}
						</Text>
						<Text className={classes.unit}>
							{t('marketplace.auction.details.bidding.footer.progress.right.unit')}
						</Text>
					</Group>
				</Group>
				<Divider orientation="vertical" />
				<Group className={classes.summary}>
					<Group className={classes.total}>
						<CurrencyBadge />
						<Text className={classes.value}>{format.number(grandTotal, 'money')}</Text>
					</Group>
					<Divider orientation="vertical" />
					<Tooltip
						position="top"
						label={t('marketplace.auction.details.bidding.footer.cta.tooltip')}
					>
						<Button
							className={classes.cta}
							disabled={readOnly || bids.length === 0 || isUpcoming || hasEnded}
							onClick={bidConfirmationModalActions.open}
						>
							{t('constants.actions.placeBids.label')}
						</Button>
					</Tooltip>
				</Group>
			</Group>
		</Stack>
	);
}
