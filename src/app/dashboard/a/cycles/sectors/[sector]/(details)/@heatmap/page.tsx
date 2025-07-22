'use client';

import { AllSubsectorsBySectorContext } from 'contexts/AllSubsectorsBySector';
import { DateTime, Interval } from 'luxon';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useContext, useMemo, useState } from 'react';

import { StatCard } from '@/components/StatCard';
import { DATE_PICKER_FORMAT_STRING } from '@/pages/create/_components/DateTimePicker';
import { SectorDetailsPageContext } from '@/pages/dashboard/a/cycles/sectors/[sector]/(details)/_components/Providers';
import { Heatmap as MantineHeatmap } from '@mantine/charts';
import {
	Container,
	Divider,
	FloatingIndicator,
	Group,
	Select,
	Stack,
	Tabs,
	Text,
	Title,
	useMatches,
} from '@mantine/core';
import { YearPickerInput } from '@mantine/dates';
import { IconCalendar, IconChartPie } from '@tabler/icons-react';

import classes from './styles.module.css';

export default function Heatmap() {
	const t = useTranslations();
	const allSubsectors = useContext(AllSubsectorsBySectorContext);
	const { sector } = useParams();

	const { selectedPeriod, setSelectedPeriod, selectedSubsector, setSelectedSubsector } =
		useContext(SectorDetailsPageContext);

	const dividerOrientation = useMatches<'horizontal' | 'vertical'>({
		base: 'horizontal',
		xl: 'vertical',
	});
	const rectSize = useMatches<number>({
		base: 8,
		xs: 12,
		md: 10,
		lg: 12,
		xl: 14,
	});
	const rectGap = useMatches<number>({
		base: 2,
		xl: 4,
	});

	const [type, setType] = useState<'auctions' | 'bids' | 'permits'>('auctions');

	const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
	const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLButtonElement | null>>({});
	const setControlRef = (val: string) => (node: HTMLButtonElement) => {
		controlsRefs[val] = node;
		setControlsRefs(controlsRefs);
	};

	const chartData = useMemo(() => {
		const startDate = selectedPeriod || DateTime.now().startOf('year');
		const endDate = DateTime.now().endOf('day');
		const days = Interval.fromDateTimes(startDate, endDate).splitBy({ day: 1 });

		return days.reduce(
			(acc, day) => {
				const key = day.start!.toFormat('yyyy-MM-dd');
				acc[key] = Math.round(Math.random() * 1000);
				return acc;
			},
			{} as Record<string, number>,
		);
	}, [selectedPeriod, type]);

	return (
		<Stack className={`${classes.root} ${classes[sector as string]}`}>
			<Group className={classes.header}>
				<Stack className={classes.label}>
					<Title order={2} className={classes.title}>
						{t('dashboard.admin.cycles.sectors.details.heatmap.title')}
					</Title>
					<Text className={classes.subtitle}>
						{t('dashboard.admin.cycles.sectors.details.heatmap.subtitle')}
					</Text>
				</Stack>
				<Group className={classes.filters}>
					<Text className={classes.label}>
						{t('dashboard.admin.cycles.sectors.details.heatmap.filters.date.label')}
					</Text>
					<YearPickerInput
						className={classes.calendar}
						w={80}
						placeholder={t(
							'dashboard.admin.cycles.sectors.details.heatmap.filters.date.placeholder',
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
					<Text className={classes.label}>
						{t(
							'dashboard.admin.cycles.sectors.details.heatmap.filters.subsector.label',
						)}
					</Text>
					<Select
						className={classes.dropdown}
						w={200}
						placeholder={t(
							'dashboard.admin.cycles.sectors.details.heatmap.filters.subsector.placeholder',
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
			<Tabs
				classNames={{ root: classes.tabs, list: classes.list, tab: classes.tab }}
				variant="none"
				value={type}
				onChange={(value) => setType(value as 'auctions' | 'bids' | 'permits')}
			>
				<Tabs.List ref={setRootRef} grow>
					<Tabs.Tab ref={setControlRef('auctions')} value="auctions">
						{t('constants.auctions.key')}
					</Tabs.Tab>
					<Tabs.Tab ref={setControlRef('bids')} value="bids">
						{t('constants.bids.key')}
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
			<Container className={classes.stats}>
				<StatCard
					className={classes.stat}
					title={t('dashboard.admin.cycles.sectors.details.heatmap.total.title')}
					tooltip={t('dashboard.admin.cycles.sectors.details.heatmap.total.tooltip', {
						type,
					})}
					type="integer"
					unit={t(`constants.${type}.unitShort`)}
					value={Math.random() * 10000}
					diff={Math.random() * 20 - 10}
					comparison="year"
				/>
				<Divider className={classes.divider} orientation={dividerOrientation} />
				<StatCard
					className={classes.stat}
					title={t('dashboard.admin.cycles.sectors.details.heatmap.avg.title')}
					tooltip={t('dashboard.admin.cycles.sectors.details.heatmap.avg.tooltip', {
						type,
					})}
					type="double"
					unit={t(`constants.${type}.unitShort`)}
					value={Math.random() * 1000}
					diff={Math.random() * 20 - 10}
					comparison="month"
				/>
				<Divider className={classes.divider} orientation={dividerOrientation} />
				<StatCard
					className={classes.stat}
					title={t('dashboard.admin.cycles.sectors.details.heatmap.current.title')}
					tooltip={t('dashboard.admin.cycles.sectors.details.heatmap.current.tooltip', {
						type,
					})}
					type="integer"
					unit={t(`constants.${type}.unitShort`)}
					value={Math.random() * 1000}
					diff={Math.random() * 20 - 10}
					comparison="month"
				/>
			</Container>
			<Container className={classes.wrapper}>
				<MantineHeatmap
					className={classes.heatmap}
					data={chartData}
					startDate={selectedPeriod
						.startOf('year')
						.plus({ day: 1 })
						.toFormat(DATE_PICKER_FORMAT_STRING)}
					endDate={selectedPeriod
						.endOf('year')
						.plus({ day: 1 })
						.toFormat(DATE_PICKER_FORMAT_STRING)}
					rectRadius={0}
					rectSize={rectSize}
					gap={rectGap}
					firstDayOfWeek={0}
					getTooltipLabel={({ date, value }) =>
						t(`dashboard.admin.cycles.sectors.details.heatmap.chart.tooltip`, {
							value: t(`constants.quantities.${type}.default`, { value }),
							date: DateTime.fromISO(date).toLocaleString({
								weekday: 'long',
								month: 'long',
								day: '2-digit',
								year: 'numeric',
							}),
						})
					}
					withOutsideDates={false}
					withMonthLabels
					withWeekdayLabels
					withTooltip
				/>
			</Container>
			<Group className={classes.legend}>
				<Text className={classes.label}>
					{t('dashboard.admin.cycles.sectors.details.heatmap.legend.less')}
				</Text>
				<Group className={classes.list} gap={rectGap}>
					<Container className={classes.item} size={rectSize} />
					<Container className={classes.item} size={rectSize} />
					<Container className={classes.item} size={rectSize} />
					<Container className={classes.item} size={rectSize} />
				</Group>
				<Text className={classes.label}>
					{t('dashboard.admin.cycles.sectors.details.heatmap.legend.more')}
				</Text>
			</Group>
		</Stack>
	);
}
