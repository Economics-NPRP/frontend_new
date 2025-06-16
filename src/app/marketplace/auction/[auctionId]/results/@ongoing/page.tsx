'use client';

import { SingleAuctionContext } from 'contexts/SingleAuction';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useContext } from 'react';

import { useAuctionAvailability } from '@/hooks';
import { Button, Group, Modal, Stack, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconArrowUpLeft } from '@tabler/icons-react';

import classes from './styles.module.css';

export default function OngoingOverlay() {
	const t = useTranslations();
	const auction = useContext(SingleAuctionContext);
	const { auctionId } = useParams();

	const [isReadOnlyMode, { open: viewInReadOnlyMode }] = useDisclosure(false);

	const { isUpcoming, isLive } = useAuctionAvailability();

	const isUpcomingState = (
		<>
			<Title order={2} className={classes.title}>
				{t('marketplace.auction.results.ongoing.upcoming.title')}
			</Title>
			<Text className={classes.description}>
				{t('marketplace.auction.results.ongoing.upcoming.description')}
			</Text>
			<Stack className={classes.actions}>
				<Button
					className={classes.cta}
					component="a"
					href={`/marketplace/auction/${auctionId}`}
					leftSection={<IconArrowUpLeft size={16} />}
				>
					{t('constants.return.auctionPage.label')}
				</Button>
			</Stack>
		</>
	);

	const isLiveState = (
		<>
			<Title order={2} className={classes.title}>
				{t('marketplace.auction.results.ongoing.live.title')}
			</Title>
			<Text className={classes.description}>
				{t('marketplace.auction.results.ongoing.live.description')}
			</Text>
			<Stack className={classes.actions}>
				<Button
					className={classes.cta}
					component="a"
					href={`/marketplace/auction/${auctionId}`}
					leftSection={<IconArrowUpLeft size={16} />}
				>
					{t('constants.return.auctionPage.label')}
				</Button>
				<Button onClick={viewInReadOnlyMode} variant="transparent">
					{t('constants.view.resultsNow.label')}
				</Button>
			</Stack>
		</>
	);

	return (
		<>
			<Modal
				opened={auction.isSuccess && (isUpcoming || isLive) && !isReadOnlyMode}
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
				{isUpcoming && isUpcomingState}
				{isLive && isLiveState}
			</Modal>

			{isReadOnlyMode && (
				<Group className={classes.overlay}>
					<Text className={classes.text}>
						{t('marketplace.auction.results.ongoing.overlay.text')}
					</Text>
					<Button
						classNames={{
							root: classes.button,
							section: classes.section,
						}}
						component="a"
						href={`/marketplace/auction/${auctionId}`}
						leftSection={<IconArrowUpLeft size={16} />}
					>
						{t('constants.return.auctionPage.label')}
					</Button>
				</Group>
			)}
		</>
	);
}
