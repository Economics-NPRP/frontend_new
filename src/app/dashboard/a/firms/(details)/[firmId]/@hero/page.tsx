'use client';

import { useTranslations } from 'next-intl';
import { useContext } from 'react';

import { SingleFirmContext } from '@/contexts';
import { DashboardHero } from '@/pages/dashboard/_components/DashboardHero';

export default function Hero() {
	const t = useTranslations();
	const firm = useContext(SingleFirmContext);

	return (
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
					label: firm.data.name,
					href: `/dashboard/a/firms/${firm.data.id}`,
				},
			]}
		/>
	);
}
