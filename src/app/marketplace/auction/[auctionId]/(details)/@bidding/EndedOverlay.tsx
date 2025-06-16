import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

import { Button, Container, Stack, Text, Title } from '@mantine/core';
import { IconArrowUpRight } from '@tabler/icons-react';

import classes from './styles.module.css';

export const EndedOverlay = () => {
	const t = useTranslations();
	const { auctionId } = useParams();

	return (
		<Stack className={classes.overlay}>
			<Container className={classes.background} />
			<Stack className={classes.content}>
				<Title order={2} className={classes.title}>
					{t('marketplace.auction.details.bidding.endedOverlay.title')}
				</Title>
				<Text className={classes.description}>
					{t('marketplace.auction.details.bidding.endedOverlay.description')}
				</Text>
				<Button
					className={classes.button}
					component="a"
					href={`/marketplace/auction/${auctionId}/results`}
					rightSection={<IconArrowUpRight size={16} />}
				>
					{t('constants.view.results.label')}
				</Button>
			</Stack>
		</Stack>
	);
};
