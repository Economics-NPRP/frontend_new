import Providers from 'app/providers';
import 'mantine-datatable/styles.layer.css';
import { type Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTimeZone } from 'next-intl/server';
import Head from 'next/head';
import { getLangDir } from 'rtl-detect';
import * as v from 'valibot';

import { getUserLocale } from '@/locales';
import '@/schema/models/AuctionData';
import '@/styles/globals.css';
import { ColorSchemeScript } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { Notifications } from '@mantine/notifications';
import '@valibot/i18n/ar';

export const metadata: Metadata = {
	title: {
		default: 'ETS',
		template: '%s | ETS',
	},
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

	v.setGlobalConfig({ lang: locale === 'ar-QA' ? 'ar' : 'en' });

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
						<NextIntlClientProvider
							formats={{
								number: {
									money: {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									},
								},
							}}
							messages={messages}
						>
							<Notifications />
							{children}
						</NextIntlClientProvider>
					</DatesProvider>
				</Providers>
			</body>
		</html>
	);
}
