'use client';

import { DateTime } from 'luxon';
import { useFormatter, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useContext } from 'react';

import { CurrencyBadge } from '@/components/Badge';
import { LargeCountdown } from '@/components/Countdown';
import { SingleAuctionContext } from '@/contexts';
import { AuctionDetailsPageContext } from '@/pages/marketplace/auction/[auctionId]/(details)/_components/Providers';
import { Button, Container, Group, Stack, Text } from '@mantine/core';
import { IconGavel, IconGitCompare, IconLeaf } from '@tabler/icons-react';

import classes from './styles.module.css';

export default function Card() {
	const t = useTranslations();
	const format = useFormatter();
	const auction = useContext(SingleAuctionContext);
	const { scrollToBidding } = useContext(AuctionDetailsPageContext);

	return (
		<Stack className={classes.root}>
			<Container className={classes.container}>
				<Container className={classes.image}>
					<Image
						src={auction.data.image || '/imgs/industry/flare.jpg'}
						alt={'Image of a power plant'}
						fill
					/>
				</Container>
			</Container>
			<Group className={classes.row}>
				{/* <Stack className={classes.section}>
					<Text className={classes.subtext}>Buy Now Price</Text>
					<Group className={classes.price}>
						<CurrencyBadge className={classes.badge} />
						<Text className={classes.value}>
							{format.number(auction.data.minBid + 100, 'money')}
						</Text>
					</Group>
				</Stack> */}
				<Stack className={classes.section}>
					<Text className={classes.subtext}>Permits Offered</Text>
					<Group className={classes.price}>
						<Container className={classes.icon}>
							<IconLeaf size={14} />
						</Container>
						<Text className={classes.value}>{format.number(auction.data.permits)}</Text>
					</Group>
				</Stack>
				<Stack className={classes.section}>
					<Text className={classes.subtext}>Minimum Winning Bid</Text>
					<Group className={classes.price}>
						<CurrencyBadge className={classes.badge} />
						<Text className={classes.value}>
							{format.number(auction.data.minBid, 'money')}
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
				<LargeCountdown targetDate={auction.data.endDatetime} />
				<Text className={classes.subtext}>
					{DateTime.fromISO(auction.data.endDatetime).toLocaleString(
						DateTime.DATETIME_FULL,
					)}
				</Text>
			</Stack>
			<Group className={classes.prompt}>
				{/* <Button
					className={classes.cta}
					rightSection={<IconShoppingBag size={16} />}
					variant="outline"
				>
					Buy Now
				</Button> */}
				<Button
					className={classes.cta}
					rightSection={<IconGitCompare size={16} />}
					variant="outline"
				>
					Compare Auctions
				</Button>
				<Button
					className={classes.cta}
					rightSection={<IconGavel size={16} />}
					onClick={scrollToBidding}
				>
					Start Bidding
				</Button>
			</Group>
		</Stack>
	);
}
