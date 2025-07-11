'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useContext } from 'react';

import { ActionBanner } from '@/components/ActionBanner';
import { StatCard } from '@/components/StatCard';
import { PaginatedAdminsContext } from '@/contexts';
import { Group } from '@mantine/core';
import {
	IconAlertHexagon,
	IconCirclePlus,
	IconUserBolt,
	IconUserCircle,
	IconUsers,
} from '@tabler/icons-react';

import classes from './styles.module.css';

export default function SubBanners() {
	const t = useTranslations();
	const paginatedAdmins = useContext(PaginatedAdminsContext);

	return (
		<Group className={classes.root}>
			<StatCard
				className={classes.stat}
				icon={<IconUsers size={80} />}
				title={t('dashboard.admin.admins.stats.total.title')}
				tooltip={t('dashboard.admin.admins.stats.total.tooltip')}
				type="integer"
				unit={t('constants.admins.key')}
				value={paginatedAdmins.data.totalCount}
				diff={Math.random() * 20 - 10}
				comparison="year"
				loading={paginatedAdmins.isLoading}
			/>
			<StatCard
				className={classes.stat}
				icon={<IconUserBolt size={80} />}
				title={t('dashboard.admin.admins.stats.activeAdmins.title')}
				tooltip={t('dashboard.admin.admins.stats.activeAdmins.tooltip')}
				type="integer"
				unit={t('constants.admins.key')}
				value={Math.random() * 100}
				diff={Math.random() * 20 - 10}
				comparison="day"
			/>
			<ActionBanner
				className={classes.banner}
				icon={<IconCirclePlus size={32} />}
				heading={t('dashboard.admin.admins.subbanner.1.heading')}
				subheading={t('dashboard.admin.admins.subbanner.1.text')}
				component={Link}
				href="/create/admin"
				index={1}
			/>
			<ActionBanner
				className={classes.banner}
				icon={<IconAlertHexagon size={32} />}
				heading={t('dashboard.admin.admins.subbanner.2.heading')}
				subheading={t.rich('dashboard.admin.admins.subbanner.2.text', {
					value: Math.round(Math.random() * 1000),
				})}
				component={Link}
				href="/dashboard/a/admins/audits"
				index={2}
			/>
			<ActionBanner
				className={classes.banner}
				icon={<IconUserCircle size={32} />}
				heading={t('dashboard.admin.admins.subbanner.3.heading')}
				subheading={t('dashboard.admin.admins.subbanner.3.text')}
				component={Link}
				href="/dashboard/a/admins/roles"
				index={3}
			/>
		</Group>
	);
}
