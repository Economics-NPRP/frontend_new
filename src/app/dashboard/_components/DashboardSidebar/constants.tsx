'use client';

import { useTranslations } from 'next-intl';
import { ReactNode, createContext } from 'react';

import {
	IconBellBolt,
	IconBuildingSkyscraper,
	IconCalendar,
	IconChartBar,
	IconChartPie,
	IconCreditCard,
	IconGavel,
	IconLayoutGrid,
	IconLeaf,
	IconListDetails,
	IconReport,
	IconStack3,
	IconTag,
	IconTargetArrow,
	IconUserCircle,
	IconUserSearch,
	IconUserShield,
	IconUsers,
	IconFileCheck,
	IconFileSearch
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
	(t: ReturnType<typeof useTranslations<never>>, expanded: boolean) => Array<SidebarLinkData>
> = {
	admin: (t, expanded) => [
		{
			id: 'home',
			label: t('constants.pages.dashboard.admin.home.title'),
			tooltip: expanded
				? t('constants.pages.dashboard.admin.home.tooltip')
				: t('constants.pages.dashboard.admin.home.title'),
			icon: <IconLayoutGrid size={16} />,
			href: '/dashboard/a',
		},
		{
			id: 'statistics',
			label: t('constants.pages.dashboard.admin.statistics.title'),
			tooltip: expanded
				? t('constants.pages.dashboard.admin.statistics.tooltip')
				: t('constants.pages.dashboard.admin.statistics.title'),
			icon: <IconChartBar size={16} />,
			href: '/dashboard/a/statistics',
		},
		{
			id: 'cycles',
			label: t('constants.pages.dashboard.admin.cycles.title'),
			subHrefs: [
				{
					id: 'home',
					label: t('constants.pages.dashboard.admin.cycles.home.title'),
					tooltip: expanded
						? t('constants.pages.dashboard.admin.cycles.home.tooltip')
						: t('constants.pages.dashboard.admin.cycles.home.title'),
					icon: <IconCalendar size={16} />,
					href: '/dashboard/a/cycles',
				},
				{
					id: 'auctions',
					label: t('constants.pages.dashboard.admin.cycles.auctions.title'),
					tooltip: expanded
						? t('constants.pages.dashboard.admin.cycles.auctions.tooltip')
						: t('constants.pages.dashboard.admin.cycles.auctions.title'),
					icon: <IconGavel size={16} />,
					href: '/dashboard/a/cycles/auctions',
				},
				{
					id: 'sectors',
					label: t('constants.pages.dashboard.admin.cycles.sectors.title'),
					tooltip: expanded
						? t('constants.pages.dashboard.admin.cycles.sectors.tooltip')
						: t('constants.pages.dashboard.admin.cycles.sectors.title'),
					icon: <IconChartPie size={16} />,
					href: '/dashboard/a/cycles/sectors',
				},
				{
					id: 'presets',
					label: t('constants.pages.dashboard.admin.cycles.presets.title'),
					tooltip: expanded
						? t('constants.pages.dashboard.admin.cycles.presets.tooltip')
						: t('constants.pages.dashboard.admin.cycles.presets.title'),
					icon: <IconStack3 size={16} />,
					href: '/dashboard/a/cycles/presets',
				},
			],
		},
		{
			id: 'permits',
			label: t('constants.pages.dashboard.admin.permits.title'),
			subHrefs: [
				{
					id: 'home',
					label: t('constants.pages.dashboard.admin.permits.home.title'),
					tooltip: expanded
						? t('constants.pages.dashboard.admin.permits.home.tooltip')
						: t('constants.pages.dashboard.admin.permits.home.title'),
					icon: <IconFileCheck size={16} />,
					href: '/dashboard/a/permits',
				},
				{
					id: 'auctions',
					label: t('constants.pages.dashboard.admin.permits.audit.title'),
					tooltip: expanded
						? t('constants.pages.dashboard.admin.permits.audit.tooltip')
						: t('constants.pages.dashboard.admin.permits.audit.title'),
					icon: <IconFileSearch size={16} />,
					href: '/dashboard/a/permits/audit',
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
					tooltip: expanded
						? t('constants.pages.dashboard.admin.admins.home.tooltip')
						: t('constants.pages.dashboard.admin.admins.home.title'),
					icon: <IconUsers size={16} />,
					href: '/dashboard/a/admins',
				},
				{
					id: 'audit',
					label: t('constants.pages.dashboard.admin.admins.audit.title'),
					tooltip: expanded
						? t('constants.pages.dashboard.admin.admins.audit.tooltip')
						: t('constants.pages.dashboard.admin.admins.audit.title'),
					icon: <IconUserShield size={16} />,
					href: '/dashboard/a/admins/audit',
				},
				{
					id: 'roles',
					label: t('constants.pages.dashboard.admin.admins.roles.title'),
					tooltip: expanded
						? t('constants.pages.dashboard.admin.admins.roles.tooltip')
						: t('constants.pages.dashboard.admin.admins.roles.title'),
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
					tooltip: expanded
						? t('constants.pages.dashboard.admin.firms.home.tooltip')
						: t('constants.pages.dashboard.admin.firms.home.title'),
					icon: <IconBuildingSkyscraper size={16} />,
					href: '/dashboard/a/firms',
				},
				{
					id: 'applications',
					label: t('constants.pages.dashboard.admin.firms.applications.title'),
					tooltip: expanded
						? t('constants.pages.dashboard.admin.firms.applications.tooltip')
						: t('constants.pages.dashboard.admin.firms.applications.title'),
					icon: <IconListDetails size={16} />,
					href: '/dashboard/a/firms/applications',
				},
				{
					id: 'audit',
					label: t('constants.pages.dashboard.admin.firms.audit.title'),
					tooltip: expanded
						? t('constants.pages.dashboard.admin.firms.audit.tooltip')
						: t('constants.pages.dashboard.admin.firms.audit.title'),
					icon: <IconUserSearch size={16} />,
					href: '/dashboard/a/firms/audit',
				},
				{
					id: 'payments',
					label: t('constants.pages.dashboard.admin.firms.payments.title'),
					icon: <IconCreditCard size={16} />,
					tooltip: expanded
						? t('constants.pages.dashboard.admin.firms.payments.tooltip')
						: t('constants.pages.dashboard.admin.firms.payments.title'),
					href: '/dashboard/a/firms/payments',
				},
			],
		},
		{
			id: 'firms',
			label: t('constants.pages.dashboard.admin.sma.title'),
			subHrefs: [
				{
					id: 'home',
					label: t('constants.pages.dashboard.admin.sma.auction-applications.title'),
					tooltip: expanded
						? t('constants.pages.dashboard.admin.sma.auction-applications.tooltip')
						: t('constants.pages.dashboard.admin.sma.auction-applications.title'),
					icon: <IconBuildingSkyscraper size={16} />,
					href: '/dashboard/a/sma/auction-applications',
				},
				{
					id: 'audit',
					label: t('constants.pages.dashboard.admin.sma.audit.title'),
					tooltip: expanded
						? t('constants.pages.dashboard.admin.sma.audit.tooltip')
						: t('constants.pages.dashboard.admin.sma.audit.title'),
					icon: <IconUserSearch size={16} />,
					href: '/dashboard/a/sma/audit',
				},
				{
					id: 'payments',
					label: t('constants.pages.dashboard.admin.firms.payments.title'),
					icon: <IconCreditCard size={16} />,
					tooltip: expanded
						? t('constants.pages.dashboard.admin.firms.payments.tooltip')
						: t('constants.pages.dashboard.admin.firms.payments.title'),
					href: '/dashboard/a/firms/payments',
				},
			],
		}
	],
	firm: (t, expanded) => [
		{
			id: 'home',
			label: t('constants.pages.dashboard.firm.home.title'),
			tooltip: expanded
				? t('constants.pages.dashboard.firm.home.tooltip')
				: t('constants.pages.dashboard.firm.home.title'),
			icon: <IconLayoutGrid size={16} />,
			href: '/dashboard/f',
		},
		{
			id: 'statistics',
			label: t('constants.pages.dashboard.firm.statistics.title'),
			tooltip: expanded
				? t('constants.pages.dashboard.firm.statistics.tooltip')
				: t('constants.pages.dashboard.firm.statistics.title'),
			icon: <IconChartBar size={16} />,
			href: '/dashboard/f/statistics',
		},
		{
			id: 'carbon',
			label: t('constants.pages.dashboard.firm.carbon.title'),
			subHrefs: [
				{
					id: 'pe',
					label: t('constants.pages.dashboard.firm.carbon.pe.title'),
					tooltip: expanded
						? t('constants.pages.dashboard.firm.carbon.pe.tooltip')
						: t('constants.pages.dashboard.firm.carbon.pe.title'),
					icon: <IconLeaf size={16} />,
					href: '/dashboard/f/carbon/pae',
				},
				{
					id: 'targets',
					label: t('constants.pages.dashboard.firm.carbon.targets.title'),
					tooltip: expanded
						? t('constants.pages.dashboard.firm.carbon.targets.tooltip')
						: t('constants.pages.dashboard.firm.carbon.targets.title'),
					icon: <IconTargetArrow size={16} />,
					href: '/dashboard/f/carbon/targets',
				},
				{
					id: 'report',
					label: t('constants.pages.dashboard.firm.carbon.report.title'),
					tooltip: expanded
						? t('constants.pages.dashboard.firm.carbon.report.tooltip')
						: t('constants.pages.dashboard.firm.carbon.report.title'),
					icon: <IconReport size={16} />,
					href: '/dashboard/f/carbon/report',
				},
			],
		},
		{
			id: 'economic',
			label: t('constants.pages.dashboard.firm.economic.title'),
			subHrefs: [
				{
					id: 'auctions',
					label: t('constants.pages.dashboard.firm.economic.auctions.title'),
					tooltip: expanded
						? t('constants.pages.dashboard.firm.economic.auctions.tooltip')
						: t('constants.pages.dashboard.firm.economic.auctions.title'),
					icon: <IconGavel size={16} />,
					href: '/dashboard/f/economic/auctions',
				},
				{
					id: 'notifications',
					label: t('constants.pages.dashboard.firm.economic.notifications.title'),
					tooltip: expanded
						? t('constants.pages.dashboard.firm.economic.notifications.tooltip')
						: t('constants.pages.dashboard.firm.economic.notifications.title'),
					icon: <IconBellBolt size={16} />,
					href: '/dashboard/f/economic/notifications',
				},
				{
					id: 'payments',
					label: t('constants.pages.dashboard.firm.economic.payments.title'),
					tooltip: expanded
						? t('constants.pages.dashboard.firm.economic.payments.tooltip')
						: t('constants.pages.dashboard.firm.economic.payments.title'),
					icon: <IconCreditCard size={16} />,
					href: '/dashboard/f/economic/payments',
				},
				{
					id: 'sell',
					label: t('constants.pages.dashboard.firm.economic.sell.title'),
					icon: <IconTag size={16} />,
					tooltip: expanded
						? t('constants.pages.dashboard.firm.economic.sell.tooltip')
						: t('constants.pages.dashboard.firm.economic.sell.title'),
					href: '/create/auction',
				},
			],
		},
	],
};
