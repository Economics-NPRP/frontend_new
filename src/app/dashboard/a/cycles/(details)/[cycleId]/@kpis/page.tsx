import { useTranslations } from 'next-intl';

import { KpiCard } from '@/components/KpiCard';
import { StatCard } from '@/components/StatCard';
import { Container, Group, Select, Stack, Text, Title } from '@mantine/core';
import { IconGavel } from '@tabler/icons-react';

import classes from './styles.module.css';

export default function KPIs() {
	const t = useTranslations();

	return (
		<Stack className={classes.root}>
			<Group className={classes.header}>
				<Stack className={classes.label}>
					<Title order={3} className={classes.title}>
						Cycle KPIs
					</Title>
					<Text className={classes.subtitle}>
						Track the progress and measure the success of this cycle with key
						performance indicators.
					</Text>
				</Stack>
				<Select
					className={classes.dropdown}
					data={[
						{
							value: 'all',
							label: 'All Sectors',
						},
						{
							value: 'energy',
							label: t('constants.auctionCategory.energy.title'),
						},
						{
							value: 'industry',
							label: t('constants.auctionCategory.industry.title'),
						},
						{
							value: 'transport',
							label: t('constants.auctionCategory.transport.title'),
						},
						{
							value: 'buildings',
							label: t('constants.auctionCategory.buildings.title'),
						},
						{
							value: 'agriculture',
							label: t('constants.auctionCategory.agriculture.title'),
						},
						{
							value: 'waste',
							label: t('constants.auctionCategory.waste.title'),
						},
					]}
					allowDeselect={false}
				/>
			</Group>
			<Container className={classes.content}>
				<StatCard
					className={classes.stat}
					icon={<IconGavel size={80} />}
					title={t('create.cycle.third.permitDistribution.totalAuctions.label')}
					tooltip={t('create.cycle.third.permitDistribution.totalAuctions.tooltip')}
					type="integer"
					unit={t('constants.auctions.key')}
					value={Math.random() * 1000}
					diff={Math.random() * 20 - 10}
				/>
				<KpiCard
					title={t('create.cycle.third.permitDistribution.totalAuctions.label')}
					current={Math.random() * 1000}
					target={Math.random() * 1000}
					targetType="exceeds"
					valueType="integer"
					unit="auctions"
				/>
			</Container>
		</Stack>
	);
}
