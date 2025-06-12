import { Metadata } from 'next';

import { Header } from '@/components/Header';
import '@/styles/globals.css';
import { AppShell, Container } from '@mantine/core';

import classes from './styles.module.css';

export const metadata: Metadata = {
	title: {
		default: 'ETS Marketplace',
		template: '%s | ETS Marketplace',
	},
};

export default async function MarketplaceLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<AppShell className={classes.root}>
			<Header />
			<Container className={classes.content} component="main">
				{children}
			</Container>
		</AppShell>
	);
}
