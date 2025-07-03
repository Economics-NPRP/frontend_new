'use client';

import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';

import { AuctionCycleStatusBadge, BaseBadge } from '@/components/Badge';
import { Id } from '@/components/Id';
import { useCycleStatus } from '@/hooks';
// import { useContext } from 'react';

// import { SingleCycleContext } from '@/contexts';
import { DashboardHero } from '@/pages/dashboard/_components/DashboardHero';
import { IAuctionCycleData } from '@/schema/models';
import { ActionIcon, Tooltip } from '@mantine/core';
import { IconBell, IconUsers } from '@tabler/icons-react';

import classes from './styles.module.css';

export default function Hero() {
	const t = useTranslations();
	// const cycle = useContext(SingleCycleContext);
	const cycle = {
		data: {
			id: 'b8b3441f-ca52-4c79-8ea1-7a8c4c56d19c',
			title: 'Summer 2025',
			status: 'draft',
			auctionsCount: 367,
			emissionsCount: 143559152,
			startDatetime: DateTime.now().plus({ days: 3 }).toISO(),
			endDatetime: DateTime.now().plus({ months: 3 }).toISO(),
			updatedAt: DateTime.now().minus({ hours: 3 }).toISO(),
		} as IAuctionCycleData,
		isLoading: false,
	};

	const { duration, interval } = useCycleStatus(cycle.data);

	return (
		<DashboardHero
			title={cycle.data.title}
			description={t('components.auctionCycleCard.header.subtitle', {
				value: DateTime.fromISO(cycle.data.updatedAt).toRelative(),
			})}
			meta={<Id value={cycle.data.id} variant="auctionCycle" />}
			badges={
				<>
					<AuctionCycleStatusBadge
						status={cycle.data.status}
						className={classes.badge}
						loading={cycle.isLoading}
					/>
					<BaseBadge
						variant="light"
						className={`${classes.basic} ${classes.badge}`}
						loading={cycle.isLoading}
					>
						{duration}
					</BaseBadge>
					<BaseBadge
						variant="light"
						className={`${classes.basic} ${classes.badge}`}
						loading={cycle.isLoading}
					>
						{interval}
					</BaseBadge>
				</>
			}
			actions={
				<>
					<Tooltip label="View admins assigned to this cycle" position="top">
						<ActionIcon className={classes.button} variant="outline">
							<IconUsers size={14} />
						</ActionIcon>
					</Tooltip>
					<Tooltip label="View latest changes made to this cycle" position="top">
						<ActionIcon className={classes.button} variant="outline">
							<IconBell size={14} />
						</ActionIcon>
					</Tooltip>
				</>
			}
			returnButton={{
				href: '/dashboard/a/cycles',
				label: t('constants.return.cyclesList.label'),
			}}
			breadcrumbs={[
				{
					label: t('constants.pages.dashboard.admin.home.title'),
					href: '/dashboard/a',
				},
				{
					label: t('constants.pages.dashboard.admin.cycles.title'),
					href: '/dashboard/a/cycles',
				},
				{
					label: cycle.data.title,
					href: `/dashboard/a/cycles/${cycle.data.id}`,
				},
			]}
			loading={cycle.isLoading}
		/>
	);
}
