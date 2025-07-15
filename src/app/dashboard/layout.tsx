import { Metadata } from 'next';

import { withProviders } from '@/helpers';
import {
	DashboardAside,
	DashboardAsideProvider,
} from '@/pages/dashboard/_components/DashboardAside';
import { DashboardHeader } from '@/pages/dashboard/_components/DashboardHeader';
import { DashboardSidebar } from '@/pages/dashboard/_components/DashboardSidebar';
import '@/styles/globals.css';
import { AppShell, Container, Group } from '@mantine/core';

import classes from './styles.module.css';

export const metadata: Metadata = {
	title: {
		default: 'ETS Dashboard',
		template: '%s | ETS Dashboard',
	},
};

export default async function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return withProviders(
		<AppShell className={classes.root}>
			<DashboardHeader />
			<Group className={classes.row}>
				<DashboardSidebar />
				<Container className={classes.wrapper}>
					<Container className={classes.content} component="main">
						{children}
					</Container>
				</Container>
				<DashboardAside />
			</Group>
		</AppShell>,
		{ provider: DashboardAsideProvider },
	);
}
