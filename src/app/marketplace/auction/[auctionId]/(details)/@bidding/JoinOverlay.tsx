import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

import { useJoinAuction } from '@/hooks';
import { Button, Container, Stack, Text, Title } from '@mantine/core';
import { IconCheckbox } from '@tabler/icons-react';

import classes from './styles.module.css';

export const JoinOverlay = () => {
	const t = useTranslations();
	const { auctionId } = useParams();

	const joinAuction = useJoinAuction(auctionId as string);

	return (
		<Stack className={classes.overlay}>
			<Container className={classes.background} />
			<Stack className={classes.content}>
				<Title order={2} className={classes.title}>
					{t('marketplace.auction.details.bidding.joinOverlay.title')}
				</Title>
				<Text className={classes.description}>
					{t('marketplace.auction.details.bidding.joinOverlay.description')}
				</Text>
				<Button
					className={classes.button}
					onClick={() => joinAuction.mutate()}
					rightSection={<IconCheckbox size={16} />}
					loading={joinAuction.isPending}
				>
					{t('constants.actions.joinAuction.label')}
				</Button>
			</Stack>
		</Stack>
	);
};
