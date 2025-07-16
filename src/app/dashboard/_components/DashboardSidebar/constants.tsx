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
	IconStack,
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
					icon: <IconListDetails size={16} />,
					href: '/dashboard/a/cycles',
				},
				{
					id: 'auctions',
					label: t('constants.pages.dashboard.admin.cycles.auctions.title'),
					icon: <IconGavel size={16} />,
					href: '/dashboard/a/cycles/auctions',
				},
				{
					id: 'sectors',
					label: t('constants.pages.dashboard.admin.cycles.sectors.title'),
					icon: <IconChartPie size={16} />,
					href: '/dashboard/a/cycles/sectors',
				},
				{
					id: 'presets',
					label: t('constants.pages.dashboard.admin.cycles.presets.title'),
					icon: <IconStack size={16} />,
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
					icon: <IconUsers size={16} />,
					href: '/dashboard/a/admins',
				},
				{
					id: 'audit',
					label: t('constants.pages.dashboard.admin.admins.audit.title'),
					icon: <IconUserShield size={16} />,
					href: '/dashboard/a/admins/audit',
				},
				{
					id: 'roles',
					label: t('constants.pages.dashboard.admin.admins.roles.title'),
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
					icon: <IconBuildingSkyscraper size={16} />,
					href: '/dashboard/a/firms',
				},
				{
					id: 'applications',
					label: t('constants.pages.dashboard.admin.firms.applications.title'),
					icon: <IconFileSearch size={16} />,
					href: '/dashboard/a/firms/applications',
				},
				{
					id: 'audit',
					label: t('constants.pages.dashboard.admin.firms.audit.title'),
					icon: <IconUserSearch size={16} />,
					href: '/dashboard/a/firms/audit',
				},
				{
					id: 'payments',
					label: t('constants.pages.dashboard.admin.firms.payments.title'),
					icon: <IconCreditCard size={16} />,
					href: '/dashboard/a/firms/payments',
				},
			],
		},
	],
	firm: () => [],
};
