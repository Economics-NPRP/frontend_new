import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';

import { PaginatedFirmApplicationsProvider } from '@/contexts';
import { withProviders } from '@/helpers';
import { DashboardHero } from '@/pages/dashboard/_components/DashboardHero';
import { InvitationModalProvider } from '@/pages/dashboard/a/firms/_components/InvitationModal';
import { Stack } from '@mantine/core';

import classes from './styles.module.css';

export const metadata: Metadata = {
	title: 'Firm Applications',
};

export interface FirmApplicationsListProps {
	table: ReactNode;
}
export default function FirmApplicationsList({ table }: FirmApplicationsListProps) {
	const t = useTranslations();

	return withProviders(
		<Stack className={classes.root}>
			<DashboardHero
				returnButton={{
					href: '/dashboard/a/firms',
					label: t('constants.return.firmsList.label'),
				}}
				breadcrumbs={[
					{
						label: t('constants.pages.dashboard.admin.home.title'),
						href: '/dashboard/a',
					},
					{
						label: t('constants.pages.dashboard.admin.firms.title'),
						href: '/dashboard/a/firms',
					},
					{
						label: t('constants.pages.dashboard.admin.firms.applications.title'),
						href: '/dashboard/a/firms/applications',
					},
				]}
			/>
			{table}
		</Stack>,
		{ provider: PaginatedFirmApplicationsProvider },
		{ provider: InvitationModalProvider },
	);
}
