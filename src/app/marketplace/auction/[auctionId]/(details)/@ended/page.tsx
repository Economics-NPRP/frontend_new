'use client';

import { SingleAuctionContext } from 'contexts/SingleAuction';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useContext } from 'react';

import { useAuctionAvailability } from '@/hooks';
import { Button, Group, Modal, Stack, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconArrowUpRight } from '@tabler/icons-react';

import classes from './styles.module.css';

export default function EndedOverlay() {
	const t = useTranslations();
	const auction = useContext(SingleAuctionContext);
	const { auctionId } = useParams();

	const [isReadOnlyMode, { open: viewInReadOnlyMode }] = useDisclosure(false);

	const { hasEnded } = useAuctionAvailability();

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
					{t('marketplace.auction.details.ended.title')}
				</Title>
				<Text className={classes.description}>
					{t('marketplace.auction.details.ended.description')}
				</Text>
				<Stack className={classes.actions}>
					<Button
						className={classes.cta}
						component="a"
						href={`/marketplace/auction/${auctionId}/results`}
						rightSection={<IconArrowUpRight size={16} />}
					>
						{t('constants.view.results.label')}
					</Button>
					<Button
						className={classes.anchor}
						onClick={viewInReadOnlyMode}
						variant="transparent"
					>
						{t('marketplace.auction.details.ended.subtext')}
					</Button>
				</Stack>
			</Modal>

			{isReadOnlyMode && (
				<Group className={classes.overlay}>
					<Text className={classes.text}>
						{t('marketplace.auction.details.ended.overlay')}
					</Text>
					<Button
						classNames={{
							root: classes.button,
							section: classes.section,
						}}
						component="a"
						href={`/marketplace/auction/${auctionId}/results`}
						rightSection={<IconArrowUpRight size={16} />}
					>
						{t('constants.view.results.label')}
					</Button>
				</Group>
			)}
		</>
	);
}
