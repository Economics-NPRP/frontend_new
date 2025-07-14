'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useContext } from 'react';

import { MyUserProfileContext } from '@/contexts';
import { Avatar, Button, Container, Group, Text, Tooltip, UnstyledButton } from '@mantine/core';
import { IconBox, IconChevronDown, IconCommand, IconSearch } from '@tabler/icons-react';

import classes from './styles.module.css';

export const DashboardHeader = () => {
	const t = useTranslations();
	const currentUser = useContext(MyUserProfileContext);

	return (
		<Group className={classes.root}>
			<Group className={classes.logo}>
				<Tooltip label={t('constants.return.marketplace.tooltip')}>
					<Button
						component={Link}
						href="/"
						aria-label={t('constants.return.marketplace.aria')}
						classNames={{
							root: classes.button,
							section: classes.icon,
							label: classes.label,
						}}
						variant="transparent"
						size="xs"
						leftSection={<IconBox size={20} />}
					>
						ETS
					</Button>
				</Tooltip>
			</Group>
			<Group className={classes.search}>
				<Tooltip label={t('components.header.search.promptTooltip')}>
					<Button
						className={classes.button}
						variant="transparent"
						fullWidth
						leftSection={<IconSearch size={14} />}
					>
						{t('dashboard.header.search.label')}...
					</Button>
				</Tooltip>
				<Container className={classes.shortcut} visibleFrom="sm">
					<IconCommand size={14} />
					{t('components.header.search.shortcut')}
				</Container>
			</Group>
			<UnstyledButton className={classes.user}>
				<Avatar
					color="initials"
					size="sm"
					className={classes.avatar}
					name={currentUser.data.name}
				/>
				<Text className={classes.name}>{currentUser.data.name}</Text>
				<IconChevronDown size={14} className={classes.icon} />
			</UnstyledButton>
		</Group>
	);
};
