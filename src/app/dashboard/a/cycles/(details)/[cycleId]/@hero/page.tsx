'use client';

import { useTranslations } from 'next-intl';
import { useContext, useEffect } from 'react';

import { DashboardAsideContext } from '@/pages/dashboard/_components/DashboardAside';
// import { useContext } from 'react';

// import { SingleCycleContext } from '@/contexts';
import { DashboardHero } from '@/pages/dashboard/_components/DashboardHero';
import { Stack } from '@mantine/core';
import { IconUsers } from '@tabler/icons-react';

export default function Hero() {
	const t = useTranslations();
	// const cycle = useContext(SingleCycleContext);
	const { setTabs } = useContext(DashboardAsideContext);

	useEffect(
		() =>
			setTabs([
				{
					value: 'members',
					label: 'Team Members',
					icon: <IconUsers size={16} />,
					content: <Stack>hello</Stack>,
				},
			]),
		[setTabs],
	);

	return (
		<DashboardHero
			title={t('constants.pages.dashboard.admin.cycles.title')}
			returnButton={{
				href: '/dashboard/a/cycles',
				label: t('constants.return.cyclesList.label'),
			}}
			breadcrumbs={[
				{
					label: t('constants.pages.dashboard.admin.home.title'),
					href: '/dashboard/a',
				},
				{
					label: t('constants.pages.dashboard.admin.cycles.title'),
					href: '/dashboard/a/cycles',
				},
				// {
				// 	label: cycle.data.name,
				// 	href: `/dashboard/a/cycles/${cycle.data.id}`,
				// },
			]}
			// loading={cycle.isLoading}
		/>
	);
}
