import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { ActionBanner } from '@/components/ActionBanner';
import { StatCard } from '@/components/StatCard';
import { Container } from '@mantine/core';
import {
	IconCirclePlus,
	IconGavel,
	IconLeaf,
	IconStackFront,
	IconTargetArrow,
} from '@tabler/icons-react';

import classes from './styles.module.css';

export default function SubBanners() {
	const t = useTranslations();

	return (
		<Container className={classes.root}>
			<StatCard
				className={classes.stat}
				icon={<IconGavel size={80} />}
				title={t('dashboard.admin.cycles.stats.totalAuctions.title')}
				tooltip={t('dashboard.admin.cycles.stats.totalAuctions.tooltip')}
				type="integer"
				unit={t('constants.auctions.key')}
				value={Math.random() * 1000}
				diff={Math.random() * 20 - 10}
				comparison="year"
			/>
			<StatCard
				className={classes.stat}
				icon={<IconLeaf size={80} />}
				title={t('dashboard.admin.cycles.stats.totalPermits.title')}
				tooltip={t('dashboard.admin.cycles.stats.totalPermits.tooltip')}
				type="integer"
				unit={t('constants.permits.key')}
				value={Math.random() * 1000}
				diff={Math.random() * 20 - 10}
				comparison="year"
			/>
			<StatCard
				className={classes.stat}
				icon={<IconTargetArrow size={80} />}
				title={t('dashboard.admin.cycles.stats.kpis.title')}
				tooltip={t('dashboard.admin.cycles.stats.kpis.tooltip')}
				type="percentage"
				value={Math.random() * 1000}
				diff={Math.random() * 20 - 10}
				comparison="year"
			/>
			<ActionBanner
				className={classes.banner}
				icon={<IconCirclePlus size={32} />}
				heading={t('dashboard.admin.cycles.actions.create.heading')}
				subheading={t('dashboard.admin.cycles.actions.create.subheading')}
				component={Link}
				href="/create/cycle"
				index={1}
			/>
			<ActionBanner
				className={classes.banner}
				icon={<IconStackFront size={32} />}
				heading={t('dashboard.admin.cycles.actions.presets.heading')}
				subheading={t('dashboard.admin.cycles.actions.presets.subheading')}
				component={Link}
				href="/dashboard/a/cycles/presets"
				index={2}
			/>
		</Container>
	);
}
