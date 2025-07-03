import { Metadata } from 'next';

import { AdminDashboardHeader } from '@/components/Header';
import { withProviders } from '@/helpers';
import {
	DashboardAside,
	DashboardAsideProvider,
} from '@/pages/dashboard/_components/DashboardAside';
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
			<AdminDashboardHeader />
			<Group className={classes.row}>
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
