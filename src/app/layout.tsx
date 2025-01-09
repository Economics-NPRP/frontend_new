import Providers from 'app/providers';
import { type Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Head from 'next/head';
import { getLangDir } from 'rtl-detect';

import { getUserLocale } from '@/locales';
import '@/schema/models/AuctionData';
import '@/styles/globals.css';
import '@mantine/carousel/styles.css';
import { ColorSchemeScript } from '@mantine/core';

export const metadata: Metadata = {
	title: 'Next App Mantine Tailwind Template',
	description: 'Next App Mantine Tailwind Template',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const locale = await getUserLocale();
	const direction = getLangDir(locale);
	const messages = await getMessages();

	return (
		<html dir={direction} lang={locale} suppressHydrationWarning>
			<Head>
				<ColorSchemeScript />
			</Head>
			<body className="antialiased overflow-x-hidden">
				<Providers>
					<NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
				</Providers>
			</body>
		</html>
	);
}
