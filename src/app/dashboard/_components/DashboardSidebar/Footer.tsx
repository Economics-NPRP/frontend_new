'use client';

import { MyUserProfileContext } from 'contexts/MyUserProfile';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useContext } from 'react';

import { Button, Container, Stack, Text, Tooltip } from '@mantine/core';
import {
	IconArrowUpRight,
	IconBuildingStore,
	IconHelp,
	IconMessage,
	IconSettings,
} from '@tabler/icons-react';

import classes from './styles.module.css';

export const Footer = () => {
	const t = useTranslations();
	const myUser = useContext(MyUserProfileContext);

	return (
		<Stack className={classes.footer}>
			<Tooltip label={t('constants.pages.feedback.tooltip')}>
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
					{t('constants.pages.feedback.title')}
				</Button>
			</Tooltip>
			<Tooltip label={t('constants.pages.help.tooltip')}>
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
					{t('constants.pages.help.title')}
				</Button>
			</Tooltip>
			<Tooltip label={t('constants.pages.settings.tooltip')}>
				<Button
					classNames={{
						root: classes.link,
						inner: classes.inner,
						section: classes.section,
						label: classes.label,
					}}
					component={Link}
					href={`/dashboard/${myUser.data.type === 'admin' ? 'a' : 'f'}/settings`}
					variant="subtle"
					leftSection={<IconSettings size={16} />}
				>
					{t('constants.pages.settings.title')}
				</Button>
			</Tooltip>
			<Tooltip label={t('constants.pages.marketplace.tooltip')}>
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
					{t('constants.pages.marketplace.title')}
				</Button>
			</Tooltip>
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
