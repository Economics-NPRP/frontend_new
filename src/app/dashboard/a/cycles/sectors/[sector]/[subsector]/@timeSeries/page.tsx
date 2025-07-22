'use client';

import { DateTime, Interval } from 'luxon';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useContext, useMemo } from 'react';

import { StatCard } from '@/components/StatCard';
import { SectorVariants } from '@/constants/SectorData';
import { SingleSubsectorContext } from '@/contexts';
import { DATE_PICKER_FORMAT_STRING } from '@/pages/create/_components/DateTimePicker';
import { SubsectorDetailsPageContext } from '@/pages/dashboard/a/cycles/sectors/[sector]/[subsector]/_components/Providers';
import { SectorType } from '@/schema/models';
import { BarChart, BarChartSeries } from '@mantine/charts';
import { Container, Group, Stack, Text, Title, useMantineColorScheme } from '@mantine/core';
import { YearPickerInput } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';

import classes from './styles.module.css';

export default function TimeSeries() {
	const t = useTranslations();
	const { sector } = useParams();
	const { colorScheme } = useMantineColorScheme();
	const singleSubsector = useContext(SingleSubsectorContext);

	const { selectedPeriod, setSelectedPeriod } = useContext(SubsectorDetailsPageContext);

	const chartData = useMemo(() => {
		if (!singleSubsector.isSuccess) return [];

		const interval = Interval.fromDateTimes(
			selectedPeriod.startOf('year'),
			selectedPeriod.endOf('year'),
		);
		return interval.splitBy({ month: 1 }).map((month) => ({
			month: month.start!.toLocaleString({ month: 'short', year: '2-digit' }),
			[singleSubsector.data.title]: month.isBefore(DateTime.now()) ? Math.random() * 1000 : 0,
		}));
	}, [t, selectedPeriod, singleSubsector.data]);

	const chartSeries = useMemo<Array<BarChartSeries>>(() => {
		if (!singleSubsector.isSuccess) return [];

		return [
			{
				name: singleSubsector.data.title,
				color: 'url(#dark-5)',
				index: 5,
			},
		];
	}, [t, colorScheme, singleSubsector.data]);

	return (
		<Stack className={classes.root}>
			<Group className={classes.header}>
				<Stack className={classes.label}>
					<Title order={2} className={classes.title}>
						{t('dashboard.admin.cycles.sectors.subsector.details.timeSeries.title')}
					</Title>
					<Text className={classes.subtitle}>
						{t('dashboard.admin.cycles.sectors.subsector.details.timeSeries.subtitle')}
					</Text>
				</Stack>
				<Group className={classes.filters}>
					<Text className={classes.label}>
						{t(
							'dashboard.admin.cycles.sectors.subsector.details.timeSeries.filters.date.label',
						)}
					</Text>
					<YearPickerInput
						className={classes.calendar}
						w={80}
						placeholder={t(
							'dashboard.admin.cycles.sectors.subsector.details.timeSeries.filters.date.placeholder',
						)}
						value={
							selectedPeriod
								? selectedPeriod.toFormat(DATE_PICKER_FORMAT_STRING)
								: null
						}
						onChange={(value) =>
							setSelectedPeriod(
								value ? DateTime.fromISO(value) : DateTime.now().startOf('year'),
							)
						}
						leftSection={<IconCalendar size={16} />}
					/>
				</Group>
			</Group>
			<Container className={classes.stats}>
				<StatCard
					className={classes.stat}
					title={t(
						'dashboard.admin.cycles.sectors.subsector.details.timeSeries.total.title',
					)}
					tooltip={t(
						'dashboard.admin.cycles.sectors.subsector.details.timeSeries.total.tooltip',
					)}
					type="double"
					unit={t('constants.emissions.unit')}
					value={Math.random() * 1000}
					diff={Math.random() * 20 - 10}
				/>
				<StatCard
					className={classes.stat}
					title={t(
						'dashboard.admin.cycles.sectors.subsector.details.timeSeries.avg.title',
					)}
					tooltip={t(
						'dashboard.admin.cycles.sectors.subsector.details.timeSeries.avg.tooltip',
					)}
					type="double"
					unit={t('constants.emissions.unit')}
					value={Math.random() * 1000}
					diff={Math.random() * 20 - 10}
				/>
				<StatCard
					className={classes.stat}
					title={t(
						'dashboard.admin.cycles.sectors.subsector.details.timeSeries.forecasted.title',
					)}
					tooltip={t(
						'dashboard.admin.cycles.sectors.subsector.details.timeSeries.forecasted.tooltip',
					)}
					type="double"
					unit={t('constants.emissions.unit')}
					value={Math.random() * 1000}
					diff={Math.random() * 20 - 10}
				/>
				<StatCard
					className={classes.stat}
					title={t(
						'dashboard.admin.cycles.sectors.subsector.details.timeSeries.current.title',
					)}
					tooltip={t(
						'dashboard.admin.cycles.sectors.subsector.details.timeSeries.current.tooltip',
					)}
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
					barProps={{
						maxBarSize: 48,
						legendType: 'square',
						stroke: `var(--mantine-color-${SectorVariants[sector as SectorType]?.color.token}-6)`,
						strokeWidth: 1,
						strokeDasharray: '4 4',
						strokeOpacity: 1,
					}}
					valueFormatter={(value) =>
						t('constants.quantities.emissions.default', { value })
					}
					// referenceLines={[
					// 	{
					// 		y: Math.random() * 1000,
					// 		strokeWidth: 3,
					// 		color: 'blue.6',
					// 		label: t(
					// 			'dashboard.admin.cycles.sectors.subsector.details.timeSeries.forecasted.line',
					// 		),
					// 		labelPosition: 'insideBottomRight',
					// 	},
					// ]}
					series={chartSeries}
					legendProps={{ verticalAlign: 'bottom', align: 'center' }}
					withLegend
				>
					<defs>
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
