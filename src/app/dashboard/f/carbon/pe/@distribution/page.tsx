'use client';

import { sortBy } from 'lodash-es';
import { DateTime } from 'luxon';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useFormatter, useTranslations } from 'next-intl';
import { useContext, useMemo, useState } from 'react';

import { BaseBadge } from '@/components/Badge';
import { PieChart } from '@/components/Charts/Pie';
import { StopWords } from '@/constants/StopWords';
import { DATE_PICKER_FORMAT_STRING } from '@/pages/create/_components/DateTimePicker';
import { EmissionsPermitsPageContext } from '@/pages/dashboard/f/carbon/pe/_components/Providers';
import { Container, FloatingIndicator, Group, Stack, Tabs, Text, Title } from '@mantine/core';
import { YearPickerInput } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';

import classes from './styles.module.css';

const scope1 = ['Stationary Combustion', 'Mobile Combustion', 'Fugitive Emissions'];
const scope2 = ['Purchased Electricity', 'Purchased Heat'];
const scope3 = [
	'Purchased Goods and Services',
	'Capital Goods',
	'Fuel and Energy-Related Activities',
	'Upstream Transportation and Distribution',
	'Waste Generated in Operations',
	'Business Travel',
	'Employee Commuting',
	'Upstream Leased Assets',
	'Downstream Transportation and Distribution',
	'Processing of Sold Products',
	'Use of Sold Products',
	'End-of-Life Treatment of Sold Products',
	'Downstream Leased Assets',
	'Franchises',
	'Investments',
];

interface TableData {
	id: string;
	title: string;
	scope: 'scope1' | 'scope2' | 'scope3';
	permits: number;
	emissions: number;
}

export default function Distribution() {
	const t = useTranslations();
	const format = useFormatter();

	const { selectedPeriod, setSelectedPeriod } = useContext(EmissionsPermitsPageContext);

	const [type, setType] = useState<'emissions' | 'permits'>('emissions');
	const [sortStatus, setSortStatus] = useState<DataTableSortStatus<TableData>>({
		columnAccessor: 'emissions',
		direction: 'desc',
	});

	const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
	const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLButtonElement | null>>({});
	const setControlRef = (val: string) => (node: HTMLButtonElement) => {
		controlsRefs[val] = node;
		setControlsRefs(controlsRefs);
	};

	const rawData = useMemo<Record<'scope1' | 'scope2' | 'scope3', Array<TableData>>>(
		() => ({
			scope1: scope1
				.map((scope, index) =>
					Math.random() >= 0.2
						? {
								id: `scope1-${index}`,
								title: scope,
								scope: 'scope1',
								permits: Math.round(Math.random() * 100000),
								emissions: Math.round(Math.random() * 100000),
							}
						: null,
				)
				.filter(Boolean) as Array<TableData>,
			scope2: scope2
				.map((scope, index) =>
					Math.random() >= 0.2
						? {
								id: `scope2-${index}`,
								title: scope,
								scope: 'scope2',
								permits: Math.round(Math.random() * 100000),
								emissions: Math.round(Math.random() * 100000),
							}
						: null,
				)
				.filter(Boolean) as Array<TableData>,
			scope3: scope3
				.map((scope, index) =>
					Math.random() >= 0.8
						? {
								id: `scope3-${index}`,
								title: scope,
								scope: 'scope3',
								permits: Math.round(Math.random() * 100000),
								emissions: Math.round(Math.random() * 100000),
							}
						: null,
				)
				.filter(Boolean) as Array<TableData>,
		}),
		[selectedPeriod],
	);

	const tableData = useMemo<Array<TableData>>(() => {
		const arrayData = Object.values(rawData).reduce((acc, item) => acc.concat(item), []);
		const data = sortBy(arrayData, sortStatus.columnAccessor);
		return sortStatus.direction === 'desc' ? data.reverse() : data;
	}, [rawData, sortStatus]);

	const tableTotals = useMemo(
		() => ({
			permits: Object.values(rawData).reduce(
				(acc, item) => acc + item.reduce((acc, item) => acc + item.permits, 0),
				0,
			),
			emissions: Object.values(rawData).reduce(
				(acc, item) => acc + item.reduce((acc, item) => acc + item.emissions, 0),
				0,
			),
		}),
		[rawData],
	);

	const chartData = useMemo(
		() => [
			...rawData.scope1.map((item, index) => ({
				name: item.title,
				value: item[type],
				color: 'var(--mantine-color-maroon-6)',
				opacity: (rawData.scope1.length - index) / (rawData.scope1.length + 1),
				label: item.title
					.split(' ')
					.filter((word) => !StopWords.has(word))
					.map((word) => word[0].toLocaleUpperCase())
					.filter((word) => /[a-zA-Z]/.test(word))
					.slice(0, 3)
					.join(''),
			})),
			...rawData.scope2.map((item, index) => ({
				name: item.title,
				value: item[type],
				color: 'var(--mantine-color-purple-6)',
				opacity: (rawData.scope2.length - index) / (rawData.scope2.length + 1),
				label: item.title
					.split(' ')
					.filter((word) => !StopWords.has(word))
					.map((word) => word[0].toLocaleUpperCase())
					.filter((word) => /[a-zA-Z]/.test(word))
					.slice(0, 3)
					.join(''),
			})),
			...rawData.scope3.map((item, index) => ({
				name: item.title,
				value: item[type],
				color: 'var(--mantine-color-palm-6)',
				opacity: (rawData.scope3.length - index) / (rawData.scope3.length + 1),
				label: item.title
					.split(' ')
					.filter((word) => !StopWords.has(word))
					.map((word) => word[0].toLocaleUpperCase())
					.filter((word) => /[a-zA-Z]/.test(word))
					.slice(0, 3)
					.join(''),
			})),
		],
		[rawData, type],
	);

	return (
		<Stack className={classes.root}>
			<Group className={classes.header}>
				<Stack className={classes.label}>
					<Title order={2} className={classes.title}>
						{t('dashboard.firm.carbon.pe.distribution.title')}
					</Title>
					<Text className={classes.subtitle}>
						{t('dashboard.firm.carbon.pe.distribution.subtitle')}
					</Text>
				</Stack>
				<Group className={classes.filters}>
					<Text className={classes.label}>
						{t('dashboard.firm.carbon.pe.distribution.filters.date.label')}
					</Text>
					<YearPickerInput
						className={classes.dropdown}
						w={80}
						placeholder={t(
							'dashboard.firm.carbon.pe.distribution.filters.date.placeholder',
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
			<Tabs
				classNames={{ root: classes.tabs, list: classes.list, tab: classes.tab }}
				variant="none"
				value={type}
				onChange={(value) => setType(value as 'emissions' | 'permits')}
			>
				<Tabs.List ref={setRootRef} grow>
					<Tabs.Tab ref={setControlRef('emissions')} value="emissions">
						{t('constants.emissions.key')}
					</Tabs.Tab>
					<Tabs.Tab ref={setControlRef('permits')} value="permits">
						{t('constants.permits.key')}
					</Tabs.Tab>

					<FloatingIndicator
						className={classes.indicator}
						target={type ? controlsRefs[type] : null}
						parent={rootRef}
					/>
				</Tabs.List>
			</Tabs>
			<PieChart className={classes.chart} chartData={chartData} />
			<DataTable
				className={classes.table}
				columns={[
					{
						accessor: 'title',
						sortable: false,
						title: t('dashboard.firm.carbon.pe.distribution.columns.title'),
						width: 200,
						ellipsis: true,
						render: (record) => record.title,
					},
					{
						accessor: 'scope',
						sortable: false,
						title: t('dashboard.firm.carbon.pe.distribution.columns.scope'),
						width: 120,
						ellipsis: true,
						render: (record) => (
							<Group className={classes.cell}>
								<Text className={classes.value}>
									{t(`constants.scope.${record.scope}.label`)}
								</Text>
								<Container
									className={`${classes.scope} ${classes[record.scope]}`}
								/>
							</Group>
						),
					},
					{
						accessor: 'emissions',
						sortable: true,
						title: t('dashboard.firm.carbon.pe.distribution.columns.emissions'),
						width: 200,
						render: (record) => (
							<Group className={classes.cell}>
								<Text className={classes.value}>
									{t('constants.quantities.emissions.default', {
										value: record.emissions,
									})}
								</Text>
								<BaseBadge className={classes.badge} variant="light">
									{t('constants.quantities.percent.integer', {
										value: Math.round(
											(record.emissions / tableTotals.emissions) * 100,
										),
									})}
								</BaseBadge>
							</Group>
						),
					},
					{
						accessor: 'permits',
						sortable: true,
						title: t('dashboard.firm.carbon.pe.distribution.columns.permits'),
						width: 200,
						render: (record) => (
							<Group className={classes.cell}>
								<Text className={classes.value}>
									{format.number(record.permits)}
								</Text>
								<BaseBadge className={classes.badge} variant="light">
									{t('constants.quantities.percent.integer', {
										value: Math.round(
											(record.permits / tableTotals.permits) * 100,
										),
									})}
								</BaseBadge>
							</Group>
						),
					},
				]}
				records={tableData}
				sortStatus={sortStatus}
				onSortStatusChange={setSortStatus}
				pinFirstColumn
				withRowBorders
				withColumnBorders
				highlightOnHover
				idAccessor="id"
			/>
		</Stack>
	);
}
