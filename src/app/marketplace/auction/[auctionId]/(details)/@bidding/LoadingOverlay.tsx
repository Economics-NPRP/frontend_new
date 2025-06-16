import { useTranslations } from 'next-intl';

import { Container, Loader, Stack, Text } from '@mantine/core';

import classes from './styles.module.css';

export const LoadingOverlay = () => {
	const t = useTranslations();

	return (
		<Stack className={classes.overlay}>
			<Container className={classes.background} />
			<Stack className={`${classes.square} ${classes.content}`}>
				<Loader color="gray" className={classes.loader} />
				<Text className={classes.description}>{t('constants.loading.auction')}</Text>
			</Stack>
		</Stack>
	);
};
