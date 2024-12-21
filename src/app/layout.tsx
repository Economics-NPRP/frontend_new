import { type Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import Head from 'next/head';
import { getLangDir } from 'rtl-detect';

import '@/styles/globals.css';
import { theme } from '@/styles/mantine';
import { ColorSchemeScript, DirectionProvider, MantineProvider } from '@mantine/core';

export const metadata: Metadata = {
	title: 'Next App Mantine Tailwind Template',
	description: 'Next App Mantine Tailwind Template',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const locale = await getLocale();
	const messages = await getMessages();
	const direction = getLangDir(locale);

	return (
		<html dir={direction} lang={locale} suppressHydrationWarning>
			<Head>
				<ColorSchemeScript />
			</Head>
			<body className="antialiased">
				<NextIntlClientProvider messages={messages}>
					<DirectionProvider>
						<MantineProvider theme={theme}>{children}</MantineProvider>
					</DirectionProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
