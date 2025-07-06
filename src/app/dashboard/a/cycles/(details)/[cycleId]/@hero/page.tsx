'use client';

import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';
import { useContext } from 'react';

import { AuctionCycleStatusBadge, BaseBadge } from '@/components/Badge';
import { Id } from '@/components/Id';
import { SingleCycleContext } from '@/contexts';
import { useCycleStatus } from '@/hooks';
import { DashboardHero } from '@/pages/dashboard/_components/DashboardHero';
import { ActionIcon, Tooltip } from '@mantine/core';
import { IconBell, IconPencil, IconUsers } from '@tabler/icons-react';

import classes from './styles.module.css';

export default function Hero() {
	const t = useTranslations();
	const cycle = useContext(SingleCycleContext);

	const { duration, interval } = useCycleStatus(cycle.data);

	return (
		<DashboardHero
			className={classes.root}
			title={cycle.data.title}
			description={cycle.data.description}
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
					<BaseBadge
						variant="light"
						className={`${classes.basic} ${classes.badge}`}
						loading={cycle.isLoading}
					>
						{t('components.auctionCycleCard.header.subtitle', {
							value: DateTime.fromISO(cycle.data.updatedAt).toRelative(),
						})}
					</BaseBadge>
				</>
			}
			actions={
				<>
					<Tooltip
						label={t('dashboard.admin.cycles.details.actions.edit.tooltip')}
						position="top"
					>
						<ActionIcon className={classes.button} variant="outline">
							<IconPencil size={14} />
						</ActionIcon>
					</Tooltip>
					<Tooltip
						label={t('dashboard.admin.cycles.details.actions.members.tooltip')}
						position="top"
					>
						<ActionIcon className={classes.button} variant="outline">
							<IconUsers size={14} />
						</ActionIcon>
					</Tooltip>
					<Tooltip
						label={t('dashboard.admin.cycles.details.actions.updates.tooltip')}
						position="top"
					>
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
