'use client';

import Link from 'next/link';
import { useContext } from 'react';

import { HeaderButton } from '@/components/Header/HeaderButton';
import { UserProfile } from '@/components/Header/UserProfile';
import { CreateLayoutContext } from '@/pages/create/_components/Providers';
import { Button, Divider, Group, Title } from '@mantine/core';
import { IconArrowUpLeft } from '@tabler/icons-react';

import classes from './styles.module.css';

export const CreateLayoutHeader = () => {
	const { title, returnHref, returnLabel } = useContext(CreateLayoutContext);

	return (
		<Group className={classes.root}>
			<Group className={classes.left}>
				<Button
					className={classes.return}
					variant="light"
					size="xs"
					component={Link}
					href={returnHref}
					leftSection={<IconArrowUpLeft size={16} />}
				>
					{returnLabel}
				</Button>
				<Divider orientation="vertical" className={classes.divider} />
				<Title order={1} className={classes.title}>
					{title}
				</Title>
			</Group>
			<Group className={classes.right}>
				<HeaderButton className={classes.button} variant="accessibility" />
				<HeaderButton className={classes.button} variant="language" />
				<HeaderButton className={classes.button} variant="theme" />
				<UserProfile
					className={`${classes.user} ${classes.button}`}
					variant="marketplace"
				/>
			</Group>
		</Group>
	);
};
