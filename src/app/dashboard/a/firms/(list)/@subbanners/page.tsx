import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { ActionBanner } from '@/components/ActionBanner';
import { StatCard } from '@/components/StatCard';
import { Group, Mark } from '@mantine/core';
import {
	IconAlertHexagon,
	IconBuildingPlus,
	IconChartPie4,
	IconCircleDashedCheck,
	IconCreditCard,
	IconFileSearch,
	IconReceipt,
} from '@tabler/icons-react';

import classes from './styles.module.css';

export default function SubBanners() {
	const t = useTranslations();

	return (
		<Group className={classes.root}>
			<StatCard
				className={classes.stat}
				icon={<IconBuildingPlus size={80} />}
				title={t('dashboard.admin.firms.stats.newRegistrations.title')}
				tooltip={t('dashboard.admin.firms.stats.newRegistrations.tooltip')}
				type="integer"
				unit={t('constants.firms.key')}
				value={Math.random() * 1000}
				diff={Math.random() * 20 - 10}
				comparison="month"
			/>
			<StatCard
				className={classes.stat}
				icon={<IconCircleDashedCheck size={80} />}
				title={t('dashboard.admin.firms.stats.approvalRate.title')}
				tooltip={t('dashboard.admin.firms.stats.approvalRate.tooltip')}
				type="percentage"
				value={Math.random() * 100}
				diff={Math.random() * 20 - 10}
				comparison="month"
			/>
			<StatCard
				className={classes.stat}
				icon={<IconReceipt size={80} />}
				title={t('dashboard.admin.firms.stats.unpaid.title')}
				tooltip={t('dashboard.admin.firms.stats.unpaid.tooltip')}
				type="integer"
				unit={t('constants.transactions.key')}
				value={Math.random() * 1000}
				diff={Math.random() * 20 - 10}
				comparison="month"
			/>
			<StatCard
				className={classes.stat}
				icon={<IconChartPie4 size={80} />}
				title={t('dashboard.admin.firms.stats.sectorDiversity.title')}
				tooltip={t('dashboard.admin.firms.stats.sectorDiversity.tooltip')}
				type="index"
				value={Math.random()}
				diff={Math.random() * 20 - 10}
				comparison="month"
			/>
			<ActionBanner
				className={classes.banner}
				icon={<IconFileSearch size={32} />}
				heading={t('dashboard.admin.firms.subbanner.1.heading')}
				subheading={t.rich('dashboard.admin.firms.subbanner.1.text', {
					value: Math.round(Math.random() * 1000),
					mark: (chunks) => <Mark className={classes.highlight}>{chunks}</Mark>,
				})}
				component={Link}
				href="/dashboard/a/firms/applications"
				index={1}
			/>
			<ActionBanner
				className={classes.banner}
				icon={<IconAlertHexagon size={32} />}
				heading={t('dashboard.admin.firms.subbanner.2.heading')}
				subheading={t.rich('dashboard.admin.firms.subbanner.2.text', {
					value: Math.round(Math.random() * 1000),
				})}
				component={Link}
				href="/dashboard/a/firms/audits"
				index={2}
			/>
			<ActionBanner
				className={classes.banner}
				icon={<IconCreditCard size={32} />}
				heading={t('dashboard.admin.firms.subbanner.3.heading')}
				subheading={t.rich('dashboard.admin.firms.subbanner.3.text', {
					value: Math.round(Math.random() * 100),
					mark: (chunks) => <Mark className={classes.highlight}>{chunks}</Mark>,
				})}
				component={Link}
				href="/dashboard/a/firms/transactions"
				index={3}
			/>
		</Group>
	);
}
