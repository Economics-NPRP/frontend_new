'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Button, Stack } from '@mantine/core';
import { IconHelp, IconMessage } from '@tabler/icons-react';

import classes from './styles.module.css';

export const Footer = () => {
	const t = useTranslations();

	return (
		<Stack className={classes.footer}>
			<Button
				classNames={{
					root: classes.link,
					inner: classes.inner,
					section: classes.section,
					label: classes.label,
				}}
				component={Link}
				href={'/feedback'}
				variant="subtle"
				leftSection={<IconMessage size={16} />}
			>
				{t('constants.pages.feedback.sidebar')}
			</Button>
			<Button
				classNames={{
					root: classes.link,
					inner: classes.inner,
					section: classes.section,
					label: classes.label,
				}}
				component={Link}
				href={'/help'}
				variant="subtle"
				leftSection={<IconHelp size={16} />}
			>
				{t('constants.pages.help.sidebar')}
			</Button>
		</Stack>
	);
};
