'use client';

import { DateTime } from 'luxon';
import { useFormatter } from 'next-intl';
import Image from 'next/image';
import { useContext } from 'react';

import { CurrencyBadge } from '@/components/Badge';
import { LargeCountdown } from '@/components/Countdown';
import { Case, FalseCase, Switch, TrueCase } from '@/components/SwitchCase';
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

	const isLoadingState = (
		<>
			<Stack className={classes.countdown}>
				<Skeleton width={80} height={24} visible />
				<LargeCountdown targetDate={auction.data.startDatetime} loading />
				<Skeleton width={200} height={22} visible />
			</Stack>
			<Group className={classes.prompt}>
				<Skeleton height={40} visible />
				<Skeleton height={40} visible />
			</Group>
		</>
	);

	const isUpcomingState = (
		<>
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
					<TrueCase>
						<Tooltip label="Auction has not started yet">
							<Button
								className={classes.cta}
								rightSection={<IconGavel size={16} />}
								disabled
							>
								Start Bidding
							</Button>
						</Tooltip>
					</TrueCase>
					<FalseCase>
						<Button
							className={classes.cta}
							onClick={() => joinAuction.mutate()}
							rightSection={<IconCheckbox size={16} />}
							loading={joinAuction.isPending}
						>
							Join Auction
						</Button>
					</FalseCase>
				</Switch>
			</Group>
		</>
	);

	const isLiveState = (
		<>
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
					<TrueCase>
						<Button
							className={classes.cta}
							rightSection={<IconGavel size={16} />}
							onClick={() => scrollToBidding({ alignment: 'center' })}
						>
							Start Bidding
						</Button>
					</TrueCase>
					<FalseCase>
						<Button
							className={classes.cta}
							onClick={() => joinAuction.mutate()}
							rightSection={<IconCheckbox size={16} />}
							loading={joinAuction.isPending}
						>
							Join Auction
						</Button>
					</FalseCase>
				</Switch>
			</Group>
		</>
	);

	const hasEndedState = (
		<>
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
		</>
	);

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
					<TrueCase>
						<Stack className={classes.section}>
							<Skeleton width={100} height={18} data-dark visible />
							<Skeleton width={120} height={24} data-dark visible />
						</Stack>
						<Stack className={classes.section}>
							<Skeleton width={100} height={18} data-dark visible />
							<Skeleton width={120} height={24} data-dark visible />
						</Stack>
						<Stack className={classes.section}>
							<Skeleton width={100} height={18} data-dark visible />
							<Skeleton width={120} height={24} data-dark visible />
						</Stack>
					</TrueCase>
					<FalseCase>
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
					</FalseCase>
				</Switch>
			</Group>
			<Switch>
				<Case when={auction.isLoading}>{isLoadingState}</Case>
				<Case when={isUpcoming}>{isUpcomingState}</Case>
				<Case when={isLive}>{isLiveState}</Case>
				<Case when={hasEnded}>{hasEndedState}</Case>
			</Switch>
		</Stack>
	);
}
