'use client';

import { useParams } from 'next/navigation';
import { useContext, useMemo } from 'react';

import { Button, Container, Group, Modal, Stack, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconArrowUpRight } from '@tabler/icons-react';

import { AuctionDetailsContext } from '../constants';

export default function EndedOverlay() {
	const { auctionId } = useParams();
	const { auctionData, isAuctionDataSuccess } = useContext(AuctionDetailsContext);

	const [isReadOnlyMode, { open: viewInReadOnlyMode }] = useDisclosure(false);

	//	TODO: also check every second if the auction is still active
	const hasEnded = useMemo(
		() => new Date(auctionData.endDatetime).getTime() < Date.now(),
		[auctionData.endDatetime],
	);

	return (
		<>
			<Modal
				opened={isAuctionDataSuccess && hasEnded && !isReadOnlyMode}
				onClose={viewInReadOnlyMode}
				centered
				closeOnEscape={false}
				closeOnClickOutside={false}
				withCloseButton={false}
				classNames={{
					content: 'min-w-[600px] px-16 pt-12 pb-8 justify-center items-center',
					body: 'flex flex-col items-center justify-center gap-4 p-0',
				}}
			>
				<Title className="text-center heading-2">This Auction Has Ended</Title>
				<Text className="text-center paragraph-sm">
					You cannot participate in this auction anymore as it has ended. You can choose
					to take a look at the results, or view the page in read-only mode
				</Text>
				<Stack className="mt-6 gap-2 items-center">
					<Button
						className="w-[200px]"
						component="a"
						href={`/marketplace/auction/${auctionId}/results`}
						rightSection={<IconArrowUpRight size={16} />}
					>
						View Results
					</Button>
					<Button onClick={viewInReadOnlyMode} variant="transparent">
						See the original page (read-only)
					</Button>
				</Stack>
			</Modal>

			{isReadOnlyMode && (
				<Group className="fixed left-[50%] -translate-x-[50%] bottom-8 bg-white px-4 h-12 shadow-md border-solid border border-gray-300 flex-nowrap justify-center items-center z-10">
					<Text className="paragraph-sm text-center">
						Viewing the page in read-only mode
					</Text>
					<Button
						classNames={{
							root: 'h-7 px-3',
							section: 'ml-1',
						}}
						component="a"
						href={`/marketplace/auction/${auctionId}/results`}
						rightSection={<IconArrowUpRight size={16} />}
					>
						View Results
					</Button>
				</Group>
			)}
		</>
	);
}
