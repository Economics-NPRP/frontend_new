import { DateTime } from 'luxon';
import { useFormatter, useTranslations } from 'next-intl';
import Image from 'next/image';
import { ComponentPropsWithRef, useMemo } from 'react';

import { AuctionTypeBadge, CategoryBadge, CurrencyBadge } from '@/components/Badge';
import { SmallCountdown } from '@/components/Countdown';
import { Id } from '@/components/Id';
import { IAuctionData } from '@/schema/models';
import { AuctionCategory } from '@/types';
import {
	ActionIcon,
	Anchor,
	Badge,
	Container,
	Divider,
	Group,
	Stack,
	Text,
	Tooltip,
	UnstyledButton,
} from '@mantine/core';
import { IconAlarm, IconHeart, IconLicense, IconShare } from '@tabler/icons-react';

import classes from './styles.module.css';

const ENDING_SOON_THRESHOLD = 1000 * 60 * 60 * 24; // 1 day

export interface AuctionCardProps extends ComponentPropsWithRef<'div'> {
	auction: IAuctionData;
}
export const AuctionCard = ({ auction, className, ...props }: AuctionCardProps) => {
	const t = useTranslations();
	const format = useFormatter();

	const isEndingSoon = useMemo(
		() => DateTime.fromISO(auction.endDatetime).diffNow().milliseconds < ENDING_SOON_THRESHOLD,
		[auction.endDatetime],
	);

	const url = useMemo(() => `/marketplace/auction/${auction.id}`, [auction.id]);

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

	return (
		<Stack className={`${classes.root} ${className}`} {...props}>
			<UnstyledButton className={classes.image} component="a" href={url}>
				<Image src={src} alt={'Image of a power plant'} fill />
				<Container className={classes.overlay} />
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
								<IconHeart size={14} />
							</ActionIcon>
							<ActionIcon className={classes.action} variant="outline">
								<IconShare size={14} />
							</ActionIcon>
						</Group>
					</Group>
					<Group className={classes.badges}>
						<AuctionTypeBadge type={auction.type} />
						{isEndingSoon && (
							<Badge color="red" leftSection={<IconAlarm size={14} />}>
								{t('constants.auctionStatus.ending')}
							</Badge>
						)}
					</Group>
					<Id value={auction.id} variant={category} />
				</Stack>
				<Divider className={classes.divider} />
				<Group className={classes.footer}>
					<Stack className={classes.left}>
						<Text className={classes.subtext}>
							{t('components.auctionCard.timeLeft')}
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
					</Stack>
					<Divider className={classes.divider} orientation="vertical" />
					<Stack className={classes.right}>
						<Text className={classes.subtext}>
							{t('components.auctionCard.minBid')}
						</Text>
						<Group className={classes.price}>
							<CurrencyBadge />
							<Text className={classes.value}>
								{format.number(auction.minBid, 'money')}
							</Text>
						</Group>
					</Stack>
				</Group>
			</Stack>
		</Stack>
	);
};
