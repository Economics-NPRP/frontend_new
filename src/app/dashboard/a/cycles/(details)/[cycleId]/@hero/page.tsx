'use client';

import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useContext } from 'react';

import { AuctionCycleStatusBadge, BaseBadge, SectorBadge } from '@/components/Badge';
import { Id } from '@/components/Id';
import { SingleCycleContext } from '@/contexts';
import { useCycleStatus } from '@/hooks';
import { DashboardHero } from '@/pages/dashboard/_components/DashboardHero';
import { CycleDetailsPageContext } from '@/pages/dashboard/a/cycles/(details)/[cycleId]/_components/Providers';
import { ActionIcon, Tooltip } from '@mantine/core';
import { IconBell, IconMessage, IconPencil, IconUsers } from '@tabler/icons-react';

import classes from './styles.module.css';

export default function Hero() {
	const t = useTranslations();
	const cycle = useContext(SingleCycleContext);
	const { openDrawer } = useContext(CycleDetailsPageContext);

	const { isUpcoming, duration, interval } = useCycleStatus(cycle.data);

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
					{cycle.data.sectors.map((sector) => (
						<SectorBadge
							key={sector}
							sector={sector}
							className={classes.badge}
							loading={cycle.isLoading}
						/>
					))}
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
					{isUpcoming && cycle.data.status === 'draft' && (
						<Tooltip
							label={t('dashboard.admin.cycles.details.actions.edit.tooltip')}
							position="top"
						>
							<ActionIcon
								className={classes.button}
								variant="outline"
								component={Link}
								href={`/create/cycle?cycleId=${cycle.data.id}`}
							>
								<IconPencil size={16} />
							</ActionIcon>
						</Tooltip>
					)}
					<Tooltip
						label={t('dashboard.admin.cycles.details.actions.members.tooltip')}
						position="top"
					>
						<ActionIcon
							className={classes.button}
							variant="outline"
							onClick={() => openDrawer('members')}
						>
							<IconUsers size={16} />
						</ActionIcon>
					</Tooltip>
					<Tooltip
						label={t('dashboard.admin.cycles.details.actions.comments.tooltip')}
						position="top"
					>
						<ActionIcon
							className={classes.button}
							variant="outline"
							onClick={() => openDrawer('comments')}
						>
							<IconMessage size={16} />
						</ActionIcon>
					</Tooltip>
					<Tooltip
						label={t('dashboard.admin.cycles.details.actions.updates.tooltip')}
						position="top"
					>
						<ActionIcon
							className={classes.button}
							variant="outline"
							onClick={() => openDrawer('updates')}
						>
							<IconBell size={16} />
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
