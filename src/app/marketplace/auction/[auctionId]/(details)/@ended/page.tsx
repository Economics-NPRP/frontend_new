'use client';

import { SingleAuctionContext } from 'contexts/SingleAuction';
import { useParams } from 'next/navigation';
import { useContext, useMemo } from 'react';

import { Button, Group, Modal, Stack, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconArrowUpRight } from '@tabler/icons-react';

import classes from './styles.module.css';

export default function EndedOverlay() {
	const { auctionId } = useParams();
	const auction = useContext(SingleAuctionContext);

	const [isReadOnlyMode, { open: viewInReadOnlyMode }] = useDisclosure(false);

	//	TODO: also check every second if the auction is still active
	const hasEnded = useMemo(
		() => new Date(auction.data.endDatetime).getTime() < Date.now(),
		[auction.data.endDatetime],
	);

	return (
		<>
			<Modal
				opened={auction.isSuccess && hasEnded && !isReadOnlyMode}
				onClose={viewInReadOnlyMode}
				closeOnEscape={false}
				closeOnClickOutside={false}
				withCloseButton={false}
				classNames={{
					root: classes.modal,
					inner: classes.inner,
					content: classes.content,
					body: classes.body,
				}}
				centered
			>
				<Title order={2} className={classes.title}>
					This Auction Has Ended
				</Title>
				<Text className={classes.description}>
					You cannot participate in this auction anymore as it has ended. You can choose
					to take a look at the results, or view the page in read-only mode
				</Text>
				<Stack className={classes.actions}>
					<Button
						className={classes.cta}
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
				<Group className={classes.overlay}>
					<Text className={classes.text}>Viewing the page in read-only mode</Text>
					<Button
						classNames={{
							root: classes.button,
							section: classes.section,
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
