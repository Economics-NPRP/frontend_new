'use client';

import { DateTime, Interval } from 'luxon';
import { useTranslations } from 'next-intl';
import { useContext, useMemo, useState } from 'react';

import { StatCard } from '@/components/StatCard';
import { AllSubsectorsBySectorContext } from '@/contexts';
import { BarChart } from '@mantine/charts';
import { Container, Group, Select, Stack, Text, Title, useMantineColorScheme } from '@mantine/core';
import { MonthPickerInput } from '@mantine/dates';
import { IconCalendar, IconChartPie } from '@tabler/icons-react';

import classes from './styles.module.css';

const MAX_SUBSECTORS = 5;

export default function TimeSeries() {
	const t = useTranslations();
	const { colorScheme } = useMantineColorScheme();
	const allSubsectors = useContext(AllSubsectorsBySectorContext);

	const [selectedPeriod, setSelectedPeriod] = useState<[Date | null, Date | null]>([
		DateTime.now().startOf('year').toJSDate(),
		DateTime.now().endOf('year').toJSDate(),
	]);
	const [selectedSubsector, setSelectedSubsector] = useState<string | null>(null);

	const chartData = useMemo(() => {
		if (!allSubsectors.isSuccess) return [];
		if (!selectedPeriod[0] || !selectedPeriod[1]) return [];

		const interval = Interval.fromDateTimes(selectedPeriod[0], selectedPeriod[1]);
		return interval.splitBy({ month: 1 }).map((month) => ({
			month: month.start!.toLocaleString({ month: 'short', year: '2-digit' }),
			...Object.fromEntries(
				allSubsectors.data.results.map((sector, index) => [
					allSubsectors.data.resultCount > MAX_SUBSECTORS + 1 && index === MAX_SUBSECTORS
						? t('constants.others')
						: sector.title,
					Math.random() * 1000,
				]),
			),
		}));
	}, [t, selectedPeriod, allSubsectors.data.results]);

	const chartSeries = useMemo(() => {
		if (!allSubsectors.isSuccess) return [];

		return allSubsectors.data.results.slice(0, MAX_SUBSECTORS + 1).map((sector, index) => ({
			name:
				allSubsectors.data.resultCount > MAX_SUBSECTORS + 1 && index === MAX_SUBSECTORS
					? t('constants.others')
					: sector.title,
			color: colorScheme === 'light' ? `dark.${5 - index}` : `dark.${index}`,
		}));
	}, [t, colorScheme, allSubsectors.data.results]);

	return (
		<Stack className={classes.root}>
			<Group className={classes.header}>
				<Stack className={classes.label}>
					<Title order={2} className={classes.title}>
						{t('dashboard.admin.cycles.sectors.details.timeSeries.title')}
					</Title>
					<Text className={classes.subtitle}>
						{t('dashboard.admin.cycles.sectors.details.timeSeries.subtitle')}
					</Text>
				</Stack>
				<Group className={classes.filters}>
					<Text className={classes.label}>
						{t('dashboard.admin.cycles.sectors.details.timeSeries.filters.date.label')}
					</Text>
					<MonthPickerInput
						className={classes.calendar}
						w={200}
						type="range"
						valueFormat="YYYY MMM"
						placeholder={t(
							'dashboard.admin.cycles.sectors.details.timeSeries.filters.date.placeholder',
						)}
						value={selectedPeriod}
						onChange={(value) => setSelectedPeriod(value)}
						leftSection={<IconCalendar size={16} />}
					/>
					<Text className={classes.label}>
						{t(
							'dashboard.admin.cycles.sectors.details.timeSeries.filters.subsector.label',
						)}
					</Text>
					<Select
						className={classes.dropdown}
						w={200}
						placeholder={t(
							'dashboard.admin.cycles.sectors.details.timeSeries.filters.subsector.placeholder',
						)}
						value={selectedSubsector}
						onChange={(value) => setSelectedSubsector(value)}
						data={allSubsectors.data.results.map((sector) => ({
							value: sector.id,
							label: sector.title,
						}))}
						leftSection={<IconChartPie size={16} />}
						clearable
					/>
				</Group>
			</Group>
			<Container className={classes.stats}>
				<StatCard
					className={classes.stat}
					title={t('dashboard.admin.cycles.sectors.details.timeSeries.total.title')}
					tooltip={t('dashboard.admin.cycles.sectors.details.timeSeries.total.tooltip')}
					type="double"
					unit={t('constants.emissions.unit')}
					value={Math.random() * 1000}
					diff={Math.random() * 20 - 10}
				/>
				<StatCard
					className={classes.stat}
					title={t('dashboard.admin.cycles.sectors.details.timeSeries.avg.title')}
					tooltip={t('dashboard.admin.cycles.sectors.details.timeSeries.avg.tooltip')}
					type="double"
					unit={t('constants.emissions.unit')}
					value={Math.random() * 1000}
					diff={Math.random() * 20 - 10}
				/>
				<StatCard
					className={classes.stat}
					title={t('dashboard.admin.cycles.sectors.details.timeSeries.forecasted.title')}
					tooltip={t(
						'dashboard.admin.cycles.sectors.details.timeSeries.forecasted.tooltip',
					)}
					type="double"
					unit={t('constants.emissions.unit')}
					value={Math.random() * 1000}
					diff={Math.random() * 20 - 10}
				/>
				<StatCard
					className={classes.stat}
					title={t('dashboard.admin.cycles.sectors.details.timeSeries.current.title')}
					tooltip={t('dashboard.admin.cycles.sectors.details.timeSeries.current.tooltip')}
					type="double"
					unit={t('constants.emissions.unit')}
					value={Math.random() * 1000}
					diff={Math.random() * 20 - 10}
				/>
			</Container>
			<Container className={`${classes.chart} bg-stagger-sm`}>
				<Container className={classes.gradient} />
				<BarChart
					classNames={{ legend: classes.legend, referenceLine: classes.forecast }}
					h={480}
					data={chartData}
					type="stacked"
					dataKey="month"
					gridAxis="xy"
					barProps={{ maxBarSize: 56 }}
					valueFormatter={(value) =>
						t('constants.quantities.emissions.default', { value })
					}
					referenceLines={[
						{
							y: Math.random() * 1000,
							strokeWidth: 3,
							color: 'blue.6',
							label: t(
								'dashboard.admin.cycles.sectors.details.timeSeries.forecasted.line',
							),
							labelPosition: 'insideBottomRight',
						},
					]}
					series={chartSeries}
					legendProps={{ verticalAlign: 'bottom', align: 'center' }}
					withLegend
				/>
			</Container>
		</Stack>
	);
}
