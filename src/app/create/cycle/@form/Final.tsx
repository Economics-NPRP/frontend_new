import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Button, Stack, Text, Title } from '@mantine/core';
import { IconRosetteDiscountCheck } from '@tabler/icons-react';

import classes from './styles.module.css';

export const FinalStep = () => {
	const t = useTranslations();

	return (
		<Stack className={`${classes.final} ${classes.root}`}>
			<IconRosetteDiscountCheck size={64} className={classes.icon} />
			<Title className={classes.heading}>{t('create.cycle.final.header.heading')}</Title>
			<Text className={classes.subheading}>{t('create.cycle.final.header.subheading')}</Text>
			<Button component={Link} href="/dashboard/a/cycles" className={classes.button}>
				{t('constants.return.cyclesList.label')}
			</Button>
		</Stack>
	);
};
