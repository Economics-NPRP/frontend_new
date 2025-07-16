'use client';

import { useTranslations } from 'next-intl';
import { ReactNode, createContext } from 'react';

import {
	IconBuildingSkyscraper,
	IconChartPie,
	IconCreditCard,
	IconFileSearch,
	IconGavel,
	IconLayoutGrid,
	IconListDetails,
	IconStack3,
	IconUserCircle,
	IconUserSearch,
	IconUserShield,
	IconUsers,
} from '@tabler/icons-react';

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
	tooltip?: string;
	icon?: ReactNode;
	href?: string;
	subHrefs?: Array<Required<Omit<SidebarLinkData, 'subHrefs'>>>;
}
export const SidebarLinks: Record<
	'admin' | 'firm',
	(t: ReturnType<typeof useTranslations<never>>) => Array<SidebarLinkData>
> = {
	admin: (t) => [
		{
			id: 'home',
			label: t('constants.pages.dashboard.admin.home.title'),
			tooltip: t('constants.pages.dashboard.admin.home.tooltip'),
			icon: <IconLayoutGrid size={16} />,
			href: '/dashboard/a',
		},
		{
			id: 'cycles',
			label: t('constants.pages.dashboard.admin.cycles.title'),
			subHrefs: [
				{
					id: 'home',
					label: t('constants.pages.dashboard.admin.cycles.home.title'),
					tooltip: t('constants.pages.dashboard.admin.cycles.home.tooltip'),
					icon: <IconListDetails size={16} />,
					href: '/dashboard/a/cycles',
				},
				{
					id: 'auctions',
					label: t('constants.pages.dashboard.admin.cycles.auctions.title'),
					tooltip: t('constants.pages.dashboard.admin.cycles.auctions.tooltip'),
					icon: <IconGavel size={16} />,
					href: '/dashboard/a/cycles/auctions',
				},
				{
					id: 'sectors',
					label: t('constants.pages.dashboard.admin.cycles.sectors.title'),
					tooltip: t('constants.pages.dashboard.admin.cycles.sectors.tooltip'),
					icon: <IconChartPie size={16} />,
					href: '/dashboard/a/cycles/sectors',
				},
				{
					id: 'presets',
					label: t('constants.pages.dashboard.admin.cycles.presets.title'),
					tooltip: t('constants.pages.dashboard.admin.cycles.presets.tooltip'),
					icon: <IconStack3 size={16} />,
					href: '/dashboard/a/cycles/presets',
				},
			],
		},
		{
			id: 'admins',
			label: t('constants.pages.dashboard.admin.admins.title'),
			subHrefs: [
				{
					id: 'home',
					label: t('constants.pages.dashboard.admin.admins.home.title'),
					tooltip: t('constants.pages.dashboard.admin.admins.home.tooltip'),
					icon: <IconUsers size={16} />,
					href: '/dashboard/a/admins',
				},
				{
					id: 'audit',
					label: t('constants.pages.dashboard.admin.admins.audit.title'),
					tooltip: t('constants.pages.dashboard.admin.admins.audit.tooltip'),
					icon: <IconUserShield size={16} />,
					href: '/dashboard/a/admins/audit',
				},
				{
					id: 'roles',
					label: t('constants.pages.dashboard.admin.admins.roles.title'),
					tooltip: t('constants.pages.dashboard.admin.admins.roles.tooltip'),
					icon: <IconUserCircle size={16} />,
					href: '/dashboard/a/admins/roles',
				},
			],
		},
		{
			id: 'firms',
			label: t('constants.pages.dashboard.admin.firms.title'),
			subHrefs: [
				{
					id: 'home',
					label: t('constants.pages.dashboard.admin.firms.home.title'),
					tooltip: t('constants.pages.dashboard.admin.firms.home.tooltip'),
					icon: <IconBuildingSkyscraper size={16} />,
					href: '/dashboard/a/firms',
				},
				{
					id: 'applications',
					label: t('constants.pages.dashboard.admin.firms.applications.title'),
					tooltip: t('constants.pages.dashboard.admin.firms.applications.tooltip'),
					icon: <IconFileSearch size={16} />,
					href: '/dashboard/a/firms/applications',
				},
				{
					id: 'audit',
					label: t('constants.pages.dashboard.admin.firms.audit.title'),
					tooltip: t('constants.pages.dashboard.admin.firms.audit.tooltip'),
					icon: <IconUserSearch size={16} />,
					href: '/dashboard/a/firms/audit',
				},
				{
					id: 'payments',
					label: t('constants.pages.dashboard.admin.firms.payments.title'),
					icon: <IconCreditCard size={16} />,
					tooltip: t('constants.pages.dashboard.admin.firms.payments.tooltip'),
					href: '/dashboard/a/firms/payments',
				},
			],
		},
	],
	firm: () => [],
};
