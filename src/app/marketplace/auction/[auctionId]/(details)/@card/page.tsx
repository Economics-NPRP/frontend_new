'use client';

import { DateTime } from 'luxon';
import { useFormatter, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useContext, useMemo } from 'react';

import { CurrencyBadge } from '@/components/Badge';
import { LargeCountdown } from '@/components/Countdown';
import { Switch } from '@/components/SwitchCase';
import { SingleAuctionContext } from '@/contexts';
import { useAuctionAvailability, useJoinAuction } from '@/hooks';
import { AuctionDetailsPageContext } from '@/pages/marketplace/auction/[auctionId]/(details)/_components/Providers';
import { Button, Container, Group, Skeleton, Stack, Text, Tooltip } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
	IconAwardFilled,
	IconCheckbox,
	IconGavel,
	IconGitCompare,
	IconLicense,
} from '@tabler/icons-react';

import classes from './styles.module.css';

export default function Card() {
	const t = useTranslations();
	const format = useFormatter();
	const isMobile = useMediaQuery('(max-width: 48em)');
	const auction = useContext(SingleAuctionContext);
	const { scrollToBidding } = useContext(AuctionDetailsPageContext);

	const { isUpcoming, hasEnded, isLive } = useAuctionAvailability();

	const joinAuction = useJoinAuction(auction.data.id);

	const bidsUrl = `/marketplace/auction/${auction.data.id}/results#history`;
	const resultsUrl = `/marketplace/auction/${auction.data.id}/results`;

	const currentState = useMemo(() => {
		if (auction.isLoading) return 'loading';
		if (isUpcoming) return 'upcoming';
		if (isLive) return 'live';
		if (hasEnded) return 'ended';
	}, [auction.isLoading, isUpcoming, isLive, hasEnded]);

	return (
		<Stack className={classes.root}>
			<Container className={classes.container}>
				<Container className={classes.image}>
					<Image
						src={auction.data.image || '/imgs/industry/flare.jpg'}
						alt={'Image of a power plant'}
						fill
					/>
					<Stack
						className={`${classes.overlay} ${(hasEnded || isUpcoming) && classes.blurred}`}
					>
						<Switch value={currentState}>
							<Switch.Ended>
								<Text className={classes.text}>
									{t('constants.auctionStatus.ended.label')}
								</Text>
							</Switch.Ended>
							<Switch.Upcoming>
								<Text className={classes.text}>
									{t('constants.auctionStatus.upcoming.label')}
								</Text>
							</Switch.Upcoming>
						</Switch>
					</Stack>
				</Container>
			</Container>
			<Group className={classes.row}>
				<Switch value={auction.isLoading}>
					<Switch.True>
						<Stack className={classes.section}>
							<Text className={classes.subtext}>
								{isMobile
									? t('constants.permitsOffered.short')
									: t('constants.permitsOffered.full')}
							</Text>
							<Skeleton width={120} height={24} data-dark visible />
						</Stack>
						<Stack className={classes.section}>
							<Text className={classes.subtext}>
								{isMobile
									? t('constants.minWinningBid.short')
									: t('constants.minWinningBid.med')}
							</Text>
							<Skeleton width={120} height={24} data-dark visible />
						</Stack>
						<Stack className={classes.section}>
							<Text className={classes.subtext}>
								{isMobile
									? t('constants.minBidIncrement.short')
									: t('constants.minBidIncrement.med')}
							</Text>
							<Skeleton width={120} height={24} data-dark visible />
						</Stack>
					</Switch.True>
					<Switch.False>
						<Stack className={classes.section}>
							<Text className={classes.subtext}>
								{isMobile
									? t('constants.permitsOffered.short')
									: t('constants.permitsOffered.full')}
							</Text>
							<Group className={classes.price}>
								<Container className={classes.icon}>
									<IconLicense size={14} />
								</Container>
								<Text className={classes.value}>
									{format.number(auction.data.permits)}
								</Text>
							</Group>
						</Stack>
						<Stack className={classes.section}>
							<Text className={classes.subtext}>
								{isMobile
									? t('constants.minWinningBid.short')
									: t('constants.minWinningBid.med')}
							</Text>
							<Group className={classes.price}>
								<CurrencyBadge className={classes.badge} />
								<Text className={classes.value}>
									{format.number(auction.data.minBid, 'money')}
								</Text>
							</Group>
						</Stack>
						<Stack className={classes.section}>
							<Text className={classes.subtext}>
								{isMobile
									? t('constants.minBidIncrement.short')
									: t('constants.minBidIncrement.med')}
							</Text>
							<Group className={classes.price}>
								<CurrencyBadge className={classes.badge} />
								<Text className={classes.value}>{format.number(1, 'money')}</Text>
							</Group>
						</Stack>
					</Switch.False>
				</Switch>
			</Group>
			<Switch value={currentState}>
				<Switch.Loading>
					<Stack className={classes.countdown}>
						<LargeCountdown targetDate={auction.data.startDatetime} loading />
					</Stack>
					<Group className={classes.prompt}>
						<Skeleton height={40} visible />
						<Skeleton height={40} visible />
					</Group>
				</Switch.Loading>
				<Switch.Upcoming>
					<Stack className={classes.countdown}>
						<Text className={classes.title}>
							{t('constants.auctionStatus.startingIn.label')}
						</Text>
						<LargeCountdown targetDate={auction.data.startDatetime} />
						<Text className={classes.subtext}>
							{DateTime.fromISO(auction.data.startDatetime).toLocaleString(
								DateTime.DATETIME_FULL,
							)}
						</Text>
					</Stack>
					<Group className={classes.prompt}>
						<Button
							className={`${classes.secondary} ${classes.cta}`}
							rightSection={<IconGitCompare size={16} />}
							variant="outline"
						>
							{t('marketplace.auction.details.card.actions.compare.label')}
						</Button>
						<Switch value={auction.data.hasJoined}>
							<Switch.True>
								<Tooltip
									label={t(
										'marketplace.auction.details.card.actions.startBidding.tooltipUpcoming',
									)}
								>
									<Button
										className={`${classes.primary} ${classes.cta}`}
										rightSection={<IconGavel size={16} />}
										disabled
									>
										{t(
											'marketplace.auction.details.card.actions.startBidding.label',
										)}
									</Button>
								</Tooltip>
							</Switch.True>
							<Switch.False>
								<Button
									className={`${classes.primary} ${classes.cta}`}
									onClick={() => joinAuction.mutate()}
									rightSection={<IconCheckbox size={16} />}
									loading={joinAuction.isPending}
								>
									{t('constants.actions.joinAuction.label')}
								</Button>
							</Switch.False>
						</Switch>
					</Group>
				</Switch.Upcoming>
				<Switch.Live>
					<Stack className={classes.countdown}>
						<Text className={classes.title}>
							{t('constants.auctionStatus.endingIn.label')}
						</Text>
						<LargeCountdown targetDate={auction.data.endDatetime} />
						<Text className={classes.subtext}>
							{DateTime.fromISO(auction.data.endDatetime).toLocaleString(
								DateTime.DATETIME_FULL,
							)}
						</Text>
					</Stack>
					<Group className={classes.prompt}>
						<Button
							className={`${classes.secondary} ${classes.cta}`}
							rightSection={<IconGitCompare size={16} />}
							variant="outline"
						>
							{t('marketplace.auction.details.card.actions.compare.label')}
						</Button>
						<Switch value={auction.data.hasJoined}>
							<Switch.True>
								<Button
									className={`${classes.primary} ${classes.cta}`}
									rightSection={<IconGavel size={16} />}
									onClick={() => scrollToBidding({ alignment: 'center' })}
								>
									{t(
										'marketplace.auction.details.card.actions.startBidding.label',
									)}
								</Button>
							</Switch.True>
							<Switch.False>
								<Button
									className={`${classes.primary} ${classes.cta}`}
									onClick={() => joinAuction.mutate()}
									rightSection={<IconCheckbox size={16} />}
									loading={joinAuction.isPending}
								>
									{t('constants.actions.joinAuction.label')}
								</Button>
							</Switch.False>
						</Switch>
					</Group>
				</Switch.Live>
				<Switch.Ended>
					<Stack className={classes.countdown}>
						<Text className={classes.title}>
							{t('constants.auctionStatus.auctionEnded.label')}
						</Text>
						<LargeCountdown targetDate={auction.data.endDatetime} />
						<Text className={classes.subtext}>
							{DateTime.fromISO(auction.data.endDatetime).toLocaleString(
								DateTime.DATETIME_FULL,
							)}
						</Text>
					</Stack>
					<Group className={classes.prompt}>
						<Button
							className={`${classes.secondary} ${classes.cta}`}
							component={Link}
							href={bidsUrl}
							rightSection={<IconGavel size={16} />}
							variant="outline"
						>
							{t('constants.view.bids.label')}
						</Button>
						<Button
							className={`${classes.primary} ${classes.cta}`}
							component={Link}
							href={resultsUrl}
							rightSection={<IconAwardFilled size={16} />}
							onClick={() => scrollToBidding({ alignment: 'center' })}
						>
							{t('constants.view.results.label')}
						</Button>
					</Group>
				</Switch.Ended>
			</Switch>
		</Stack>
	);
}
