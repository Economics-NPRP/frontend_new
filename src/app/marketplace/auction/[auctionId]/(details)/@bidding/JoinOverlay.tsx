import { useParams } from 'next/navigation';
import { useCallback } from 'react';

import { throwError } from '@/helpers';
import { joinAuction } from '@/lib/auctions';
import { Button, Container, Loader, Stack, Text, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconArrowUpRight } from '@tabler/icons-react';
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

	const onClickHandler = useCallback(() => mutation.mutate(), [mutation]);

	return (
		<Stack className="absolute top-0 left-0 justify-center items-center w-full h-full z-10">
			<Container
				className="absolute top-0 left-0 w-full h-full -z-10 bg-black/30"
				style={{ backdropFilter: 'blur(4px)' }}
			/>
			{mutation.isPending && (
				<Stack className="bg-white items-center justify-center size-[200px]">
					<Loader />
				</Stack>
			)}
			{!mutation.isPending && (
				<Stack className="gap-2 px-12 py-8 bg-white items-center w-[600px]">
					<Title className="text-center heading-2">Join The Auction</Title>
					<Text className="text-center paragraph-sm">
						You must first join the auction to participate in the bidding process. Click
						the button below to join.
					</Text>
					<Button
						className="w-[200px] mt-4"
						onClick={onClickHandler}
						rightSection={<IconArrowUpRight size={16} />}
					>
						Join Auction
					</Button>
				</Stack>
			)}
		</Stack>
	);
};
