import { Metadata } from 'next';

import { Footer } from '@/components/Footer';
import { MarketplaceHeader } from '@/pages/marketplace/_components/MarketplaceHeader';
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
			<MarketplaceHeader />
			<Container className={classes.content} component="main">
				{children}
			</Container>
			<Footer className={classes.footer} />
		</AppShell>
	);
}
