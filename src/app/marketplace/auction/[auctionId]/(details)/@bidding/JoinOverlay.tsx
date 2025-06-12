import { useParams } from 'next/navigation';

import { useJoinAuction } from '@/hooks';
import { Button, Container, Loader, Stack, Text, Title } from '@mantine/core';
import { IconCheckbox } from '@tabler/icons-react';

export const JoinOverlay = () => {
	const { auctionId } = useParams();

	const joinAuction = useJoinAuction(auctionId as string);

	return (
		<Stack className="absolute top-0 left-0 justify-center items-center w-full h-full z-10">
			<Container
				className="absolute top-0 left-0 w-full h-full -z-10 bg-black/30"
				style={{ backdropFilter: 'blur(4px)' }}
			/>
			{joinAuction.isPending && (
				<Stack className="bg-white items-center justify-center size-[200px]">
					<Loader />
				</Stack>
			)}
			{!joinAuction.isPending && (
				<Stack className="gap-2 px-12 py-8 bg-white items-center w-[600px]">
					<Title className="text-center heading-2">Join The Auction</Title>
					<Text className="text-center paragraph-sm">
						You must first join the auction to participate in the bidding process. Click
						the button below to join.
					</Text>
					<Button
						className="w-[200px] mt-4"
						onClick={() => joinAuction.mutate()}
						rightSection={<IconCheckbox size={16} />}
						loading={joinAuction.isPending}
					>
						Join Auction
					</Button>
				</Stack>
			)}
		</Stack>
	);
};
