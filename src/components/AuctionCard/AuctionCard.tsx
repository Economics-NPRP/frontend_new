import { DateTime } from 'luxon';
import { useFormatter, useTranslations } from 'next-intl';
import Image from 'next/image';
import { ComponentPropsWithRef } from 'react';

import { CategoryBadge, CurrencyBadge } from '@/components/Badge';
import { SmallCountdown } from '@/components/Countdown';
import { Id } from '@/components/Id';
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
	fluid?: boolean;
}
export const AuctionCard = ({ fluid, className, ...props }: AuctionCardProps) => {
	const t = useTranslations();
	const format = useFormatter();

	// const targetDate = DateTime.fromObject({ year: 2024, month: 12, day: 28 });
	const targetDate = DateTime.now().plus({ hours: 5 });

	const imgs = [
		'/imgs/industry/flare.jpg',
		// '/imgs/transport/airplane.webp',
		'/imgs/transport/airplane.jpg',
	];
	const src = imgs[Math.floor(Math.random() * imgs.length)];
	const category = src.includes('flare') ? 'industry' : 'transport';

	return (
		<Stack className={`${classes.root} ${fluid && 'fluid'} ${className}`} {...props}>
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
					<SmallCountdown targetDate={targetDate.toISO()!} />
				</Group>
			</Group>
			<UnstyledButton
				className={classes.image}
				component="a"
				href="/marketplace/auction/123456"
			>
				<Image src={src} alt={'Image of a power plant'} fill />
				<Container className={classes.overlay} />
			</UnstyledButton>
			<Group className={classes.footer}>
				<Badge className={classes.permits} leftSection={<IconLicense size={14} />}>
					{t('components.auctionCard.permits', { permits: 180, emissions: 1800 })}
				</Badge>
				<CategoryBadge className={classes.category} category={category} />
			</Group>
			<Group className={classes.label}>
				<Stack className={classes.left}>
					<Id value={123456} variant="industry" />
					<Anchor className={classes.heading} href="/marketplace/auction/123456">
						Flare Gas Burning
					</Anchor>
					<Anchor
						className={classes.company}
						target="_blank"
						href="/marketplace/company/123456"
					>
						QatarEnergy LNG
					</Anchor>
				</Stack>
				<Stack className={classes.right}>
					<Group className={classes.price}>
						<CurrencyBadge />
						<Text className={classes.value}>
							{format.number(1000, {
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
