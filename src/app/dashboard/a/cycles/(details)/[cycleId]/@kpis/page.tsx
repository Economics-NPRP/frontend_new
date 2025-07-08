'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { KpiCard } from '@/components/KpiCard';
import { SectorType } from '@/schema/models';
import { Container, Group, Select, Stack, Text, Title } from '@mantine/core';

import classes from './styles.module.css';

export default function KPIs() {
	const t = useTranslations();
	const [sectorFilter, setSectorFilter] = useState<'all' | SectorType>('all');

	return (
		<Stack className={classes.root}>
			<Group className={classes.header}>
				<Stack className={classes.label}>
					<Title order={3} className={classes.title}>
						{t('dashboard.admin.cycles.details.title')}
					</Title>
					<Text className={classes.subtitle}>
						{t('dashboard.admin.cycles.details.subtitle')}
					</Text>
				</Stack>
				<Select
					className={classes.dropdown}
					w={140}
					value={sectorFilter}
					onChange={(value) => setSectorFilter(value as 'all' | SectorType)}
					data={[
						{
							value: 'all',
							label: t('constants.sector.all.title'),
						},
						{
							value: 'energy',
							label: t('constants.sector.energy.title'),
						},
						{
							value: 'industry',
							label: t('constants.sector.industry.title'),
						},
						{
							value: 'transport',
							label: t('constants.sector.transport.title'),
						},
						{
							value: 'buildings',
							label: t('constants.sector.buildings.title'),
						},
						{
							value: 'agriculture',
							label: t('constants.sector.agriculture.title'),
						},
						{
							value: 'waste',
							label: t('constants.sector.waste.title'),
						},
					]}
					allowDeselect={false}
				/>
			</Group>
			<Container className={classes.content}>
				<KpiCard
					title={t('create.cycle.third.permitDistribution.totalAuctions.label')}
					current={Math.random() * 500}
					target={Math.random() * 500}
					targetType="meets"
					valueType="integer"
					sector={sectorFilter}
					unit={t('constants.auctions.unitShort')}
					gradeDeviations={{
						a: 10,
						b: 50,
						c: 80,
						d: 150,
					}}
				/>
				<KpiCard
					title={t('create.cycle.third.permitDistribution.totalPermits.label')}
					current={Math.random() * 100000}
					target={Math.random() * 100000}
					targetType="meets"
					valueType="integer"
					sector={sectorFilter}
					unit={t('constants.permits.unitShort')}
					gradeDeviations={{
						a: 3000,
						b: 10000,
						c: 20000,
						d: 50000,
					}}
				/>
				<KpiCard
					title={t('create.cycle.third.permitDistribution.avgPerAuction.label')}
					current={Math.random() * 1000}
					target={Math.random() * 1000}
					targetType="meets"
					valueType="double"
					sector={sectorFilter}
					unit={t('constants.permits.unitShort')}
					gradeDeviations={{
						a: 50,
						b: 300,
						c: 800,
						d: 1500,
					}}
				/>
				<KpiCard
					title={t('create.cycle.third.permitDistribution.avgFree.label')}
					current={Math.random() * 1000}
					target={Math.random() * 1000}
					targetType="meets"
					valueType="double"
					sector={sectorFilter}
					unit={t('constants.permits.unitShort')}
					gradeDeviations={{
						a: 50,
						b: 300,
						c: 800,
						d: 1500,
					}}
				/>
			</Container>
		</Stack>
	);
}
