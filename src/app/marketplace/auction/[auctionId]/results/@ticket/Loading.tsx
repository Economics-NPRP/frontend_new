import { useTranslations } from 'next-intl';

import { Loader, Stack, Text } from '@mantine/core';

import classes from './styles.module.css';

export const Loading = () => {
	const t = useTranslations();

	return (
		<Stack className={`${classes.loading} ${classes.ticket}`}>
			<Stack className={classes.header}>
				<Loader color="gray" className={classes.loader} />
				<Text className={classes.subtitle}>{t('constants.loading.results')}</Text>
			</Stack>
		</Stack>
	);
};
