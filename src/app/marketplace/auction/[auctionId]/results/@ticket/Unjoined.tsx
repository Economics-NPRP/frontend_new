import { useTranslations } from 'next-intl';

import { Stack, Text, Title } from '@mantine/core';

import classes from './styles.module.css';

export const Unjoined = () => {
	const t = useTranslations();

	return (
		<Stack className={`${classes.unjoined} ${classes.ticket}`}>
			<Stack className={classes.header}>
				<Title order={2} className={classes.title}>
					{t('marketplace.auction.results.ticket.unjoined.title')}
				</Title>
				<Text className={classes.subtitle}>
					{t('marketplace.auction.results.ticket.unjoined.subtitle')}
				</Text>
			</Stack>
		</Stack>
	);
};
