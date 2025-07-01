'use client';

import Link from 'next/link';
import { useContext } from 'react';

import { HeaderButton } from '@/components/Header/HeaderButton';
import { UserProfile } from '@/components/Header/UserProfile';
import { Switch } from '@/components/SwitchCase';
import { CreateLayoutContext } from '@/pages/create/_components/Providers';
import { ActionIcon, Button, Divider, Group, Title, useMatches } from '@mantine/core';
import { IconArrowUpLeft } from '@tabler/icons-react';

import classes from './styles.module.css';

export const CreateLayoutHeader = () => {
	const shortReturn = useMatches({ base: true, md: false });
	const { title, returnHref, returnLabel } = useContext(CreateLayoutContext);

	return (
		<Group className={classes.root} component="header">
			<Group className={classes.left}>
				<Switch value={shortReturn}>
					<Switch.True>
						<ActionIcon
							className={classes.return}
							variant="light"
							size="xs"
							component={Link}
							href={returnHref}
						>
							<IconArrowUpLeft size={16} />
						</ActionIcon>
					</Switch.True>
					<Switch.False>
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
					</Switch.False>
				</Switch>
				<Divider orientation="vertical" className={classes.divider} />
				<Title order={1} className={classes.title}>
					{title}
				</Title>
			</Group>
			<Group className={classes.right}>
				<HeaderButton className={classes.button} variant="accessibility" visibleFrom="xs" />
				<HeaderButton className={classes.button} variant="language" visibleFrom="xs" />
				<HeaderButton className={classes.button} variant="theme" visibleFrom="xs" />
				<UserProfile
					className={`${classes.user} ${classes.button}`}
					variant="marketplace"
				/>
			</Group>
		</Group>
	);
};
