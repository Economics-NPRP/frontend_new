'use client';

import { useFormatter } from 'next-intl';
import { useParams } from 'next/navigation';
import { useCallback, useContext } from 'react';

import { CurrencyBadge } from '@/components/Badge';
import { throwError } from '@/helpers';
import { placeBid } from '@/lib/bids/open';
import { CurrentUserContext } from '@/pages/globalContext';
import { BiddingTable } from '@/pages/marketplace/auction/[auctionId]/(details)/_components/BiddingTable';
import { AuctionDetailsPageContext } from '@/pages/marketplace/auction/[auctionId]/(details)/_components/Providers';
import {
	Button,
	Container,
	Divider,
	Group,
	Loader,
	Modal,
	Stack,
	Text,
	Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCoins, IconLeaf, IconLicense } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import classes from './styles.module.css';

export default function BidConfirmationModal() {
	const format = useFormatter();
	const queryClient = useQueryClient();
	const { auctionId } = useParams();
	const { currentUser } = useContext(CurrentUserContext);

	const {
		bids,
		bidConfirmationModalOpened,
		bidConfirmationModalActions,
		totalPermits,
		grandTotal,
		resetState,
	} = useContext(AuctionDetailsPageContext);

	const mutation = useMutation({
		mutationFn: () =>
			throwError(
				placeBid({
					auctionId: auctionId as string,
					bids: bids.map(({ permit, bid }) => ({ permits: permit, amount: bid })),
				}),
			),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['marketplace', auctionId, 'paginatedWinningBids'],
			});
			queryClient.invalidateQueries({
				queryKey: [currentUser.id, 'marketplace', auctionId, 'myPaginatedBids'],
			});
			queryClient.invalidateQueries({
				queryKey: [currentUser.id, 'marketplace', auctionId, 'myPaginatedWinningBids'],
			});
			queryClient.invalidateQueries({
				queryKey: [currentUser.id, 'marketplace', auctionId, 'myOpenAuctionResults'],
			});

			notifications.show({
				color: 'green',
				title: 'Bids placed successfully',
				message: `You placed ${bids.length} bids for a total of QAR ${format.number(grandTotal, 'money')}`,
				position: 'bottom-center',
			});

			//	Close the bid confirmation modal and reset the bids
			bidConfirmationModalActions.close();
			resetState();
		},
		onError: ({ message }) => {
			notifications.show({
				color: 'red',
				title: 'There was a problem placing your bids',
				message,
				position: 'bottom-center',
			});
		},
		retry: false,
	});

	const onPlaceBidHandler = useCallback(() => mutation.mutate(), [mutation]);

	return (
		<Modal
			opened={bidConfirmationModalOpened}
			onClose={bidConfirmationModalActions.close}
			size={'xl'}
			withCloseButton={false}
			closeOnClickOutside={!mutation.isPending}
			classNames={{
				root: `${classes.root} ${mutation.isPending ? classes.loading : ''}`,
				inner: classes.inner,
				content: classes.content,
				body: classes.body,
			}}
			centered
		>
			{mutation.isPending && <Loader />}
			{!mutation.isPending && (
				<>
					<Title order={2} className={classes.title}>
						Place Your Bid(s)
					</Title>
					<Text className={classes.description}>
						You are about to place the following bids, review your bids before placing
						them. Once placed, you cannot edit or delete the bids.
					</Text>
					<BiddingTable className={classes.table} readOnly />
					<Divider label="GRAND TOTAL" className={classes.divider} />
					<Group className={classes.summary}>
						<Stack className={classes.cell}>
							<Container className={classes.icon}>
								<IconLicense size={16} />
							</Container>
							<Text className={classes.key}>Permits</Text>
							<Group className={classes.row}>
								<Text className={classes.value}>{format.number(totalPermits)}</Text>
								<Text className={classes.unit}>permits</Text>
							</Group>
						</Stack>
						<Divider orientation="vertical" className={classes.divider} />
						<Stack className={classes.cell}>
							<Container className={classes.icon}>
								<IconLeaf size={16} />
							</Container>
							<Text className={classes.key}>Emissions</Text>
							<Group className={classes.row}>
								<Text className={classes.value}>
									{format.number(totalPermits * 1000)}
								</Text>
								<Text className={classes.unit}>tCO2e</Text>
							</Group>
						</Stack>
						<Divider orientation="vertical" className={classes.divider} />
						<Stack className={classes.cell}>
							<Container className={classes.icon}>
								<IconCoins size={16} />
							</Container>
							<Text className={classes.key}>Total Bid</Text>
							<Group className={classes.row}>
								<CurrencyBadge />
								<Text className={classes.value}>
									{format.number(grandTotal, 'money')}
								</Text>
							</Group>
						</Stack>
					</Group>
					<Group className={classes.actions}>
						<Button
							className={classes.button}
							variant="outline"
							onClick={bidConfirmationModalActions.close}
						>
							Cancel
						</Button>
						<Button
							className={classes.button}
							onClick={onPlaceBidHandler}
							color="green"
						>
							Confirm and Place Bid(s)
						</Button>
					</Group>
				</>
			)}
		</Modal>
	);
}
