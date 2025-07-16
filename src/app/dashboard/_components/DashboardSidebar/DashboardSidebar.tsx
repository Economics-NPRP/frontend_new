'use client';

import {
	DashboardSidebarContext,
	DefaultDashboardSidebarContextData,
	Footer,
	Header,
	Links,
} from '@/pages/dashboard/_components/DashboardSidebar';
import { Divider, Stack } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';

import classes from './styles.module.css';

export const DashboardSidebar = () => {
	const [expanded, setExpanded] = useLocalStorage({
		key: 'dashboard-sidebar-expanded',
		defaultValue: DefaultDashboardSidebarContextData.expanded,
	});

	return (
		<DashboardSidebarContext.Provider
			value={{
				expanded,
				setExpanded,
			}}
		>
			<Stack className={`${classes.root} ${expanded ? classes.expanded : ''}`}>
				<Header />
				<Divider className={classes.divider} />
				<Links />
				<Divider className={classes.divider} />
				<Footer />
			</Stack>
		</DashboardSidebarContext.Provider>
	);
};
