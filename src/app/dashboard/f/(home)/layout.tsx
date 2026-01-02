import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';

import { DashboardHero } from '@/pages/dashboard/_components/DashboardHero';
import { Stack } from '@mantine/core';

import { withProviders } from 'helpers/withProviders';
import { MyUserProfileProvider } from 'contexts/MyUserProfile';

import classes from './styles.module.css';

export const metadata: Metadata = {
	title: 'Home',
};

export interface HomeProps {
	hero: ReactNode;
}
export default function Home({ hero }: HomeProps) {
	const t = useTranslations();

	return withProviders(
		<Stack className={classes.root}>
			<DashboardHero
				title={t('constants.pages.dashboard.firm.home.title')}
				breadcrumbs={[
					{
						label: t('constants.pages.dashboard.firm.home.title'),
						href: '/dashboard/f',
					},
				]}
			/>
			{hero}
		</Stack>,
		{ provider: MyUserProfileProvider }
	);
}
