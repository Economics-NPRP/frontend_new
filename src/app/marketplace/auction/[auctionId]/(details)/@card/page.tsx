'use client';

import { DateTime } from 'luxon';
import { useFormatter } from 'next-intl';
import Image from 'next/image';
import { useCallback, useContext } from 'react';

import { CurrencyBadge } from '@/components/Badge';
import { LargeCountdown } from '@/components/Countdown';
import { SingleAuctionContext } from '@/contexts';
import { throwError } from '@/helpers';
import { joinAuction } from '@/lib/auctions';
import { AuctionDetailsPageContext } from '@/pages/marketplace/auction/[auctionId]/(details)/_components/Providers';
import { Button, Container, Group, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconGavel, IconGitCompare, IconLeaf } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import classes from './styles.module.css';

export default function Card() {
	// const t = useTranslations();
	const format = useFormatter();
	const queryClient = useQueryClient();
	const auction = useContext(SingleAuctionContext);
	const { scrollToBidding } = useContext(AuctionDetailsPageContext);

	const mutation = useMutation({
		mutationFn: () => throwError(joinAuction(auction.data.id as string)),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['marketplace', auction.data.id],
			});
		},
		onError: ({ message }) => {
			notifications.show({
				color: 'red',
				title: 'There was a problem joining the auction',
				message,
				position: 'bottom-center',
			});
		},
		retry: false,
	});

	const handleJoinAuction = useCallback(() => mutation.mutate(), [mutation]);

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
				{auction.data.hasJoined && (
					<>
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
							onClick={() => scrollToBidding({ alignment: 'center' })}
						>
							Start Bidding
						</Button>
					</>
				)}
				{!auction.data.hasJoined && (
					<Button className={classes.cta} onClick={handleJoinAuction}>
						Join Auction
					</Button>
				)}
			</Group>
		</Stack>
	);
}
