import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useContextSelector } from 'use-context-selector';

import { CreateLayoutContext } from '@/pages/create/_components/Providers';
import { Button, Stack, Text, Title } from '@mantine/core';
import { IconRosetteDiscountCheck } from '@tabler/icons-react';

import classes from './styles.module.css';

export const FinalStep = () => {
	const t = useTranslations();
	const returnHref = useContextSelector(CreateLayoutContext, (context) => context.returnHref);
	const returnLabel = useContextSelector(CreateLayoutContext, (context) => context.returnLabel);

	return (
		<Stack className={`${classes.final} ${classes.root}`}>
			<IconRosetteDiscountCheck size={64} className={classes.icon} />
			<Title className={classes.heading}>{t('create.cycle.final.header.heading')}</Title>
			<Text className={classes.subheading}>{t('create.cycle.final.header.subheading')}</Text>
			<Button component={Link} href={returnHref} className={classes.button}>
				{returnLabel}
			</Button>
		</Stack>
	);
};
