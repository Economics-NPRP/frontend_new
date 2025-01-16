import Providers from 'app/providers';
import { type Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTimeZone } from 'next-intl/server';
import Head from 'next/head';
import { getLangDir } from 'rtl-detect';

import { getUserLocale } from '@/locales';
import '@/schema/models/AuctionData';
import '@/styles/globals.css';
import '@mantine/carousel/styles.css';
import { ColorSchemeScript } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import '@mantine/dates/styles.css';

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
	const timezone = await getTimeZone();

	return (
		<html dir={direction} lang={locale} suppressHydrationWarning>
			<Head>
				<ColorSchemeScript />
			</Head>
			<body className="antialiased overflow-x-hidden">
				<Providers>
					<DatesProvider
						settings={{
							locale,
							timezone,
							firstDayOfWeek: 0,
							weekendDays: [5, 6],
						}}
					>
						<NextIntlClientProvider messages={messages}>
							{children}
						</NextIntlClientProvider>
					</DatesProvider>
				</Providers>
			</body>
		</html>
	);
}
