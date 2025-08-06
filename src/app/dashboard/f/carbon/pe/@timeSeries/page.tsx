'use client';

import { DateTime, Interval } from 'luxon';
import { useFormatter, useTranslations } from 'next-intl';
import { useContext, useMemo } from 'react';

import { BaseBadge } from '@/components/Badge';
import { DATE_PICKER_FORMAT_STRING } from '@/pages/create/_components/DateTimePicker';
import { EmissionsPermitsPageContext } from '@/pages/dashboard/f/carbon/pe/_components/Providers';
import { CompositeChart, CompositeChartSeries } from '@mantine/charts';
import { Container, Group, Stack, Text, Title, useMantineColorScheme } from '@mantine/core';
import { YearPickerInput } from '@mantine/dates';
import { IconAlertTriangle, IconCalendar, IconCheck, IconSlash, IconX } from '@tabler/icons-react';

import classes from './styles.module.css';

export default function TimeSeries() {
	const t = useTranslations();
	const format = useFormatter();
	const { colorScheme } = useMantineColorScheme();

	const { selectedPeriod, setSelectedPeriod } = useContext(EmissionsPermitsPageContext);

	const chartData = useMemo(() => {
		const interval = Interval.fromDateTimes(
			selectedPeriod.startOf('year'),
			selectedPeriod.endOf('year'),
		);

		let reserves = Math.random() * 1000;
		return interval.splitBy({ month: 1 }).map((month, index) => {
			const inflow = month.isBefore(DateTime.now()) ? Math.random() * 1000 : 0;
			const outflow = month.isBefore(DateTime.now()) ? Math.random() * -500 : 0;
			const reported =
				index === 11 && month.isBefore(DateTime.now()) ? Math.random() * -5000 : 0;
			reserves += inflow + outflow + reported;

			return {
				month: month.start!.toLocaleString({ month: 'short', year: '2-digit' }),
				inflow,
				outflow,
				reported,
				reserves: month.isBefore(DateTime.now()) ? reserves : undefined,
			};
		});
	}, [t, selectedPeriod]);

	const chartSeries = useMemo<Array<CompositeChartSeries>>(
		() => [
			{
				name: 'inflow',
				label: t('dashboard.firm.carbon.pe.timeSeries.inflow.label'),
				color: 'url(#positive)',
				type: 'bar',
			},
			{
				name: 'outflow',
				label: t('dashboard.firm.carbon.pe.timeSeries.outflow.label'),
				color: 'url(#negative)',
				type: 'bar',
			},
			{
				name: 'reported',
				label: t('dashboard.firm.carbon.pe.timeSeries.reported.label'),
				color: 'url(#reported)',
				type: 'bar',
			},
			{
				name: 'reserves',
				label: t('dashboard.firm.carbon.pe.timeSeries.reserves.label'),
				color: colorScheme === 'light' ? 'blue.7' : 'blue.9',
				type: 'line',
			},
		],
		[t, colorScheme],
	);

	const complianceBadge = useMemo(() => {
		const x = Math.random();
		if (x <= 0.5)
			return (
				<BaseBadge
					className={classes.badge}
					color={'green'}
					rightSection={<IconCheck size={16} />}
				>
					{t('constants.compliance.compliant.label')}
				</BaseBadge>
			);
		if (x <= 0.75)
			return (
				<BaseBadge
					className={classes.badge}
					color={'yellow'}
					rightSection={<IconAlertTriangle size={14} />}
				>
					{t('constants.compliance.risk.label')}
				</BaseBadge>
			);
		return (
			<BaseBadge className={classes.badge} color={'red'} rightSection={<IconX size={16} />}>
				{t('constants.compliance.deficit.label')}
			</BaseBadge>
		);
	}, [t]);

	return (
		<Stack className={classes.root}>
			<Group className={classes.header}>
				<Stack className={classes.label}>
					<Title order={2} className={classes.title}>
						{t('dashboard.firm.carbon.pe.timeSeries.title')}
					</Title>
					<Text className={classes.subtitle}>
						{t('dashboard.firm.carbon.pe.timeSeries.subtitle')}
					</Text>
					{complianceBadge}
				</Stack>
				<Group className={classes.filters}>
					<Text className={classes.label}>
						{t('dashboard.firm.carbon.pe.timeSeries.filters.date.label')}
					</Text>
					<YearPickerInput
						className={classes.calendar}
						w={80}
						placeholder={t(
							'dashboard.firm.carbon.pe.timeSeries.filters.date.placeholder',
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
			<Group className={classes.compliance}>
				<Stack className={classes.cell}>
					<Text className={classes.label}>
						{t('dashboard.firm.carbon.pe.timeSeries.reserves.label')}
					</Text>
					<Group className={classes.row}>
						<Text className={classes.value}>
							{format.number(Math.random() * 10000, 'money')}
						</Text>
						<Text className={classes.unit}>{t('constants.emissions.unit')}</Text>
					</Group>
				</Stack>
				<IconSlash size={20} className={classes.icon} />
				<Stack className={classes.cell}>
					<Text className={classes.label}>
						{t('dashboard.firm.carbon.pe.timeSeries.forecasted.label')}
					</Text>
					<Group className={classes.row}>
						<Text className={classes.value}>
							{format.number(Math.random() * 20000, 'money')}
						</Text>
						<Text className={classes.unit}>{t('constants.emissions.unit')}</Text>
					</Group>
				</Stack>
			</Group>
			<Container className={`${classes.chart} bg-dot-sm`}>
				<Container className={classes.gradient} />
				<CompositeChart
					classNames={{ legend: classes.legend, referenceLine: classes.forecast }}
					h={480}
					data={chartData}
					dataKey="month"
					gridAxis="xy"
					composedChartProps={{ stackOffset: 'sign' }}
					barProps={(series) => ({
						maxBarSize: 32,
						legendType: 'square',
						stroke: `var(--mantine-color-${series.name === 'inflow' ? 'green' : series.name === 'outflow' ? 'red' : 'red'}-6)`,
						strokeWidth: 1,
						strokeDasharray: '4 4',
						strokeOpacity: 0.8,
						stackId: 'stack',
					})}
					lineProps={{
						strokeDasharray: '8 8',
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
					// 			'dashboard.firm.carbon.pe.timeSeries.forecasted.line',
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
							id="positive"
							patternUnits="userSpaceOnUse"
							width={24}
							height={24}
							patternTransform="rotate(-45)"
						>
							<rect
								width="12"
								height="24"
								transform="translate(0,0)"
								fill="var(--mantine-color-green-6)"
								opacity={colorScheme === 'light' ? 0.7 : 0.6}
							/>
							<rect
								width="12"
								height="24"
								transform="translate(12,0)"
								fill="var(--mantine-color-green-6)"
								opacity={colorScheme === 'light' ? 0.5 : 0.4}
							/>
						</pattern>
						<pattern
							id="negative"
							patternUnits="userSpaceOnUse"
							width={24}
							height={24}
							patternTransform="rotate(45)"
						>
							<rect
								width="12"
								height="24"
								transform="translate(0,0)"
								fill="var(--mantine-color-red-6)"
								opacity={colorScheme === 'light' ? 0.5 : 0.4}
							/>
							<rect
								width="12"
								height="24"
								transform="translate(12,0)"
								fill="var(--mantine-color-red-6)"
								opacity={colorScheme === 'light' ? 0.3 : 0.2}
							/>
						</pattern>
						<pattern
							id="reported"
							patternUnits="userSpaceOnUse"
							width={24}
							height={24}
							patternTransform="rotate(-45)"
						>
							<rect
								width="14"
								height="24"
								transform="translate(0,0)"
								fill="var(--mantine-color-red-6)"
								opacity={colorScheme === 'light' ? 0.8 : 0.7}
							/>
							<rect
								width="14"
								height="24"
								transform="translate(14,0)"
								fill="var(--mantine-color-red-6)"
								opacity={colorScheme === 'light' ? 0.6 : 0.5}
							/>
						</pattern>
					</defs>
				</CompositeChart>
			</Container>
		</Stack>
	);
}
