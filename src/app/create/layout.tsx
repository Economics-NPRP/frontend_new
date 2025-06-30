import { Metadata } from 'next';

import { withProviders } from '@/helpers';
import { CreateLayoutFooter } from '@/pages/create/_components/Footer';
import { CreateLayoutHeader } from '@/pages/create/_components/Header';
import { CreateLayoutProvider } from '@/pages/create/_components/Providers';
import { CreateLayoutSidebar } from '@/pages/create/_components/Sidebar';
import '@/styles/globals.css';
import { AppShell, Container, Group, Stack } from '@mantine/core';

import classes from './styles.module.css';

export const metadata: Metadata = {
	title: {
		default: 'ETS Create',
		template: '%s | ETS Create',
	},
};

export default async function CreateLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return withProviders(
		<AppShell className={classes.root}>
			<CreateLayoutHeader />
			<Group className={classes.row}>
				<CreateLayoutSidebar />
				<Stack className={classes.column}>
					<Container className={classes.content} component="main">
						<Container className={`${classes.bg} bg-stagger-md`} />
						<Container className={classes.gradient} />
						{children}
					</Container>
					<CreateLayoutFooter />
				</Stack>
			</Group>
		</AppShell>,
		{ provider: CreateLayoutProvider },
	);
}
