'use client';

import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useContext } from 'react';

import { ActionBanner } from '@/components/ActionBanner';
import { StatCard } from '@/components/StatCard';
import { AllAuctionCyclesContext } from '@/contexts';
import { Container } from '@mantine/core';
import {
	IconCalendar,
	IconChartPie,
	IconCirclePlus,
	IconGavel,
	IconLeaf,
	IconListSearch,
	IconStackFront,
	IconTargetArrow,
} from '@tabler/icons-react';

import classes from './styles.module.css';

export default function SubBanners() {
	const t = useTranslations();
	const allAuctionCycles = useContext(AllAuctionCyclesContext);

	return (
		<Container className={classes.root}>
			<StatCard
				className={classes.stat}
				icon={<IconCalendar size={80} />}
				title={t('dashboard.admin.cycles.stats.totalCycles.title')}
				tooltip={t('dashboard.admin.cycles.stats.totalCycles.tooltip')}
				type="integer"
				unit={t('constants.cycles.key')}
				value={
					allAuctionCycles.data.results.filter(
						(cycle) =>
							DateTime.fromISO(cycle.createdAt).get('year') ===
							DateTime.now().get('year'),
					).length
				}
				diff={Math.random() * 20 - 10}
				comparison="year"
				loading={allAuctionCycles.isLoading}
			/>
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
				value={Math.random() * 100}
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
				icon={<IconChartPie size={32} />}
				heading={t('dashboard.admin.cycles.actions.sectors.heading')}
				subheading={t('dashboard.admin.cycles.actions.sectors.subheading')}
				component={Link}
				href="/dashboard/a/cycles/sectors"
				index={4}
			/>
			<ActionBanner
				className={classes.banner}
				icon={<IconListSearch size={32} />}
				heading={t('dashboard.admin.cycles.actions.auctions.heading')}
				subheading={t('dashboard.admin.cycles.actions.auctions.subheading')}
				component={Link}
				href="/dashboard/a/cycles/auctions"
				index={2}
			/>
			<ActionBanner
				className={classes.banner}
				icon={<IconStackFront size={32} />}
				heading={t('dashboard.admin.cycles.actions.presets.heading')}
				subheading={t('dashboard.admin.cycles.actions.presets.subheading')}
				component={Link}
				href="/dashboard/a/cycles/presets"
				index={3}
			/>
		</Container>
	);
}
