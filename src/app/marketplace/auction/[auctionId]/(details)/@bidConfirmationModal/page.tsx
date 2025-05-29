'use client';

import { useFormatter } from 'next-intl';
import { useParams } from 'next/navigation';
import { useCallback, useContext } from 'react';

import { CurrencyBadge } from '@/components/Badge';
import { throwError } from '@/helpers';
import { placeBid } from '@/lib/bids/open';
import { BidTable } from '@/pages/marketplace/auction/[auctionId]/(details)/_components/BidTable';
import { AuctionBiddingContext } from '@/pages/marketplace/auction/[auctionId]/(details)/_components/Providers';
import { Button, Group, Loader, Modal, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function BidConfirmationModal() {
	const format = useFormatter();
	const { auctionId } = useParams();
	const queryClient = useQueryClient();

	const {
		bids,
		bidConfirmationModalOpened,
		bidConfirmationModalActions,
		totalPermits,
		grandTotal,
		resetState,
	} = useContext(AuctionBiddingContext);

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
				queryKey: ['marketplace', '@catalogue', 'winningBids', auctionId],
			});
			queryClient.invalidateQueries({
				queryKey: ['marketplace', '@catalogue', 'myBids', auctionId],
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
			title="Bid Confirmation"
			opened={bidConfirmationModalOpened}
			onClose={bidConfirmationModalActions.close}
			size={'xl'}
			centered
		>
			{mutation.isPending && <Loader />}
			{!mutation.isPending && (
				<>
					<Text>You are about to place bids with the following details:</Text>
					<BidTable readOnly />
					<Stack>
						<Text>Grand Total</Text>
						<Group>
							<Stack>
								<Text>Permits</Text>
								<Text>{format.number(totalPermits)}</Text>
							</Stack>
							<Stack>
								<Text>Emissions (tCO2e)</Text>
								<Text>{format.number(totalPermits * 1000)}</Text>
							</Stack>
							<Stack>
								<Text>Bid</Text>
								<Group>
									<CurrencyBadge />
									<Text>{format.number(grandTotal, 'money')}</Text>
								</Group>
							</Stack>
						</Group>
					</Stack>
					<Group>
						<Button onClick={bidConfirmationModalActions.close}>Cancel</Button>
						<Button onClick={onPlaceBidHandler} color="green">
							Confirm
						</Button>
					</Group>
				</>
			)}
		</Modal>
	);
}
