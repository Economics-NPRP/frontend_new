'use client';

import { SingleAuctionContext } from 'contexts/SingleAuction';
import { useParams } from 'next/navigation';
import { useContext, useMemo } from 'react';

import { Button, Group, Modal, Stack, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconArrowUpLeft } from '@tabler/icons-react';

import classes from './styles.module.css';

export default function OngoingOverlay() {
	const { auctionId } = useParams();
	const auction = useContext(SingleAuctionContext);

	const [isReadOnlyMode, { open: viewInReadOnlyMode }] = useDisclosure(false);

	const hasStarted = useMemo(
		() => new Date(auction.data.startDatetime).getTime() <= Date.now(),
		[auction.data.startDatetime],
	);

	//	TODO: also check every second if the auction is still active
	const hasEnded = useMemo(
		() => new Date(auction.data.endDatetime).getTime() < Date.now(),
		[auction.data.endDatetime],
	);

	return (
		<>
			<Modal
				opened={auction.isSuccess && hasStarted && !hasEnded && !isReadOnlyMode}
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
					This Auction Is Still Ongoing
				</Title>
				<Text className={classes.description}>
					You can take a look at the results, but please note that they are not final and
					may change as the auction is still active.
				</Text>
				<Stack className={classes.actions}>
					<Button
						className={classes.cta}
						component="a"
						href={`/marketplace/auction/${auctionId}`}
						leftSection={<IconArrowUpLeft size={16} />}
					>
						Return to Auction Page
					</Button>
					<Button onClick={viewInReadOnlyMode} variant="transparent">
						View results as of now
					</Button>
				</Stack>
			</Modal>

			{isReadOnlyMode && (
				<Group className={classes.overlay}>
					<Text className={classes.text}>Viewing tentative results</Text>
					<Button
						classNames={{
							root: classes.button,
							section: classes.section,
						}}
						component="a"
						href={`/marketplace/auction/${auctionId}`}
						leftSection={<IconArrowUpLeft size={16} />}
					>
						Return to Auction Page
					</Button>
				</Group>
			)}
		</>
	);
}
