'use client';

import { DateTime } from 'luxon';
import { useFormatter } from 'next-intl';
import Image from 'next/image';
import { useContext, useMemo } from 'react';

import { CurrencyBadge } from '@/components/Badge';
import { LargeCountdown } from '@/components/Countdown';
import { Switch } from '@/components/SwitchCase';
import { SingleAuctionContext } from '@/contexts';
import { useAuctionAvailability, useJoinAuction } from '@/hooks';
import { AuctionDetailsPageContext } from '@/pages/marketplace/auction/[auctionId]/(details)/_components/Providers';
import { Button, Container, Group, Skeleton, Stack, Text, Tooltip } from '@mantine/core';
import {
	IconAwardFilled,
	IconCheckbox,
	IconGavel,
	IconGitCompare,
	IconLeaf,
} from '@tabler/icons-react';

import classes from './styles.module.css';

export default function Card() {
	// const t = useTranslations();
	const format = useFormatter();
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
						{hasEnded && <Text className={classes.text}>Ended</Text>}
						{isUpcoming && <Text className={classes.text}>Upcoming</Text>}
					</Stack>
				</Container>
			</Container>
			<Group className={classes.row}>
				<Switch value={auction.isLoading}>
					<Switch.True>
						<Stack className={classes.section}>
							<Text className={classes.subtext}>Permits Offered</Text>
							<Skeleton width={120} height={24} data-dark visible />
						</Stack>
						<Stack className={classes.section}>
							<Text className={classes.subtext}>Minimum Bid</Text>
							<Skeleton width={120} height={24} data-dark visible />
						</Stack>
						<Stack className={classes.section}>
							<Text className={classes.subtext}>Minimum Increment</Text>
							<Skeleton width={120} height={24} data-dark visible />
						</Stack>
					</Switch.True>
					<Switch.False>
						<Stack className={classes.section}>
							<Text className={classes.subtext}>Permits Offered</Text>
							<Group className={classes.price}>
								<Container className={classes.icon}>
									<IconLeaf size={14} />
								</Container>
								<Text className={classes.value}>
									{format.number(auction.data.permits)}
								</Text>
							</Group>
						</Stack>
						<Stack className={classes.section}>
							<Text className={classes.subtext}>Minimum Bid</Text>
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
					</Switch.False>
				</Switch>
			</Group>
			<Switch value={currentState}>
				<Switch.Case when={'loading'}>
					<Stack className={classes.countdown}>
						<LargeCountdown targetDate={auction.data.startDatetime} loading />
					</Stack>
					<Group className={classes.prompt}>
						<Skeleton height={40} visible />
						<Skeleton height={40} visible />
					</Group>
				</Switch.Case>
				<Switch.Case when={'upcoming'}>
					<Stack className={classes.countdown}>
						<Text className={classes.title}>Starting In</Text>
						<LargeCountdown targetDate={auction.data.startDatetime} />
						<Text className={classes.subtext}>
							{DateTime.fromISO(auction.data.startDatetime).toLocaleString(
								DateTime.DATETIME_FULL,
							)}
						</Text>
					</Stack>
					<Group className={classes.prompt}>
						<Button
							className={classes.cta}
							rightSection={<IconGitCompare size={16} />}
							variant="outline"
						>
							Compare Auctions
						</Button>
						<Switch value={auction.data.hasJoined}>
							<Switch.True>
								<Tooltip label="Auction has not started yet">
									<Button
										className={classes.cta}
										rightSection={<IconGavel size={16} />}
										disabled
									>
										Start Bidding
									</Button>
								</Tooltip>
							</Switch.True>
							<Switch.False>
								<Button
									className={classes.cta}
									onClick={() => joinAuction.mutate()}
									rightSection={<IconCheckbox size={16} />}
									loading={joinAuction.isPending}
								>
									Join Auction
								</Button>
							</Switch.False>
						</Switch>
					</Group>
				</Switch.Case>
				<Switch.Case when={'live'}>
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
						<Button
							className={classes.cta}
							rightSection={<IconGitCompare size={16} />}
							variant="outline"
						>
							Compare Auctions
						</Button>
						<Switch value={auction.data.hasJoined}>
							<Switch.True>
								<Button
									className={classes.cta}
									rightSection={<IconGavel size={16} />}
									onClick={() => scrollToBidding({ alignment: 'center' })}
								>
									Start Bidding
								</Button>
							</Switch.True>
							<Switch.False>
								<Button
									className={classes.cta}
									onClick={() => joinAuction.mutate()}
									rightSection={<IconCheckbox size={16} />}
									loading={joinAuction.isPending}
								>
									Join Auction
								</Button>
							</Switch.False>
						</Switch>
					</Group>
				</Switch.Case>
				<Switch.Case when={'ended'}>
					<Stack className={classes.countdown}>
						<Text className={classes.title}>Auction Ended</Text>
						<LargeCountdown targetDate={auction.data.endDatetime} />
						<Text className={classes.subtext}>
							{DateTime.fromISO(auction.data.endDatetime).toLocaleString(
								DateTime.DATETIME_FULL,
							)}
						</Text>
					</Stack>
					<Group className={classes.prompt}>
						<Button
							className={classes.cta}
							component="a"
							href={bidsUrl}
							rightSection={<IconGavel size={16} />}
							variant="outline"
						>
							View Bids
						</Button>
						<Button
							className={classes.cta}
							component="a"
							href={resultsUrl}
							rightSection={<IconAwardFilled size={16} />}
							onClick={() => scrollToBidding({ alignment: 'center' })}
						>
							View Results
						</Button>
					</Group>
				</Switch.Case>
			</Switch>
		</Stack>
	);
}
