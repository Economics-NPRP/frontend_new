import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';

import { PaginatedAdminsProvider } from '@/contexts';
import { withProviders } from '@/helpers';
import { DashboardHero } from '@/pages/dashboard/_components/DashboardHero';
import { Stack } from '@mantine/core';

import classes from './styles.module.css';

export const metadata: Metadata = {
	title: 'Admins',
};

export interface AdminsListProps {
	subbanners: ReactNode;
	table: ReactNode;
}
export default function AdminsList({ subbanners, table }: AdminsListProps) {
	const t = useTranslations();

	return withProviders(
		<Stack className={classes.root}>
			<DashboardHero
				title={t('constants.pages.dashboard.admin.admins.title')}
				description={t('constants.pages.dashboard.admin.admins.description')}
				returnButton={{ href: '/dashboard/a', label: t('constants.return.home.label') }}
				breadcrumbs={[
					{
						label: t('constants.pages.dashboard.admin.home.title'),
						href: '/dashboard/a',
					},
					{
						label: t('constants.pages.dashboard.admin.admins.title'),
						href: '/dashboard/a/admins',
					},
				]}
			/>
			{subbanners}
			{table}
		</Stack>,
		{ provider: PaginatedAdminsProvider },
	);
}
