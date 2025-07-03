'use client';

import { useTranslations } from 'next-intl';
import { useContext, useEffect } from 'react';

import { DashboardAsideContext } from '@/pages/dashboard/_components/DashboardAside';
import { MembersContent } from '@/pages/dashboard/a/cycles/(details)/[cycleId]/@aside/Members';
import { UpdatesContent } from '@/pages/dashboard/a/cycles/(details)/[cycleId]/@aside/Updates';
import { IconBell, IconUsers } from '@tabler/icons-react';

export default function Aside() {
	const t = useTranslations();
	const { setTabs } = useContext(DashboardAsideContext);

	useEffect(
		() =>
			setTabs([
				{
					value: 'members',
					label: t('dashboard.admin.cycles.details.aside.members.tab'),
					icon: <IconUsers size={14} />,
					content: <MembersContent />,
				},
				{
					value: 'updates',
					label: t('dashboard.admin.cycles.details.aside.updates.tab'),
					icon: <IconBell size={14} />,
					content: <UpdatesContent />,
				},
			]),
		[setTabs, t],
	);
}
