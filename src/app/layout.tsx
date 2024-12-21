import { type Metadata } from 'next';
import Head from 'next/head';

import '@/styles/globals.css';
import { theme } from '@/styles/mantine';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';

export const metadata: Metadata = {
	title: 'Next App Mantine Tailwind Template',
	description: 'Next App Mantine Tailwind Template',
};

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
