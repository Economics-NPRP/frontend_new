import { useParams } from 'next/navigation';

import { Button, Container, Stack, Text, Title } from '@mantine/core';
import { IconArrowUpRight } from '@tabler/icons-react';

export const EndedOverlay = () => {
	const { auctionId } = useParams();

	return (
		<Stack className="absolute top-0 left-0 justify-center items-center w-full h-full z-10">
			<Container
				className="absolute top-0 left-0 w-full h-full -z-10 bg-black/30"
				style={{ backdropFilter: 'blur(4px)' }}
			/>
			<Stack className="gap-2 px-12 py-8 bg-white items-center w-[600px]">
				<Title className="text-center heading-2">This Auction Has Ended</Title>
				<Text className="text-center paragraph-sm">
					You cannot participate in this auction anymore as it has ended. You can choose
					to take a look at the results, or view the page in read-only mode
				</Text>
				<Button
					className="w-[200px] mt-4"
					component="a"
					href={`/marketplace/auction/${auctionId}/results`}
					rightSection={<IconArrowUpRight size={16} />}
				>
					View Results
				</Button>
			</Stack>
		</Stack>
	);
};
