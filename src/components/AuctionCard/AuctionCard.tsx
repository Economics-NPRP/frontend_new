import { useFormatter, useTranslations } from 'next-intl';
import Image from 'next/image';
import { ComponentPropsWithRef, useMemo } from 'react';

import { CategoryBadge, CurrencyBadge } from '@/components/Badge';
import { SmallCountdown } from '@/components/Countdown';
import { Id } from '@/components/Id';
import { IAuctionData } from '@/schema/models';
import {
	Anchor,
	Badge,
	Container,
	Group,
	Rating,
	Stack,
	Text,
	UnstyledButton,
} from '@mantine/core';
import { IconAlarm, IconLicense } from '@tabler/icons-react';

import classes from './styles.module.css';

export interface AuctionCardProps extends ComponentPropsWithRef<'div'> {
	auction: IAuctionData;
	fluid?: boolean;
}
export const AuctionCard = ({ auction, fluid, className, ...props }: AuctionCardProps) => {
	const t = useTranslations();
	const format = useFormatter();

	const url = useMemo(() => `/marketplace/auction/${auction.id}`, [auction.id]);

	const imgs = [
		'/imgs/industry/flare.jpg',
		// '/imgs/transport/airplane.webp',
		'/imgs/transport/airplane.jpg',
	];
	const src = useMemo(() => imgs[Math.floor(Math.random() * imgs.length)], []);
	const category = useMemo(() => (src.includes('flare') ? 'industry' : 'transport'), []);

	return (
		<Stack className={`${classes.root} ${fluid && classes.fluid} ${className}`} {...props}>
			<Group className={classes.header}>
				<Group className={classes.rating}>
					<Rating
						className={classes.value}
						size={'xs'}
						value={4.25}
						fractions={3}
						readOnly
					/>
					<Text className={classes.subtext}>{format.number(4.25)}</Text>
				</Group>
				<Group className={classes.countdown}>
					<IconAlarm size={14} />
					<SmallCountdown targetDate={auction.endDatetime} />
				</Group>
			</Group>
			<UnstyledButton className={classes.image} component="a" href={url}>
				<Image src={src} alt={'Image of a power plant'} fill />
				<Container className={classes.overlay} />
			</UnstyledButton>
			<Group className={classes.footer}>
				<Badge className={classes.permits} leftSection={<IconLicense size={14} />}>
					{t('components.auctionCard.permits', {
						permits: auction.permits,
						emissions: 1800,
					})}
				</Badge>
				<CategoryBadge className={classes.category} category={category} />
			</Group>
			<Group className={classes.label}>
				<Stack className={classes.left}>
					<Id value={auction.id} variant={category} />
					<Anchor className={classes.heading} href={url}>
						Flare Gas Burning
					</Anchor>
					<Anchor
						className={classes.company}
						target="_blank"
						href={`/marketplace/company/${auction.ownerId}`}
					>
						{auction.owner.name}
					</Anchor>
				</Stack>
				<Stack className={classes.right}>
					<Group className={classes.price}>
						<CurrencyBadge />
						<Text className={classes.value}>
							{format.number(auction.minBid, {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</Text>
					</Group>
					<Text className={classes.subtext}>{t('components.auctionCard.minBid')}</Text>
				</Stack>
			</Group>
		</Stack>
	);
};
