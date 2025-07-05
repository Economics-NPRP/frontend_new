'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

import {
	DashboardAsideContext,
	DashboardAsideTabData,
	DefaultDashboardAsideContextData,
	IDashboardAsideContext,
} from '@/pages/dashboard/_components/DashboardAside/constants';
import { MembersContent } from '@/pages/dashboard/a/cycles/(details)/[cycleId]/@aside/Members';
import { UpdatesContent } from '@/pages/dashboard/a/cycles/(details)/[cycleId]/@aside/Updates';
import { Stack, StackProps, Tabs } from '@mantine/core';
import { IconBell, IconUsers } from '@tabler/icons-react';

import classes from './styles.module.css';

export const DashboardAside = ({ className, ...props }: StackProps) => {
	const { tabs } = useContext(DashboardAsideContext);

	return tabs.length > 0 ? (
		<Stack className={`${classes.root} ${className}`} {...props}>
			<Tabs
				classNames={{ root: classes.tabs, panel: classes.panel, tab: classes.tab }}
				defaultValue={tabs[0].value}
			>
				<Tabs.List grow>
					{tabs.map(({ value, label, icon }) => (
						<Tabs.Tab key={value} value={value} leftSection={icon}>
							{label}
						</Tabs.Tab>
					))}
				</Tabs.List>

				{tabs.map(({ value, content }) => (
					<Tabs.Panel key={value} value={value}>
						{content}
					</Tabs.Panel>
				))}
			</Tabs>
		</Stack>
	) : null;
};

export const DashboardAsideProvider = ({ children }: PropsWithChildren) => {
	const t = useTranslations();
	const pathname = usePathname();
	const [tabs, setTabs] = useState<IDashboardAsideContext['tabs']>(
		DefaultDashboardAsideContextData.tabs,
	);

	const tabsDirectory: Record<string, Array<DashboardAsideTabData>> = useMemo(
		() => ({
			'cycle-details-aside': [
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
			],
		}),
		[t],
	);

	//	Find matching tabs when pathname changes
	useEffect(() => {
		const asideId = document.querySelector('span[data-aside]')?.getAttribute('id');
		if (!asideId || !tabsDirectory[asideId]) {
			setTabs(DefaultDashboardAsideContextData.tabs);
			return;
		}

		setTabs(tabsDirectory[asideId]);
	}, [pathname]);

	return (
		<DashboardAsideContext.Provider value={{ tabs, setTabs }}>
			{children}
		</DashboardAsideContext.Provider>
	);
};
