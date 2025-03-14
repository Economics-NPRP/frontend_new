import { useParams } from 'next/navigation';
import { useCallback } from 'react';

import { throwError } from '@/helpers';
import { joinAuction } from '@/lib/auctions';
import { Button, Container, Loader, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const JoinOverlay = () => {
	const { auctionId } = useParams();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: () => throwError(joinAuction(auctionId as string)),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['marketplace', '@catalogue', 'auctionData', auctionId],
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

	const onClickHandler = useCallback(() => mutation.mutate(), []);

	return (
		<Stack className="absolute top-0 left-0 justify-center items-center w-full h-full z-10">
			<Container
				className="absolute top-0 left-0 w-full h-full -z-10 bg-black/30"
				style={{ backdropFilter: 'blur(4px)' }}
			/>
			{mutation.isPending && <Loader />}
			{!mutation.isPending && (
				<>
					<Text>You must join the auction to place bids or purchase permits</Text>
					<Button onClick={onClickHandler}>Join Auction</Button>
				</>
			)}
		</Stack>
	);
};
