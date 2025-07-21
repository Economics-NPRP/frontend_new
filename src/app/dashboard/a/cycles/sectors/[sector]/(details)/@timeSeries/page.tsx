'use client';

import { DateTime, Interval } from 'luxon';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useContext, useMemo, useState } from 'react';

import { StatCard } from '@/components/StatCard';
import { SectorVariants } from '@/constants/SectorData';
import { AllSubsectorsBySectorContext } from '@/contexts';
import { SectorType } from '@/schema/models';
import { BarChart, BarChartSeries } from '@mantine/charts';
import {
	Container,
	Group,
	Select,
	Stack,
	Text,
	Title,
	useMantineColorScheme,
	useMatches,
} from '@mantine/core';
import { MonthPickerInput } from '@mantine/dates';
import { IconCalendar, IconChartPie } from '@tabler/icons-react';

import classes from './styles.module.css';

const MAX_SUBSECTORS = 4;

export default function TimeSeries() {
	const t = useTranslations();
	const numCalendarColumns = useMatches({ base: 1, md: 2, lg: 3 });
	const { sector } = useParams();
	const { colorScheme } = useMantineColorScheme();
	const allSubsectors = useContext(AllSubsectorsBySectorContext);

	const [selectedPeriod, setSelectedPeriod] = useState<[DateTime | null, DateTime | null]>([
		DateTime.now().startOf('year'),
		DateTime.now().endOf('year'),
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

	const chartSeries = useMemo<Array<BarChartSeries>>(() => {
		if (!allSubsectors.isSuccess) return [];

		return allSubsectors.data.results.slice(0, MAX_SUBSECTORS + 1).map((subsector, index) => ({
			name:
				allSubsectors.data.resultCount > MAX_SUBSECTORS + 1 && index === MAX_SUBSECTORS
					? t('constants.others')
					: subsector.title,
			color: colorScheme === 'light' ? `url(#dark-${5 - index})` : `url(#dark-${index + 1})`,
			index,
		}));
	}, [t, colorScheme, sector, allSubsectors.data.results]);

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
						numberOfColumns={numCalendarColumns}
						type="range"
						valueFormat="YYYY MMM"
						placeholder={t(
							'dashboard.admin.cycles.sectors.details.timeSeries.filters.date.placeholder',
						)}
						value={
							selectedPeriod.map((date) => (date ? date.toISO() : null)) as [
								string,
								string,
							]
						}
						onChange={(value) =>
							setSelectedPeriod([
								value[0] ? DateTime.fromISO(value[0]).startOf('month') : null,
								value[1] ? DateTime.fromISO(value[1]).endOf('month') : null,
							])
						}
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
			<Container className={`${classes.chart} bg-dot-sm`}>
				<Container className={classes.gradient} />
				<BarChart
					classNames={{ legend: classes.legend, referenceLine: classes.forecast }}
					h={480}
					data={chartData}
					type="stacked"
					dataKey="month"
					gridAxis="xy"
					barProps={(series) => ({
						maxBarSize: 48,
						legendType: 'square',
						stroke: `var(--mantine-color-${SectorVariants[sector as SectorType]?.color.token}-6)`,
						strokeWidth: 1,
						strokeDasharray: '4 4',
						//	@ts-expect-error - index is a custom property
						strokeOpacity: (chartSeries.length - series.index + 1) / chartSeries.length,
					})}
					valueFormatter={(value) =>
						t('constants.quantities.emissions.default', { value })
					}
					// referenceLines={[
					// 	{
					// 		y: Math.random() * 1000,
					// 		strokeWidth: 3,
					// 		color: 'blue.6',
					// 		label: t(
					// 			'dashboard.admin.cycles.sectors.details.timeSeries.forecasted.line',
					// 		),
					// 		labelPosition: 'insideBottomRight',
					// 	},
					// ]}
					series={chartSeries}
					legendProps={{ verticalAlign: 'bottom', align: 'center' }}
					withLegend
				>
					<defs>
						{/* <pattern
							id="dark-0"
							patternUnits="userSpaceOnUse"
							width={16}
							height={16}
							patternTransform="rotate(45)"
						>
							<rect
								width="5"
								height="16"
								transform="translate(0,0)"
								fill={`var(--mantine-color-${SectorVariants[sector as SectorType]?.color.token}-6)`}
								opacity={0.15}
							/>
							<rect
								width="11"
								height="16"
								transform="translate(5,0)"
								fill={`var(--mantine-color-${SectorVariants[sector as SectorType]?.color.token}-6)`}
								opacity={0.05}
							/>
						</pattern> */}
						<pattern
							id="dark-1"
							patternUnits="userSpaceOnUse"
							width={16}
							height={16}
							patternTransform="rotate(-45)"
						>
							<rect
								width="6"
								height="16"
								transform="translate(0,0)"
								fill={`var(--mantine-color-${SectorVariants[sector as SectorType]?.color.token}-6)`}
								opacity={0.2}
							/>
							<rect
								width="10"
								height="16"
								transform="translate(6,0)"
								fill={`var(--mantine-color-${SectorVariants[sector as SectorType]?.color.token}-6)`}
								opacity={0.1}
							/>
						</pattern>
						<pattern
							id="dark-2"
							patternUnits="userSpaceOnUse"
							width={16}
							height={16}
							patternTransform="rotate(45)"
						>
							<rect
								width="7"
								height="16"
								transform="translate(0,0)"
								fill={`var(--mantine-color-${SectorVariants[sector as SectorType]?.color.token}-6)`}
								opacity={0.4}
							/>
							<rect
								width="9"
								height="16"
								transform="translate(7,0)"
								fill={`var(--mantine-color-${SectorVariants[sector as SectorType]?.color.token}-6)`}
								opacity={0.3}
							/>
						</pattern>
						<pattern
							id="dark-3"
							patternUnits="userSpaceOnUse"
							width={16}
							height={16}
							patternTransform="rotate(-45)"
						>
							<rect
								width="8"
								height="16"
								transform="translate(0,0)"
								fill={`var(--mantine-color-${SectorVariants[sector as SectorType]?.color.token}-6)`}
								opacity={0.6}
							/>
							<rect
								width="8"
								height="16"
								transform="translate(8,0)"
								fill={`var(--mantine-color-${SectorVariants[sector as SectorType]?.color.token}-6)`}
								opacity={0.5}
							/>
						</pattern>
						<pattern
							id="dark-4"
							patternUnits="userSpaceOnUse"
							width={16}
							height={16}
							patternTransform="rotate(45)"
						>
							<rect
								width="9"
								height="16"
								transform="translate(0,0)"
								fill={`var(--mantine-color-${SectorVariants[sector as SectorType]?.color.token}-6)`}
								opacity={0.8}
							/>
							<rect
								width="7"
								height="16"
								transform="translate(9,0)"
								fill={`var(--mantine-color-${SectorVariants[sector as SectorType]?.color.token}-6)`}
								opacity={0.7}
							/>
						</pattern>
						<pattern
							id="dark-5"
							patternUnits="userSpaceOnUse"
							width={16}
							height={16}
							patternTransform="rotate(-45)"
						>
							<rect
								width="10"
								height="16"
								transform="translate(0,0)"
								fill={`var(--mantine-color-${SectorVariants[sector as SectorType]?.color.token}-6)`}
								opacity={1}
							/>
							<rect
								width="6"
								height="16"
								transform="translate(10,0)"
								fill={`var(--mantine-color-${SectorVariants[sector as SectorType]?.color.token}-6)`}
								opacity={0.9}
							/>
						</pattern>
					</defs>
				</BarChart>
			</Container>
		</Stack>
	);
}
