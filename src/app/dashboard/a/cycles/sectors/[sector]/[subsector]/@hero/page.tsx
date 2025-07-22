'use client';

import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useContext } from 'react';

import { BaseBadge } from '@/components/Badge';
import { Id } from '@/components/Id';
import { SingleSubsectorContext } from '@/contexts';
import { DashboardHero } from '@/pages/dashboard/_components/DashboardHero';
import { SectorType } from '@/schema/models';
import { ActionIcon, Container, Tooltip } from '@mantine/core';
import { IconPencil } from '@tabler/icons-react';

import classes from './styles.module.css';

export default function Hero() {
	const t = useTranslations();
	const { sector } = useParams();
	const singleSubsector = useContext(SingleSubsectorContext);

	return (
		<>
			<Container className={classes.image}>
				<Image src={singleSubsector.data.image} alt={singleSubsector.data.alt} fill />
				<Container className={classes.overlay} />
			</Container>
			<DashboardHero
				className={classes.hero}
				title={singleSubsector.data.title}
				description={singleSubsector.data.description}
				meta={<Id value={singleSubsector.data.id} variant={sector as SectorType} />}
				badges={
					<BaseBadge
						variant="light"
						className={`${classes.basic} ${classes.badge}`}
						loading={singleSubsector.isLoading}
					>
						{t('constants.lastUpdated', {
							value: DateTime.fromISO(singleSubsector.data.updatedAt).toRelative(),
						})}
					</BaseBadge>
				}
				actions={
					<Tooltip
						label={t('dashboard.admin.cycles.details.actions.edit.tooltip')}
						position="top"
					>
						<ActionIcon
							className={classes.button}
							variant="outline"
							component={Link}
							href={`/create/subsector?sector=${sector}&subsector=${singleSubsector.data.id}`}
						>
							<IconPencil size={16} />
						</ActionIcon>
					</Tooltip>
				}
				returnButton={{
					href: `/dashboard/a/cycles/sectors/${sector}`,
					label: t('constants.return.sectorDetails.label'),
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
						label: t('constants.pages.dashboard.admin.cycles.sectors.title'),
						href: '/dashboard/a/cycles/sectors',
					},
					{
						label: t(`constants.sector.${sector as SectorType}.title`),
						href: `/dashboard/a/cycles/sectors/${sector}`,
					},
					{
						label: singleSubsector.data.title,
						href: `/dashboard/a/cycles/sectors/${sector}/${singleSubsector.data.id}`,
					},
				]}
			/>
		</>
	);
}
