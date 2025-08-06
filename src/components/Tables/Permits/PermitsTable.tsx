'use client';

import { DateTime } from 'luxon';
import { DataTable } from 'mantine-datatable';
import { useFormatter, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';

import { BaseBadge, BaseBadgeProps, CurrencyBadge, SectorBadge } from '@/components/Badge';
import { SummaryTableGroup } from '@/components/SummaryTable';
import { TablePagination } from '@/components/Tables/_components/Pagination';
import {
	SelectionSummaryContext,
	SelectionSummaryProvider,
} from '@/components/Tables/_components/SelectionSummary';
import { IPaginatedPermitsContext } from '@/contexts';
import { withProviders } from '@/helpers';
import { ENDING_SOON_THRESHOLD, useOffsetPaginationText } from '@/hooks';
import { IPermitData, PermitExpiryFilter, PermitUsageFilter } from '@/schema/models';
import {
	ActionIcon,
	Alert,
	Anchor,
	Button,
	Divider,
	Group,
	Input,
	Menu,
	Pill,
	Radio,
	Select,
	Stack,
	TableProps,
	Text,
	TextInput,
	Title,
	Tooltip,
} from '@mantine/core';
import { useListState, useMediaQuery } from '@mantine/hooks';
import {
	IconAdjustments,
	IconAlertHexagon,
	IconAlertTriangle,
	IconArrowUpRight,
	IconCheck,
	IconCoins,
	IconDownload,
	IconFilterSearch,
	IconHexagonLetterX,
	IconInfoCircle,
	IconReport,
	IconReportAnalytics,
	IconSearch,
} from '@tabler/icons-react';

import classes from '../styles.module.css';

export interface PermitsTableProps extends TableProps {
	permits: IPaginatedPermitsContext;
}
const _PermitsTable = ({
	permits,

	className,
	...props
}: PermitsTableProps) => {
	const t = useTranslations();
	const format = useFormatter();
	const isMobile = useMediaQuery('(max-width: 48em)');
	const tableContainerRef = useRef<HTMLTableElement>(null);
	const paginationText = useOffsetPaginationText('permits', permits);
	const { open } = useContext(SelectionSummaryContext);

	const [showSelectedOnly, setShowSelectedOnly] = useState(false);
	const [searchFilter, setSearchFilter] = useState('');
	const [selectedPermits, selectedPermitsHandlers] = useListState<IPermitData>([]);

	//	Generate the filter badges
	const filterBadges = useMemo(() => {
		if (!permits) return null;
		const output = [];

		if (showSelectedOnly)
			return (
				<Pill
					className={classes.badge}
					onRemove={() => setShowSelectedOnly(false)}
					withRemoveButton
				>
					{t('components.table.selected.filterSelectedBadge')}
				</Pill>
			);

		switch (permits.usage) {
			case 'high':
				output.push(
					<Pill
						key={'high'}
						className={classes.badge}
						onRemove={() => permits.setUsage('all')}
						withRemoveButton
					>
						{t('components.permitsTable.filters.badges.usage.high')}
					</Pill>,
				);
				break;
			case 'medium':
				output.push(
					<Pill
						key={'ongoing'}
						className={classes.badge}
						onRemove={() => permits.setUsage('all')}
						withRemoveButton
					>
						{t('components.permitsTable.filters.badges.usage.medium')}
					</Pill>,
				);
				break;
			case 'low':
				output.push(
					<Pill
						key={'ended'}
						className={classes.badge}
						onRemove={() => permits.setUsage('all')}
						withRemoveButton
					>
						{t('components.permitsTable.filters.badges.usage.low')}
					</Pill>,
				);
				break;
		}

		switch (permits.expiry) {
			case 'unexpired':
				output.push(
					<Pill
						key={'unexpired'}
						className={classes.badge}
						onRemove={() => permits.setExpiry('all')}
						withRemoveButton
					>
						{t('components.permitsTable.filters.badges.unexpired')}
					</Pill>,
				);
				break;
			case 'expired':
				output.push(
					<Pill
						key={'expired'}
						className={classes.badge}
						onRemove={() => permits.setExpiry('all')}
						withRemoveButton
					>
						{t('components.permitsTable.filters.badges.expired')}
					</Pill>,
				);
				break;
		}

		if (output.length === 0)
			return (
				<Pill className={classes.badge}>
					{t('components.permitsTable.filters.badges.all')}
				</Pill>
			);
		return output;
	}, [permits, permits.usage, permits.expiry, showSelectedOnly, t]);

	const generateSummaryGroups = useMemo(() => () => [], [t, format]);

	//	If we are showing selected only and there are no selected permits, disable the filter
	useEffect(() => {
		if (showSelectedOnly && selectedPermits.length === 0) setShowSelectedOnly(false);
	}, [showSelectedOnly, selectedPermits.length]);

	return (
		<Stack className={`${classes.root} ${className}`}>
			<Stack className={classes.header}>
				<Group className={`${classes.row} ${classes.wrapMobile}`}>
					<Group className={classes.label}>
						<Title order={2} className={classes.title}>
							{t('components.permitsTable.title')}
						</Title>
						<Text className={classes.subtitle}>
							{showSelectedOnly
								? t('components.table.selected.paginationText', {
										value: selectedPermits.length,
									})
								: paginationText}
						</Text>
					</Group>
					<Group className={classes.settings}>
						<Text className={classes.label}>
							{t('constants.pagination.perPage.label')}
						</Text>
						<Select
							className={classes.dropdown}
							w={80}
							value={permits.perPage.toString()}
							data={['10', '20', '50', '100']}
							onChange={(value) => permits.setPerPage(Number(value))}
							allowDeselect={false}
							disabled={showSelectedOnly}
						/>
						<Menu position="bottom-end" disabled={showSelectedOnly}>
							<Menu.Target>
								<ActionIcon className={classes.button} disabled={showSelectedOnly}>
									<IconAdjustments size={16} />
								</ActionIcon>
							</Menu.Target>
							<Menu.Dropdown className={classes.filterMenu}>
								<Menu.Label className={classes.label}>
									{t('components.permitsTable.filters.menu.usage.label')}
								</Menu.Label>
								<Radio.Group
									value={permits.usage}
									onChange={(value) =>
										permits.setUsage(value as PermitUsageFilter)
									}
								>
									<Stack className={classes.options}>
										<Radio
											value="high"
											label={t('constants.permitUsage.high')}
										/>
										<Radio
											value="medium"
											label={t('constants.permitUsage.medium')}
										/>
										<Radio value="low" label={t('constants.permitUsage.low')} />
										<Radio
											value="all"
											label={t(
												'components.permitsTable.filters.menu.usage.all',
											)}
										/>
									</Stack>
								</Radio.Group>
								<Menu.Divider className={classes.divider} />
								<Menu.Label className={classes.label}>
									{t('components.permitsTable.filters.menu.expiry.label')}
								</Menu.Label>
								<Radio.Group
									value={permits.expiry}
									onChange={(value) =>
										permits.setExpiry(value as PermitExpiryFilter)
									}
								>
									<Stack className={classes.options}>
										<Radio
											value="unexpired"
											label={t(
												'components.permitsTable.filters.menu.expiry.unexpired',
											)}
										/>
										<Radio
											value="ongoing"
											label={t(
												'components.permitsTable.filters.menu.expiry.expired',
											)}
										/>
										<Radio
											value="all"
											label={t(
												'components.permitsTable.filters.menu.expiry.all',
											)}
										/>
									</Stack>
								</Radio.Group>
							</Menu.Dropdown>
						</Menu>
						<Tooltip label={t('constants.download.permits')}>
							<ActionIcon className={classes.button}>
								<IconDownload size={16} />
							</ActionIcon>
						</Tooltip>
					</Group>
				</Group>
				<Group className={`${classes.row} ${classes.wrapMobile}`}>
					<Group className={classes.filters}>
						<Text className={classes.label}>
							{t('components.permitsTable.filters.label')}
						</Text>
						<Group className={classes.group}>{filterBadges}</Group>
					</Group>
					<Group className={classes.legend}>
						<Group className={classes.cell}>
							<IconHexagonLetterX
								size={16}
								className={`${classes.icon} ${classes.expiring}`}
							/>
							<Text className={classes.value}>
								{t('components.permitsTable.legend.expiring.label')}
							</Text>
						</Group>
						<Group className={classes.cell}>
							<IconAlertHexagon
								size={16}
								className={`${classes.icon} ${classes.highUsage}`}
							/>
							<Text className={classes.value}>
								{t('components.permitsTable.legend.highUsage.label')}
							</Text>
						</Group>
					</Group>
				</Group>
				<Divider className={classes.divider} />
				<Group className={`${classes.row} ${classes.wrapMobile}`}>
					<TextInput
						className={classes.search}
						placeholder={t('components.permitsTable.search.placeholder')}
						value={searchFilter}
						onChange={(event) => setSearchFilter(event.currentTarget.value)}
						leftSection={<IconSearch size={16} />}
						rightSection={
							searchFilter !== '' ? (
								<Input.ClearButton onClick={() => setSearchFilter('')} />
							) : undefined
						}
						rightSectionPointerEvents="auto"
						disabled={showSelectedOnly}
					/>
					<Group className={classes.actions}>
						<Pill
							classNames={{
								root: classes.count,
								label: classes.label,
								remove: classes.remove,
							}}
							variant="subtle"
							onRemove={() => selectedPermitsHandlers.setState([])}
							withRemoveButton={selectedPermits.length > 0}
						>
							{t('components.table.selected.count', {
								value: selectedPermits.length,
							})}
						</Pill>
						<Group className={classes.buttons}>
							<Button
								className={`${classes.secondary} ${classes.button}`}
								variant="outline"
								disabled={selectedPermits.length === 0}
								rightSection={<IconReportAnalytics size={16} />}
								onClick={() =>
									open(
										selectedPermits,
										generateSummaryGroups as () => Array<SummaryTableGroup>,
									)
								}
							>
								{t('components.table.selected.viewSummary')}
							</Button>
							<Button
								className={`${classes.secondary} ${classes.button}`}
								variant="outline"
								disabled={selectedPermits.length === 0}
								rightSection={<IconFilterSearch size={16} />}
								onClick={() => setShowSelectedOnly((prev) => !prev)}
							>
								{showSelectedOnly
									? t('components.table.selected.resetFilter')
									: t('components.table.selected.filterSelected')}
							</Button>
						</Group>
					</Group>
				</Group>
			</Stack>
			{showSelectedOnly && (
				<Alert
					color="blue"
					icon={<IconInfoCircle size={16} />}
					title={t('components.table.selected.info.title')}
					onClose={() => setShowSelectedOnly(false)}
					withCloseButton
				>
					{t('components.table.selected.info.message')}
				</Alert>
			)}
			<Group className={classes.footer}>
				{permits.isSuccess && !showSelectedOnly && (
					<TablePagination context={permits} tableContainerRef={tableContainerRef} />
				)}
			</Group>
			{/* @ts-expect-error - data table props from library are not exposed */}
			<DataTable
				className={classes.table}
				groups={[
					{
						id: 'details',
						title: t('components.permitsTable.groups.details'),
						columns: [
							{
								accessor: 'obtainDate',
								sortable: true,
								title: t('components.permitsTable.columns.obtainDate'),
								width: 120,
								render: (record) =>
									DateTime.fromISO(record.obtainDate).toLocaleString(
										DateTime.DATETIME_MED,
									),
							},
							{
								accessor: 'scopeCategory',
								sortable: true,
								title: t('components.permitsTable.columns.scopeCategory'),
								width: 240,
								ellipsis: true,
								render: (record) => (
									<Group className={classes.between}>
										<Text>
											{t('components.permitsTable.scopeCategory', {
												scope: t(
													`constants.scope.scope${record.scope}.label`,
												),
												category: t(
													`constants.emissionCategory.${record.category}.label`,
												),
											})}
										</Text>
										<Group className={classes.group}>
											{new Date(record.expiryDate).getTime() - Date.now() <
												ENDING_SOON_THRESHOLD && (
												<Tooltip
													label={t(
														'components.permitsTable.legend.expiring.tooltip',
													)}
													position="top"
												>
													<IconHexagonLetterX
														size={14}
														className={classes.expiring}
													/>
												</Tooltip>
											)}
											{record.usage / record.capacity > 0.9 && (
												<Tooltip
													label={t(
														'components.permitsTable.legend.highUsage.tooltip',
													)}
													position="top"
												>
													<IconAlertHexagon
														size={14}
														className={classes.highUsage}
													/>
												</Tooltip>
											)}
										</Group>
									</Group>
								),
							},
							{
								accessor: 'sector',
								sortable: true,
								title: t('components.permitsTable.columns.sector'),
								width: 160,
								cellsClassName: classes.status,
								render: (record) => <SectorBadge sector={record.sector} />,
							},
						],
					},
					{
						id: 'usage',
						title: t('components.permitsTable.groups.usage'),
						columns: [
							{
								accessor: 'usage',
								sortable: true,
								title: t('components.permitsTable.columns.usage'),
								width: 160,
								render: (record) =>
									t('constants.quantities.permits.default', {
										value: record.usage,
									}),
							},
							{
								accessor: 'capacity',
								sortable: true,
								title: t('components.permitsTable.columns.capacity'),
								width: 160,
								render: (record) =>
									t('constants.quantities.permits.default', {
										value: record.capacity,
									}),
							},
							{
								accessor: 'percentage',
								sortable: false,
								title: t('components.permitsTable.columns.percentage'),
								width: 80,
								render: (record) => {
									const percentage = record.usage / record.capacity;

									let props: BaseBadgeProps = {
										leftSection: <IconCheck size={14} />,
									};
									if (percentage >= 0.9)
										props = { leftSection: <IconAlertHexagon size={14} /> };
									else if (percentage >= 0.5)
										props = { leftSection: <IconAlertTriangle size={14} /> };

									return (
										<BaseBadge {...props}>
											{t('constants.quantities.percent.integer', {
												value: percentage,
											})}
										</BaseBadge>
									);
								},
							},
						],
					},
					{
						id: 'expiry',
						title: t('components.permitsTable.groups.expiry'),
						columns: [
							{
								accessor: 'issueDate',
								sortable: true,
								title: t('components.permitsTable.columns.issueDate'),
								width: 160,
								render: (record) =>
									DateTime.fromISO(record.issueDate).toLocaleString(
										DateTime.DATETIME_MED,
									),
							},
							{
								accessor: 'expiryDate',
								sortable: true,
								title: t('components.permitsTable.columns.expiryDate'),
								width: 160,
								render: (record) =>
									DateTime.fromISO(record.expiryDate).toLocaleString(
										DateTime.DATETIME_MED,
									),
							},
							{
								accessor: 'lifespan',
								sortable: true,
								title: t('components.permitsTable.columns.lifespan'),
								width: 160,
								render: (record) =>
									t('constants.quantities.years.default', {
										value: DateTime.fromISO(record.issueDate).diff(
											DateTime.fromISO(record.expiryDate),
											'years',
										).years,
									}),
							},
							{
								accessor: 'expiryStatus',
								sortable: true,
								title: t('components.permitsTable.columns.expiryStatus'),
								width: 160,
								render: (record) => {
									if (new Date(record.expiryDate).getTime() - Date.now() > 0)
										return (
											<BaseBadge
												color={'red'}
												leftSection={<IconAlertHexagon size={14} />}
											>
												{t('constants.permitExpiry.expired.label')}
											</BaseBadge>
										);
									if (
										new Date(record.expiryDate).getTime() - Date.now() <
										ENDING_SOON_THRESHOLD
									)
										return (
											<BaseBadge
												color={'yellow'}
												leftSection={<IconAlertTriangle size={14} />}
											>
												{t('constants.permitExpiry.soon.label')}
											</BaseBadge>
										);
								},
							},
						],
					},
					{
						id: 'miscellaneous',
						title: t('components.permitsTable.groups.miscellaneous'),
						columns: [
							{
								accessor: 'cost',
								sortable: true,
								title: t('components.permitsTable.columns.cost'),
								width: 160,
								ellipsis: true,
								render: (record) => (
									<>
										<CurrencyBadge className="mr-1" />
										{format.number(record.cost, 'money')}
									</>
								),
							},
							{
								accessor: 'auction',
								sortable: true,
								title: t('components.permitsTable.columns.auction'),
								width: 200,
								ellipsis: true,
								render: (record) => (
									<Anchor
										className={classes.anchor}
										href={`marketplace/auction/${record.previousAuctions[record.previousAuctions.length - 1]}`}
									>
										{
											record.previousAuctions[
												record.previousAuctions.length - 1
											]
										}
									</Anchor>
								),
							},
						],
					},
					{
						id: 'actions',
						title: '',
						className: classes.actions,
						columns: [
							{
								accessor: 'actions',
								title: t('constants.actions.actions.column'),
								titleClassName: classes.actions,
								cellsClassName: classes.actions,
								render: (record) => (
									<Group className={classes.cell}>
										<Tooltip
											label={t(
												'components.permitsTable.columns.actions.use.tooltip',
											)}
											position="top"
										>
											<ActionIcon
												component={Link}
												href={`/dashboard/f/carbon/report?permit=${record.id}`}
												target="_blank"
												className={`${classes.button}`}
											>
												<IconReport size={16} />
											</ActionIcon>
										</Tooltip>
										<Tooltip
											label={t(
												'components.permitsTable.columns.actions.sell.tooltip',
											)}
											position="top"
										>
											<ActionIcon
												component={Link}
												href={`/create/auction?permit=${record.id}`}
												target="_blank"
												className={`${classes.button}`}
											>
												<IconCoins size={16} />
											</ActionIcon>
										</Tooltip>
										<Button
											className={`${classes.primary} ${classes.button}`}
											component={Link}
											href={`/dashboard/f/carbon/pe/${record.id}`}
											rightSection={<IconArrowUpRight size={16} />}
										>
											{t(
												isMobile
													? 'constants.view.label'
													: 'constants.view.details.label',
											)}
										</Button>
									</Group>
								),
							},
						],
					},
				]}
				records={showSelectedOnly ? selectedPermits : permits.data.results}
				striped
				withRowBorders
				withColumnBorders
				highlightOnHover
				pinLastColumn
				// sortStatus={sortStatus}
				// onSortStatusChange={setSortStatus}
				selectedRecords={selectedPermits}
				onSelectedRecordsChange={selectedPermitsHandlers.setState}
				selectionColumnClassName={classes.selection}
				fetching={permits.isLoading}
				idAccessor="id"
				noRecordsText={t('components.permitsTable.empty')}
				scrollViewportRef={tableContainerRef}
				{...props}
			/>
			<Group className={classes.footer}>
				{permits.isSuccess && !showSelectedOnly && (
					<TablePagination context={permits} tableContainerRef={tableContainerRef} />
				)}
			</Group>
		</Stack>
	);
};
export const PermitsTable = (props: PermitsTableProps) =>
	withProviders(<_PermitsTable {...props} />, { provider: SelectionSummaryProvider });
