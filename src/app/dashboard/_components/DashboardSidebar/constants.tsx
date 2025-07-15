'use client';

import { useTranslations } from 'next-intl';
import { ReactNode, createContext } from 'react';

import { IconBuildingSkyscraper, IconGavel, IconLayoutGrid, IconUsers } from '@tabler/icons-react';

export const DefaultDashboardSidebarContextData: IDashboardSidebarContext = {
	expanded: false,
	setExpanded: () => {},
};

export interface IDashboardSidebarContext {
	expanded: boolean;
	setExpanded: (value: boolean) => void;
}

export const DashboardSidebarContext = createContext<IDashboardSidebarContext>(
	DefaultDashboardSidebarContextData,
);

export interface SidebarLinkData {
	id: string;
	label: ReactNode;
	icon: ReactNode;
	href?: string;
	subHrefs?: Array<Required<Omit<SidebarLinkData, 'subHrefs' | 'icon'>>>;
}
export const SidebarLinks: Record<
	'admin' | 'firm',
	(t: ReturnType<typeof useTranslations<never>>) => Array<SidebarLinkData>
> = {
	admin: (t) => [
		{
			id: 'home',
			label: t('constants.pages.dashboard.admin.home.title'),
			icon: <IconLayoutGrid size={16} />,
			href: '/dashboard/a',
		},
		{
			id: 'cycles',
			label: t('constants.pages.dashboard.admin.cycles.title'),
			icon: <IconGavel size={16} />,
			subHrefs: [
				{
					id: 'home',
					label: t('constants.pages.dashboard.admin.cycles.home.title'),
					href: '/dashboard/a/cycles',
				},
				{
					id: 'auctions',
					label: t('constants.pages.dashboard.admin.cycles.auctions.title'),
					href: '/dashboard/a/cycles/auctions',
				},
				{
					id: 'sectors',
					label: t('constants.pages.dashboard.admin.cycles.sectors.title'),
					href: '/dashboard/a/cycles/sectors',
				},
				{
					id: 'presets',
					label: t('constants.pages.dashboard.admin.cycles.presets.title'),
					href: '/dashboard/a/cycles/presets',
				},
			],
		},
		{
			id: 'admins',
			label: t('constants.pages.dashboard.admin.admins.title'),
			icon: <IconUsers size={16} />,
			subHrefs: [
				{
					id: 'home',
					label: t('constants.pages.dashboard.admin.admins.home.title'),
					href: '/dashboard/a/admins',
				},
				{
					id: 'audit',
					label: t('constants.pages.dashboard.admin.admins.audit.title'),
					href: '/dashboard/a/admins/audit',
				},
				{
					id: 'roles',
					label: t('constants.pages.dashboard.admin.admins.roles.title'),
					href: '/dashboard/a/admins/roles',
				},
			],
		},
		{
			id: 'firms',
			label: t('constants.pages.dashboard.admin.firms.title'),
			icon: <IconBuildingSkyscraper size={16} />,
			subHrefs: [
				{
					id: 'home',
					label: t('constants.pages.dashboard.admin.firms.home.title'),
					href: '/dashboard/a/firms',
				},
				{
					id: 'applications',
					label: t('constants.pages.dashboard.admin.firms.applications.title'),
					href: '/dashboard/a/firms/applications',
				},
				{
					id: 'audit',
					label: t('constants.pages.dashboard.admin.firms.audit.title'),
					href: '/dashboard/a/firms/audit',
				},
				{
					id: 'payments',
					label: t('constants.pages.dashboard.admin.firms.payments.title'),
					href: '/dashboard/a/firms/payments',
				},
			],
		},
	],
	firm: () => [],
};
