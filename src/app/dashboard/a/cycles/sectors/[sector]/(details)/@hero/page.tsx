'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

import { ActionBanner } from '@/components/ActionBanner';
import { SectorVariants } from '@/constants/SectorData';
import { DashboardHero } from '@/pages/dashboard/_components/DashboardHero';
import { SectorType } from '@/schema/models';
import { Container } from '@mantine/core';
import { IconCirclePlus } from '@tabler/icons-react';

import classes from './styles.module.css';

export default function Hero() {
	const t = useTranslations();
	const { sector } = useParams();

	const sectorData = useMemo(() => SectorVariants[sector as SectorType], [sector]);

	return (
		<>
			<Container className={classes.image}>
				<Image
					src={sectorData ? sectorData.image : ''}
					alt={t(`constants.sector.${sector as SectorType}.alt`)}
					fill
				/>
				<Container className={classes.overlay} />
			</Container>
			<DashboardHero
				className={classes.hero}
				icon={sectorData && <sectorData.Icon size={24} />}
				title={t(`constants.sector.${sector as SectorType}.title`)}
				description={t(`constants.sector.${sector as SectorType}.description.register`)}
				returnButton={{
					href: '/dashboard/a/cycles/sectors',
					label: t('constants.return.sectorsList.label'),
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
				]}
			/>
			<ActionBanner
				className={classes.banner}
				icon={<IconCirclePlus size={32} />}
				heading={t('dashboard.admin.cycles.sectors.details.actions.create.heading')}
				subheading={t('dashboard.admin.cycles.sectors.details.actions.create.subheading')}
				component={Link}
				href={`/create/subsector?sector=${sector}`}
				index={1}
			/>
		</>
	);
}
