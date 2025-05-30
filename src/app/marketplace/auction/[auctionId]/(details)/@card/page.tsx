'use client';

import { DateTime } from 'luxon';
import { useFormatter, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useContext } from 'react';

import { CurrencyBadge } from '@/components/Badge';
import { LargeCountdown } from '@/components/Countdown';
import { AuctionDetailsContext } from '@/pages/marketplace/auction/[auctionId]/(details)/_components/Providers';
import { Button, Container, Group, Stack, Text } from '@mantine/core';
import { IconGavel, IconShoppingBag } from '@tabler/icons-react';

import classes from './styles.module.css';

export default function Card() {
	const t = useTranslations();
	const format = useFormatter();
	const { auctionData } = useContext(AuctionDetailsContext);

	return (
		<Stack className={classes.root}>
			<Container className={classes.container}>
				<Container className={classes.image}>
					<Image
						src={auctionData.image || '/imgs/industry/flare.jpg'}
						alt={'Image of a power plant'}
						fill
					/>
				</Container>
			</Container>
			<Group className={classes.row}>
				<Stack className={classes.section}>
					<Text className={classes.subtext}>Buy Now Price</Text>
					<Group className={classes.price}>
						<CurrencyBadge className={classes.badge} />
						<Text className={classes.value}>
							{format.number(auctionData.minBid + 100, 'money')}
						</Text>
					</Group>
				</Stack>
				<Stack className={classes.section}>
					<Text className={classes.subtext}>Minimum Winning Bid</Text>
					<Group className={classes.price}>
						<CurrencyBadge className={classes.badge} />
						<Text className={classes.value}>
							{format.number(auctionData.minBid, 'money')}
						</Text>
					</Group>
				</Stack>
				<Stack className={classes.section}>
					<Text className={classes.subtext}>Minimum Increment</Text>
					<Group className={classes.price}>
						<CurrencyBadge className={classes.badge} />
						<Text className={classes.value}>{format.number(1, 'money')}</Text>
					</Group>
				</Stack>
			</Group>
			<Stack className={classes.countdown}>
				<Text className={classes.title}>Ending In</Text>
				<LargeCountdown targetDate={auctionData.endDatetime} />
				<Text className={classes.subtext}>
					{DateTime.fromISO(auctionData.endDatetime).toLocaleString(
						DateTime.DATETIME_FULL,
					)}
				</Text>
			</Stack>
			<Group className={classes.prompt}>
				<Button
					className={classes.cta}
					rightSection={<IconShoppingBag size={16} />}
					variant="outline"
				>
					Buy Now
				</Button>
				<Button className={classes.cta} rightSection={<IconGavel size={16} />}>
					Start Bidding
				</Button>
			</Group>
		</Stack>
	);
}
