'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Button, Container, Stack, Text } from '@mantine/core';
import { IconArrowUpRight, IconBuildingStore, IconHelp, IconMessage } from '@tabler/icons-react';

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
			<Button
				classNames={{
					root: `${classes.marketplace} ${classes.link}`,
					inner: classes.inner,
					section: classes.section,
					label: classes.label,
				}}
				component={Link}
				href={'/marketplace'}
				variant="subtle"
				leftSection={<IconBuildingStore size={16} />}
			>
				{t('components.header.user.marketplace')}
			</Button>
			<Stack className={classes.card}>
				<Container className={classes.gradient} />
				<Stack className={classes.content}>
					<Container className={classes.icon}>
						<IconBuildingStore size={20} />
					</Container>
					<Text className={classes.title}>
						{t('dashboard.sidebar.footer.card.title')}
					</Text>
					<Text className={classes.description}>
						{t('dashboard.sidebar.footer.card.description')}
					</Text>
					<Button
						className={classes.button}
						component={Link}
						href="/marketplace"
						rightSection={<IconArrowUpRight size={16} />}
					>
						{t('dashboard.sidebar.footer.card.button')}
					</Button>
				</Stack>
			</Stack>
		</Stack>
	);
};
