import { DateTime } from 'luxon';
import { useFormatter, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ComponentPropsWithRef, useEffect, useMemo } from 'react';

import { AuctionTypeBadge, CurrencyBadge, EndingSoonBadge, SectorBadge } from '@/components/Badge';
import { SmallCountdown } from '@/components/Countdown';
import { Id } from '@/components/Id';
import { Switch } from '@/components/SwitchCase';
import { WithSkeleton } from '@/components/WithSkeleton';
import { useAuctionAvailability, useJoinAuction } from '@/hooks';
import { IAuctionData } from '@/schema/models';
import {
	ActionIcon,
	Anchor,
	Avatar,
	Badge,
	Button,
	Container,
	Divider,
	Group,
	Skeleton,
	Stack,
	Text,
	Tooltip,
	UnstyledButton,
} from '@mantine/core';
import {
	IconArrowUpRight,
	IconAwardFilled,
	IconBookmark,
	IconCalendar,
	IconCheckbox,
	IconLicense,
	IconPhotoHexagon,
	IconShare,
} from '@tabler/icons-react';

import classes from './styles.module.css';

export interface AuctionCardProps extends ComponentPropsWithRef<'div'> {
	auction: IAuctionData;
	loading?: boolean;
}
export const AuctionCard = ({
	auction,
	loading = false,
	className,
	...props
}: AuctionCardProps) => {
	const t = useTranslations();
	const format = useFormatter();
	const router = useRouter();
	const { isUpcoming, hasEnded, isLive } = useAuctionAvailability(auction);

	const url = `/marketplace/auction/${auction.id}`;
	const bidsUrl = `/marketplace/auction/${auction.id}/results#history`;
	const resultsUrl = `/marketplace/auction/${auction.id}/results`;

	const imgs = [
		'/imgs/industry/flare.jpg',
		// '/imgs/transport/airplane.webp',
		'/imgs/transport/airplane.jpg',
	];
	const src = useMemo(() => imgs[Math.floor(Math.random() * imgs.length)], []);

	const joinAuction = useJoinAuction(auction.id, () => router.push(url));

	const currentState = useMemo(() => {
		if (loading) return 'loading';
		if (isUpcoming) return 'upcoming';
		if (isLive) return 'live';
		if (hasEnded) return 'ended';
	}, [loading, isUpcoming, isLive, hasEnded]);

	return (
		<Stack className={`${classes.root} ${className}`} {...props}>
			{auction.cycle && (
				<Tooltip
					label={t(`components.auctionCard.cycle.${auction.cycle.status}`)}
					position="top"
					offset={-16}
					withArrow
				>
					<Container
						className={`${classes.ribbon} ${auction.cycle.status === 'approved' ? classes.ongoing : ''}`}
					>
						<IconCalendar size={16} className={classes.icon} />
					</Container>
				</Tooltip>
			)}
			<UnstyledButton className={classes.image} component={Link} href={url}>
				<Switch value={loading}>
					<Switch.True>
						<Container className={classes.placeholder}>
							<IconPhotoHexagon size={32} className={classes.icon} />
						</Container>
					</Switch.True>
					<Switch.False>
						<Image src={src} alt={'Image of a power plant'} fill />
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
					</Switch.False>
				</Switch>
			</UnstyledButton>
			<Group className={classes.meta}>
				<Switch value={loading}>
					<Switch.True>
						<Badge className={classes.permits} leftSection={<IconLicense size={14} />}>
							<Skeleton width={160} height={18} visible data-dark />
						</Badge>
						<Badge className={classes.sector}>
							<Skeleton width={80} height={18} visible data-dark />
						</Badge>
					</Switch.True>
					<Switch.False>
						<Badge className={classes.permits} leftSection={<IconLicense size={14} />}>
							{t('constants.quantities.permits.withEmissions', {
								value: auction.permits,
								emissions: 1800,
							})}
						</Badge>
						<SectorBadge className={classes.sector} sector={auction.sector} />
					</Switch.False>
				</Switch>
			</Group>
			<Stack className={classes.body}>
				<Stack className={classes.header}>
					<WithSkeleton loading={loading} width={260} height={14}>
						<Id value={auction.id} variant={auction.sector} />
					</WithSkeleton>
					<Group className={classes.label}>
						<Stack className={classes.left}>
							<WithSkeleton loading={loading} width={160} height={24}>
								<Anchor component={Link} className={classes.heading} href={url}>
									{auction.title.split(" - ")[0]}
								</Anchor>
							</WithSkeleton>
						</Stack>
						<Group className={classes.right}>
							{!loading && (
								<>
									<ActionIcon className={classes.action} variant="outline">
										<IconBookmark size={14} />
									</ActionIcon>
									<ActionIcon className={classes.action} variant="outline">
										<IconShare size={14} />
									</ActionIcon>
								</>
							)}
						</Group>
					</Group>
					<Group className={classes.badges}>
						<AuctionTypeBadge type={auction.type} showOpen loading={loading} />
						<EndingSoonBadge auction={auction} loading={loading} />
					</Group>
					<Group className={classes.owner}>
						<WithSkeleton loading={loading} width={40} height={40} circle>
							<Avatar
								className={classes.avatar}
								size={'sm'}
								name={auction.owner && auction.owner.name}
							/>
						</WithSkeleton>
						<WithSkeleton loading={loading} width={160} height={24}>
							<Anchor
								className={classes.link}
								component={Link}
								target="_blank"
								href={`/marketplace/company/${auction.ownerId}`}
							>
								{auction.owner && auction.owner.name}
							</Anchor>
						</WithSkeleton>
					</Group>
				</Stack>
				<Divider className={classes.divider} />
				<Group className={classes.properties}>
					<Stack className={classes.cell}>
						<Switch value={currentState}>
							<Switch.Loading>
								<Skeleton width={70} height={16} visible className="my-0.5" />
								<Skeleton width={120} height={24} visible className="my-0.5" />
							</Switch.Loading>
							<Switch.Upcoming>
								<Text className={classes.subtext}>
									{t('constants.auctionStatus.startsIn.label')}
								</Text>
								<Tooltip
									label={DateTime.fromISO(auction.startDatetime).toLocaleString(
										DateTime.DATETIME_FULL,
									)}
								>
									<SmallCountdown
										className={classes.value}
										targetDate={auction.startDatetime}
									/>
								</Tooltip>
							</Switch.Upcoming>
							<Switch.Live>
								<Text className={classes.subtext}>
									{t('constants.auctionStatus.endsIn.label')}
								</Text>
								<Tooltip
									label={DateTime.fromISO(auction.endDatetime).toLocaleString(
										DateTime.DATETIME_FULL,
									)}
								>
									<SmallCountdown
										className={classes.value}
										targetDate={auction.endDatetime}
									/>
								</Tooltip>
							</Switch.Live>
							<Switch.Ended>
								<Text className={classes.subtext}>
									{t('components.auctionCard.numBids.label')}
								</Text>
								<Text className={classes.value}>
									{t('constants.quantities.bids.default', {
										value: auction.bidsCount,
									})}
								</Text>
							</Switch.Ended>
						</Switch>
					</Stack>
					<Divider className={classes.divider} orientation="vertical" />
					<Stack className={classes.cell}>
						<Switch value={currentState}>
							<Switch.Loading>
								<Skeleton width={70} height={16} visible className="my-0.5" />
								<Skeleton width={120} height={24} visible className="my-0.5" />
							</Switch.Loading>
							<Switch.Ended>
								<Text className={classes.subtext}>
									{t('components.auctionCard.numBidders.label')}
								</Text>
								<Text className={classes.value}>
									{t('constants.quantities.bidders.default', {
										value: auction.biddersCount,
									})}
								</Text>
							</Switch.Ended>
							<Switch.Else>
								<Text className={classes.subtext}>
									{t('constants.minWinningBid.med')}
								</Text>
								<Group className={classes.price}>
									<CurrencyBadge />
									<Text className={classes.value}>
										{format.number(auction.minBid, 'money')}
									</Text>
								</Group>
							</Switch.Else>
						</Switch>
					</Stack>
				</Group>
				<Divider className={classes.divider} />
				<Group className={classes.footer}>
					<Switch value={currentState}>
						<Switch.Loading>
							<Skeleton height={36} visible className="flex-auto" />
							<Skeleton height={36} visible className="flex-auto" />
						</Switch.Loading>
						<Switch.Ended>
							<Button
								className={`${classes.secondary} ${classes.button}`}
								variant="outline"
								component={Link}
								href={bidsUrl}
							>
								{t('constants.view.bids.label')}
							</Button>
							<Button
								className={`${classes.primary} ${classes.button}`}
								component={Link}
								href={resultsUrl}
								rightSection={<IconAwardFilled size={14} />}
							>
								{t('constants.view.results.label')}
							</Button>
						</Switch.Ended>
						<Switch.Else>
							<Switch value={auction.hasJoined}>
								<Switch.True>
									<Button
										className={`${classes.primary} ${classes.button}`}
										component={Link}
										href={url}
										rightSection={<IconArrowUpRight size={16} />}
									>
										{t('constants.view.auction.label')}
									</Button>
								</Switch.True>
								<Switch.False>
									<Button
										className={`${classes.secondary} ${classes.button}`}
										variant="outline"
										component={Link}
										href={url}
									>
										{t('constants.view.auction.label')}
									</Button>
									<Button
										className={`${classes.primary} ${classes.button}`}
										onClick={() => joinAuction.mutate()}
										rightSection={<IconCheckbox size={16} />}
										loading={joinAuction.isPending}
									>
										{t('constants.actions.joinAuction.label')}
									</Button>
								</Switch.False>
							</Switch>
						</Switch.Else>
					</Switch>
				</Group>
			</Stack>
		</Stack>
	);
};
