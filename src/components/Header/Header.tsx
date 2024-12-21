'use client';

import { Button, Center, Flex, Group, Text, Tooltip } from '@mantine/core';
import { IconArrowUpLeft, IconBox } from '@tabler/icons-react';

import { HeaderButton } from './HeaderButton';
import { SearchBar } from './SearchBar';
import classes from './styles.module.css';

export const Header = () => {
	return (
		<Center component="header" className={classes.root}>
			<Group className={classes.container}>
				<Flex className={classes.left}>
					<Tooltip label="Go back to your dashboard">
						<Button
							component="a"
							href="/dashboard"
							className={classes.dashboardButton}
							variant="light"
							size="xs"
							leftSection={<IconArrowUpLeft size={14} />}
							visibleFrom="sm"
						>
							<Text visibleFrom="lg" inherit>
								Return to Dashboard
							</Text>
							<Text hiddenFrom="lg" inherit>
								Dashboard
							</Text>
						</Button>
					</Tooltip>
					<Tooltip label="Return to Marketplace Home">
						<Button
							component="a"
							href="/"
							aria-label="Home button"
							classNames={{ root: `${classes.logo} ${classes.headerButton}`, label: classes.label }}
							variant="transparent"
							size="xs"
							leftSection={<IconBox size={20} />}
						>
							ETS
						</Button>
					</Tooltip>
					<HeaderButton variant="notifications" />
				</Flex>
				<SearchBar />
				<Flex className={classes.right}>
					<HeaderButton className={classes.search} variant="search" hiddenFrom="md" />
					<HeaderButton variant="accessibility" visibleFrom="xs" />
					<HeaderButton variant="language" visibleFrom="xs" />
					<HeaderButton variant="theme" visibleFrom="xs" />
					<HeaderButton className={classes.user} variant="user" />
				</Flex>
			</Group>
		</Center>
	);
};
