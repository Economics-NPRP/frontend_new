import { DateTime } from 'luxon';
import { useFormatter, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ComponentPropsWithRef, useMemo } from 'react';

import {
	AuctionTypeBadge,
	CategoryBadge,
	CurrencyBadge,
	EndingSoonBadge,
} from '@/components/Badge';
import { SmallCountdown } from '@/components/Countdown';
import { Id } from '@/components/Id';
import { Switch } from '@/components/SwitchCase';
import { useAuctionAvailability, useJoinAuction } from '@/hooks';
import { IAuctionData } from '@/schema/models';
import { AuctionCategory } from '@/types';
import {
	ActionIcon,
	Anchor,
	Badge,
	Button,
	Divider,
	Group,
	Stack,
	Text,
	Tooltip,
	UnstyledButton,
} from '@mantine/core';
import {
	IconArrowUpRight,
	IconAwardFilled,
	IconBookmark,
	IconCheckbox,
	IconLicense,
	IconShare,
} from '@tabler/icons-react';

import classes from './styles.module.css';

export interface AuctionCardProps extends ComponentPropsWithRef<'div'> {
	auction: IAuctionData;
}
export const AuctionCard = ({ auction, className, ...props }: AuctionCardProps) => {
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
	const categories: Array<AuctionCategory> = [
		'energy',
		'industry',
		'transport',
		'buildings',
		'agriculture',
		'waste',
	];
	const src = useMemo(() => imgs[Math.floor(Math.random() * imgs.length)], []);
	const category = useMemo(() => categories[Math.floor(Math.random() * categories.length)], []);

	const joinAuction = useJoinAuction(auction.id, () => router.push(url));

	const currentState = useMemo(() => {
		if (isUpcoming) return 'upcoming';
		if (isLive) return 'live';
		if (hasEnded) return 'ended';
	}, [isUpcoming, isLive, hasEnded]);

	return (
		<Stack className={`${classes.root} ${className}`} {...props}>
			<UnstyledButton className={classes.image} component="a" href={url}>
				<Image src={src} alt={'Image of a power plant'} fill />
				<Stack
					className={`${classes.overlay} ${(hasEnded || isUpcoming) && classes.blurred}`}
				>
					<Switch value={currentState}>
						<Switch.Ended>
							<Text className={classes.text}>Ended</Text>
						</Switch.Ended>
						<Switch.Upcoming>
							<Text className={classes.text}>Upcoming</Text>
						</Switch.Upcoming>
					</Switch>
				</Stack>
			</UnstyledButton>
			<Group className={classes.meta}>
				<Badge className={classes.permits} leftSection={<IconLicense size={14} />}>
					{t('components.auctionCard.permits', {
						permits: auction.permits,
						emissions: 1800,
					})}
				</Badge>
				<CategoryBadge className={classes.category} category={category} />
			</Group>
			<Stack className={classes.body}>
				<Stack className={classes.header}>
					<Group className={classes.label}>
						<Stack className={classes.left}>
							<Anchor
								className={classes.company}
								target="_blank"
								href={`/marketplace/company/${auction.ownerId}`}
							>
								{auction.owner.name}
							</Anchor>
							<Anchor className={classes.heading} href={url}>
								Flare Gas Burning
							</Anchor>
						</Stack>
						<Group className={classes.right}>
							<ActionIcon className={classes.action} variant="outline">
								<IconBookmark size={14} />
							</ActionIcon>
							<ActionIcon className={classes.action} variant="outline">
								<IconShare size={14} />
							</ActionIcon>
						</Group>
					</Group>
					<Group className={classes.badges}>
						<AuctionTypeBadge type={auction.type} />
						<EndingSoonBadge auction={auction} />
					</Group>
					<Id value={auction.id} variant={category} />
				</Stack>
				<Divider className={classes.divider} />
				<Group className={classes.properties}>
					<Stack className={classes.cell}>
						<Switch value={currentState}>
							<Switch.Upcoming>
								<Text className={classes.subtext}>
									{t('components.auctionCard.startsIn')}
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
									{t('components.auctionCard.endsIn')}
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
									{t('components.auctionCard.numBids')}
								</Text>
								<Text className={classes.value}>
									{/* TODO: show actual number of bids from backend */}
									{format.number(auction.bids, 'money')} Bids
								</Text>
							</Switch.Ended>
						</Switch>
					</Stack>
					<Divider className={classes.divider} orientation="vertical" />
					<Stack className={classes.cell}>
						<Switch value={currentState}>
							<Switch.Upcoming>
								<Text className={classes.subtext}>
									{t('components.auctionCard.minBid')}
								</Text>
								<Group className={classes.price}>
									<CurrencyBadge />
									<Text className={classes.value}>
										{format.number(auction.minBid, 'money')}
									</Text>
								</Group>
							</Switch.Upcoming>
							<Switch.Live>
								<Text className={classes.subtext}>
									{t('components.auctionCard.minBid')}
								</Text>
								<Group className={classes.price}>
									<CurrencyBadge />
									<Text className={classes.value}>
										{format.number(auction.minBid, 'money')}
									</Text>
								</Group>
							</Switch.Live>
							<Switch.Ended>
								<Text className={classes.subtext}>
									{t('components.auctionCard.numBidders')}
								</Text>
								<Text className={classes.value}>
									{/* TODO: show actual number of bidders from backend */}
									{format.number(auction.bids, 'money')} Bidders
								</Text>
							</Switch.Ended>
						</Switch>
					</Stack>
				</Group>
				<Divider className={classes.divider} />
				<Group className={classes.footer}>
					<Switch value={currentState}>
						<Switch.Ended>
							<Button
								className={`${classes.secondary} ${classes.button}`}
								variant="outline"
								component="a"
								href={bidsUrl}
							>
								View Bids
							</Button>
							<Button
								className={`${classes.primary} ${classes.button}`}
								component="a"
								href={resultsUrl}
								rightSection={<IconAwardFilled size={14} />}
							>
								View Results
							</Button>
						</Switch.Ended>
						<Switch.Else>
							<Switch value={auction.hasJoined}>
								<Switch.True>
									<Button
										className={`${classes.primary} ${classes.button}`}
										component="a"
										href={url}
										rightSection={<IconArrowUpRight size={16} />}
									>
										View Auction
									</Button>
								</Switch.True>
								<Switch.False>
									<Button
										className={`${classes.secondary} ${classes.button}`}
										variant="outline"
										component="a"
										href={url}
									>
										View Auction
									</Button>
									<Button
										className={`${classes.primary} ${classes.button}`}
										onClick={() => joinAuction.mutate()}
										rightSection={<IconCheckbox size={16} />}
										loading={joinAuction.isPending}
									>
										Join Auction
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
