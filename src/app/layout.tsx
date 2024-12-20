import { type Metadata } from 'next';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import Head from 'next/head';
import '@/styles/globals.css';

export const metadata: Metadata = {
	title: 'Next App Mantine Tailwind Template',
	description: 'Next App Mantine Tailwind Template',
};

import { theme } from '@/styles/mantine';

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<Head>
				<ColorSchemeScript />
			</Head>
			<body className="antialiased">
				<MantineProvider theme={theme}>{children}</MantineProvider>
			</body>
		</html>
	);
}
