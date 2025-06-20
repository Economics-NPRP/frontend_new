'use client';

import { useFormatter, useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useCallback, useContext } from 'react';

import { CurrencyBadge } from '@/components/Badge';
import { Switch } from '@/components/SwitchCase';
import { MyUserProfileContext } from '@/contexts';
import { throwError } from '@/helpers';
import { placeBid } from '@/lib/bids/open';
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
	const t = useTranslations();
	const format = useFormatter();
	const queryClient = useQueryClient();
	const myUser = useContext(MyUserProfileContext);
	const { auctionId } = useParams();

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
				queryKey: ['marketplace', auctionId, 'paginatedBids'],
			});
			queryClient.invalidateQueries({
				queryKey: [myUser.data.id, 'marketplace', auctionId, 'myPaginatedBids'],
			});
			queryClient.invalidateQueries({
				queryKey: [myUser.data.id, 'marketplace', auctionId, 'myPaginatedWinningBids'],
			});
			queryClient.invalidateQueries({
				queryKey: [myUser.data.id, 'marketplace', auctionId, 'myOpenAuctionResults'],
			});

			notifications.show({
				color: 'green',
				title: t(
					'marketplace.auction.details.bidConfirmationModal.notifications.success.title',
				),
				message: t(
					'marketplace.auction.details.bidConfirmationModal.notifications.success.message',
					{
						bids: bids.length,
						total: grandTotal,
					},
				),
				position: 'bottom-center',
			});

			//	Close the bid confirmation modal and reset the bids
			bidConfirmationModalActions.close();
			resetState();
		},
		onError: ({ message }) => {
			notifications.show({
				color: 'red',
				title: t(
					'marketplace.auction.details.bidConfirmationModal.notifications.error.title',
				),
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
			<Switch value={mutation.isPending}>
				<Switch.True>
					<Loader color="gray" />
				</Switch.True>
				<Switch.False>
					<Title order={2} className={classes.title}>
						{t('marketplace.auction.details.bidConfirmationModal.title')}
					</Title>
					<Text className={classes.description}>
						{t('marketplace.auction.details.bidConfirmationModal.description')}
					</Text>
					<BiddingTable className={classes.table} readOnly />
					<Divider label={t('constants.grandTotal')} className={classes.divider} />
					<Group className={classes.summary}>
						<Stack className={classes.cell}>
							<Container className={classes.icon}>
								<IconLicense size={16} />
							</Container>
							<Text className={classes.key}>{t('constants.permits.key')}</Text>
							<Group className={classes.row}>
								<Text className={classes.value}>{format.number(totalPermits)}</Text>
								<Text className={classes.unit}>{t('constants.permits.unit')}</Text>
							</Group>
						</Stack>
						<Divider orientation="vertical" className={classes.divider} />
						<Stack className={classes.cell}>
							<Container className={classes.icon}>
								<IconLeaf size={16} />
							</Container>
							<Text className={classes.key}>{t('constants.emissions.key')}</Text>
							<Group className={classes.row}>
								<Text className={classes.value}>
									{format.number(totalPermits * 1000)}
								</Text>
								<Text className={classes.unit}>
									{t('constants.emissions.unit')}
								</Text>
							</Group>
						</Stack>
						<Divider orientation="vertical" className={classes.divider} />
						<Stack className={classes.cell}>
							<Container className={classes.icon}>
								<IconCoins size={16} />
							</Container>
							<Text className={classes.key}>
								{t(
									'marketplace.auction.details.bidConfirmationModal.summary.totalBid.key',
								)}
							</Text>
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
							className={`${classes.secondary} ${classes.button}`}
							variant="outline"
							onClick={bidConfirmationModalActions.close}
						>
							{t('constants.actions.cancel.label')}
						</Button>
						<Button
							className={classes.button}
							onClick={onPlaceBidHandler}
							color="green"
						>
							{t('marketplace.auction.details.bidConfirmationModal.actions.confirm')}
						</Button>
					</Group>
				</Switch.False>
			</Switch>
		</Modal>
	);
}
