'use client';

import { sortBy } from 'lodash-es';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useFormatter, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { BaseBadge } from '@/components/Badge';
import { PieChart } from '@/components/Charts/Pie';
import { SectorVariants } from '@/constants/SectorData';
import { SectorType } from '@/schema/models';
import {
	Anchor,
	Container,
	FloatingIndicator,
	Group,
	Select,
	Stack,
	Tabs,
	Text,
	Title,
} from '@mantine/core';

import classes from './styles.module.css';

interface TableData {
	id: string;
	title: string;
	permits: number;
	emissions: number;
	auctions: number;
}

export default function Distribution() {
	const t = useTranslations();
	const format = useFormatter();

	const [type, setType] = useState<'permits' | 'emissions' | 'auctions'>('permits');
	const [period, setPeriod] = useState<'month' | 'quarter' | 'year' | 'all'>('year');
	const [sortStatus, setSortStatus] = useState<DataTableSortStatus<TableData>>({
		columnAccessor: 'permits',
		direction: 'desc',
	});

	const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
	const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLButtonElement | null>>({});
	const setControlRef = (val: string) => (node: HTMLButtonElement) => {
		controlsRefs[val] = node;
		setControlsRefs(controlsRefs);
	};

	const rawData = useMemo<Array<TableData>>(() => {
		return [
			{
				id: 'energy',
				title: t('constants.sector.energy.title'),
				permits: Math.round(Math.random() * 100000),
				emissions: Math.round(Math.random() * 100000),
				auctions: Math.round(Math.random() * 1000),
			},
			{
				id: 'industry',
				title: t('constants.sector.industry.title'),
				permits: Math.round(Math.random() * 100000),
				emissions: Math.round(Math.random() * 100000),
				auctions: Math.round(Math.random() * 1000),
			},
			{
				id: 'transport',
				title: t('constants.sector.transport.title'),
				permits: Math.round(Math.random() * 100000),
				emissions: Math.round(Math.random() * 100000),
				auctions: Math.round(Math.random() * 1000),
			},
			{
				id: 'buildings',
				title: t('constants.sector.buildings.title'),
				permits: Math.round(Math.random() * 100000),
				emissions: Math.round(Math.random() * 100000),
				auctions: Math.round(Math.random() * 1000),
			},
			{
				id: 'waste',
				title: t('constants.sector.waste.title'),
				permits: Math.round(Math.random() * 100000),
				emissions: Math.round(Math.random() * 100000),
				auctions: Math.round(Math.random() * 1000),
			},
			{
				id: 'agriculture',
				title: t('constants.sector.agriculture.title'),
				permits: Math.round(Math.random() * 100000),
				emissions: Math.round(Math.random() * 100000),
				auctions: Math.round(Math.random() * 1000),
			},
		] as Array<TableData>;
	}, [t]);

	const tableData = useMemo<Array<TableData>>(() => {
		const data = sortBy(rawData, sortStatus.columnAccessor);
		return sortStatus.direction === 'desc' ? data.reverse() : data;
	}, [rawData, sortStatus]);

	const tableTotals = useMemo(
		() => ({
			permits: rawData.reduce((acc, item) => acc + item.permits, 0),
			emissions: rawData.reduce((acc, item) => acc + item.emissions, 0),
			auctions: rawData.reduce((acc, item) => acc + item.auctions, 0),
		}),
		[rawData],
	);

	const chartData = useMemo(
		() =>
			rawData.map((item) => ({
				name: item.title,
				value: item[type],
				color: SectorVariants[item.id as SectorType]!.color.hex!,
				icon: SectorVariants[item.id as SectorType]!.Icon,
			})),
		[rawData, type],
	);

	return (
		<Stack className={classes.root}>
			<Group className={classes.header}>
				<Stack className={classes.label}>
					<Title order={2} className={classes.title}>
						{t('dashboard.admin.cycles.sectors.details.distribution.title')}
					</Title>
					<Text className={classes.subtitle}>
						{t('dashboard.admin.cycles.sectors.details.distribution.subtitle')}
					</Text>
				</Stack>
				<Select
					className={classes.dropdown}
					w={120}
					value={period}
					onChange={(value) => setPeriod(value as 'month' | 'quarter' | 'year' | 'all')}
					data={[
						{
							value: 'month',
							label: t(
								'dashboard.admin.cycles.sectors.details.distribution.period.month',
							),
						},
						{
							value: 'quarter',
							label: t(
								'dashboard.admin.cycles.sectors.details.distribution.period.quarter',
							),
						},
						{
							value: 'year',
							label: t(
								'dashboard.admin.cycles.sectors.details.distribution.period.year',
							),
						},
						{
							value: 'all',
							label: t(
								'dashboard.admin.cycles.sectors.details.distribution.period.all',
							),
						},
					]}
					allowDeselect={false}
				/>
			</Group>
			<Tabs
				classNames={{ root: classes.tabs, list: classes.list, tab: classes.tab }}
				variant="none"
				value={type}
				onChange={(value) => setType(value as 'permits' | 'emissions' | 'auctions')}
			>
				<Tabs.List ref={setRootRef} grow>
					<Tabs.Tab ref={setControlRef('permits')} value="permits">
						{t('constants.permits.key')}
					</Tabs.Tab>
					<Tabs.Tab ref={setControlRef('emissions')} value="emissions">
						{t('constants.emissions.key')}
					</Tabs.Tab>
					<Tabs.Tab ref={setControlRef('auctions')} value="auctions">
						{t('constants.auctions.key')}
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
						title: t(
							'dashboard.admin.cycles.sectors.details.distribution.columns.subsector',
						),
						width: 160,
						ellipsis: true,
						render: (record) => {
							return (
								<Group className={classes.cell}>
									<Anchor
										component={Link}
										className={classes.name}
										href={`/dashboard/a/cycles/sectors/${record.id}`}
									>
										{record.title}
									</Anchor>
								</Group>
							);
						},
					},
					{
						accessor: 'permits',
						sortable: true,
						title: t(
							'dashboard.admin.cycles.sectors.details.distribution.columns.permits',
						),
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
					{
						accessor: 'emissions',
						sortable: true,
						title: t(
							'dashboard.admin.cycles.sectors.details.distribution.columns.emissions',
						),
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
						accessor: 'auctions',
						sortable: true,
						title: t(
							'dashboard.admin.cycles.sectors.details.distribution.columns.auctions',
						),
						render: (record) => (
							<Group className={classes.cell}>
								<Text className={classes.value}>
									{format.number(record.auctions)}
								</Text>
								<BaseBadge className={classes.badge} variant="light">
									{t('constants.quantities.percent.integer', {
										value: Math.round(
											(record.auctions / tableTotals.auctions) * 100,
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
