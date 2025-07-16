'use client';

import { DateTime } from 'luxon';
import { DataTable } from 'mantine-datatable';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';

import { SummaryTableGroup } from '@/components/SummaryTable';
import { AdminsFilter } from '@/components/Tables/Admins/types';
import { TablePagination } from '@/components/Tables/_components/Pagination';
import {
	SelectionSummaryContext,
	SelectionSummaryProvider,
} from '@/components/Tables/_components/SelectionSummary';
import { IPaginatedAdminsContext } from '@/contexts';
import { withProviders } from '@/helpers';
import { useOffsetPaginationText } from '@/hooks';
import { IAdminData } from '@/schema/models';
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
	IconDownload,
	IconFileSearch,
	IconFilterSearch,
	IconInfoCircle,
	IconReportAnalytics,
	IconSearch,
} from '@tabler/icons-react';

import classes from '../styles.module.css';

export interface AdminsTableProps extends TableProps {
	admins: IPaginatedAdminsContext;
}
const _AdminsTable = ({
	admins,

	className,
	...props
}: AdminsTableProps) => {
	const t = useTranslations();
	const isMobile = useMediaQuery('(max-width: 48em)');
	const tableContainerRef = useRef<HTMLTableElement>(null);
	const paginationText = useOffsetPaginationText('admins', admins);
	const { open } = useContext(SelectionSummaryContext);

	const [showSelectedOnly, setShowSelectedOnly] = useState(false);
	const [searchFilter, setSearchFilter] = useState('');
	const [roleFilter, setRoleFilter] = useState<AdminsFilter>('all');
	const [selectedAdmins, selectedAdminsHandlers] = useListState<IAdminData>([]);

	//	Generate the filter badges
	const filterBadges = useMemo(() => {
		if (!admins) return null;
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

		switch (roleFilter) {
			case 'manager':
				output.push(
					<Pill
						className={classes.badge}
						onRemove={() => setRoleFilter('all')}
						withRemoveButton
					>
						{t('components.adminsTable.filters.badges.manager')}
					</Pill>,
				);
				break;
			case 'auctionOperator':
				output.push(
					<Pill
						className={classes.badge}
						onRemove={() => setRoleFilter('all')}
						withRemoveButton
					>
						{t('components.adminsTable.filters.badges.auctionOperator')}
					</Pill>,
				);
				break;
			case 'permitStrategist':
				output.push(
					<Pill
						className={classes.badge}
						onRemove={() => setRoleFilter('all')}
						withRemoveButton
					>
						{t('components.adminsTable.filters.badges.permitStrategist')}
					</Pill>,
				);
				break;
			case 'financeOfficer':
				output.push(
					<Pill
						className={classes.badge}
						onRemove={() => setRoleFilter('all')}
						withRemoveButton
					>
						{t('components.adminsTable.filters.badges.financeOfficer')}
					</Pill>,
				);
		}

		if (output.length === 0)
			return (
				<Pill className={classes.badge}>
					{t('components.adminsTable.filters.badges.all')}
				</Pill>
			);
		return output;
	}, [admins, showSelectedOnly, roleFilter, t]);

	const generateSummaryGroups = useMemo(
		() => (selected: Array<IAdminData>) => [
			{
				title: t('components.adminsTable.summary.distribution.title'),
				rows: [
					{
						label: t('components.adminsTable.summary.distribution.total'),
						value: t('constants.quantities.admins.default', {
							value: selected.length,
						}),
					},
					//	TODO: add role statistics once implemented in backend
					// {
					// 	label: t('components.adminsTable.summary.sector.energy'),
					// 	value: t('constants.quantities.admins.default', {
					// 		value: selected.filter((record) => record.sectors.includes('energy'))
					// 			.length,
					// 	}),
					// },
					// {
					// 	label: t('components.adminsTable.summary.sector.industry'),
					// 	value: t('constants.quantities.admins.default', {
					// 		value: selected.filter((record) => record.sectors.includes('industry'))
					// 			.length,
					// 	}),
					// },
					// {
					// 	label: t('components.adminsTable.summary.sector.transport'),
					// 	value: t('constants.quantities.admins.default', {
					// 		value: selected.filter((record) => record.sectors.includes('transport'))
					// 			.length,
					// 	}),
					// },
					// {
					// 	label: t('components.adminsTable.summary.sector.buildings'),
					// 	value: t('constants.quantities.admins.default', {
					// 		value: selected.filter((record) => record.sectors.includes('buildings'))
					// 			.length,
					// 	}),
					// },
					// {
					// 	label: t('components.adminsTable.summary.sector.agriculture'),
					// 	value: t('constants.quantities.admins.default', {
					// 		value: selected.filter((record) =>
					// 			record.sectors.includes('agriculture'),
					// 		).length,
					// 	}),
					// },
					// {
					// 	label: t('components.adminsTable.summary.sector.waste'),
					// 	value: t('constants.quantities.admins.default', {
					// 		value: selected.filter((record) => record.sectors.includes('waste'))
					// 			.length,
					// 	}),
					// },
				],
			},
			{
				title: t('components.adminsTable.summary.createdDate.title'),
				rows: [
					{
						label: t('components.table.selected.summary.min'),
						value: t('constants.quantities.days.decimals', {
							value: Math.min(
								...selected.map(
									(record) =>
										DateTime.now().diff(
											DateTime.fromISO(record.createdAt),
											'days',
										).days,
								),
							),
						}),
					},
					{
						label: t('components.table.selected.summary.avg'),
						value: t('constants.quantities.days.decimals', {
							value:
								selected.reduce(
									(acc, record) =>
										acc +
										DateTime.now().diff(
											DateTime.fromISO(record.createdAt),
											'days',
										).days,
									0,
								) / selected.length,
						}),
					},
					{
						label: t('components.table.selected.summary.max'),
						value: t('constants.quantities.days.decimals', {
							value: Math.max(
								...selected.map(
									(record) =>
										DateTime.now().diff(
											DateTime.fromISO(record.createdAt),
											'days',
										).days,
								),
							),
						}),
					},
				],
			},
		],
		[t],
	);

	//	Reset the page when the bids filter or per page changes
	useEffect(() => admins.setPage(1), [roleFilter, admins.perPage]);

	//	If we are showing selected only and there are no selected auctions, disable the filter
	useEffect(() => {
		if (showSelectedOnly && selectedAdmins.length === 0) setShowSelectedOnly(false);
	}, [showSelectedOnly, selectedAdmins.length]);

	return (
		<Stack className={`${classes.root} ${className}`}>
			<Stack className={classes.header}>
				<Group className={`${classes.row} ${classes.wrapMobile}`}>
					<Group className={classes.label}>
						<Title order={2} className={classes.title}>
							{t('components.adminsTable.title')}
						</Title>
						<Text className={classes.subtitle}>
							{showSelectedOnly
								? t('components.table.selected.paginationText', {
										value: selectedAdmins.length,
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
							value={admins.perPage.toString()}
							data={['10', '20', '50', '100']}
							onChange={(value) => admins.setPerPage(Number(value))}
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
									{t('components.adminsTable.filters.menu.role.label')}
								</Menu.Label>
								<Radio.Group
									value={roleFilter}
									onChange={(values) => setRoleFilter(values as AdminsFilter)}
								>
									<Stack className={classes.options}>
										<Radio
											value="manager"
											label={t('constants.adminRoles.manager.title')}
										/>
										<Radio
											value="auctionOperator"
											label={t('constants.adminRoles.operator.title')}
										/>
										<Radio
											value="permitStrategist"
											label={t('constants.adminRoles.allocator.title')}
										/>
										<Radio
											value="financeOfficer"
											label={t('constants.adminRoles.finance.title')}
										/>
									</Stack>
								</Radio.Group>
							</Menu.Dropdown>
						</Menu>
						<Tooltip label={t('constants.download.companyData')}>
							<ActionIcon className={classes.button}>
								<IconDownload size={16} />
							</ActionIcon>
						</Tooltip>
					</Group>
				</Group>
				<Group className={`${classes.row} ${classes.wrapMobile}`}>
					<Group className={classes.filters}>
						<Text className={classes.label}>
							{t('components.adminsTable.filters.label')}
						</Text>
						<Group className={classes.group}>{filterBadges}</Group>
					</Group>
					<Group className={classes.legend}></Group>
				</Group>
				<Divider className={classes.divider} />
				<Group className={`${classes.row} ${classes.wrapMobile}`}>
					<TextInput
						className={classes.search}
						placeholder={t('components.adminsTable.search.placeholder')}
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
							onRemove={() => selectedAdminsHandlers.setState([])}
							withRemoveButton={selectedAdmins.length > 0}
						>
							{t('components.table.selected.count', {
								value: selectedAdmins.length,
							})}
						</Pill>
						<Group className={classes.buttons}>
							<Button
								className={`${classes.secondary} ${classes.button}`}
								variant="outline"
								disabled={selectedAdmins.length === 0}
								rightSection={<IconReportAnalytics size={16} />}
								onClick={() =>
									open(
										selectedAdmins,
										generateSummaryGroups as () => Array<SummaryTableGroup>,
									)
								}
							>
								{t('components.table.selected.viewSummary')}
							</Button>
							<Button
								className={`${classes.secondary} ${classes.button}`}
								variant="outline"
								disabled={selectedAdmins.length === 0}
								rightSection={<IconFilterSearch size={16} />}
								onClick={() => setShowSelectedOnly((prev) => !prev)}
							>
								{showSelectedOnly
									? t('components.table.selected.resetFilter')
									: t('components.table.selected.filterSelected')}
							</Button>
							<Button
								className={`${classes.primary} ${classes.button}`}
								disabled={selectedAdmins.length === 0}
								rightSection={<IconFileSearch size={16} />}
							>
								{t(
									`components.adminsTable.actions.audit.${isMobile ? 'short' : 'default'}`,
									{
										value: selectedAdmins.length,
									},
								)}
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
				{admins.isSuccess && !showSelectedOnly && (
					<TablePagination context={admins} tableContainerRef={tableContainerRef} />
				)}
			</Group>
			{/* @ts-expect-error - data table props from library are not exposed */}
			<DataTable
				className={classes.table}
				columns={[
					{
						accessor: 'name',
						sortable: true,
						title: t('components.adminsTable.columns.name'),
						width: 320,
						ellipsis: true,
						render: (record) => (
							<Anchor
								component={Link}
								className={classes.anchor}
								href={`/dashboard/a/admins/${record.id}`}
							>
								{record.name}
							</Anchor>
						),
					},
					{
						accessor: 'email',
						sortable: true,
						title: t('components.adminsTable.columns.email'),
						width: 200,
						ellipsis: true,
						render: (record) => (
							<Anchor href={`mailto:${record.email}`} className={classes.anchor}>
								{record.email}
							</Anchor>
						),
					},
					{
						accessor: 'phone',
						sortable: true,
						title: t('components.adminsTable.columns.phone'),
						width: 200,
						render: (record) => (
							<Anchor href={`tel:${record.phone}`} className={classes.anchor}>
								{record.phone}
							</Anchor>
						),
					},
					{
						accessor: 'createdAt',
						sortable: true,
						title: t('components.adminsTable.columns.createdAt'),
						width: 200,
						render: (record) =>
							DateTime.fromISO(record.createdAt).toLocaleString(
								DateTime.DATETIME_SHORT,
							),
					},
				]}
				records={showSelectedOnly ? selectedAdmins : admins.data.results}
				striped
				withRowBorders
				withColumnBorders
				highlightOnHover
				// sortStatus={sortStatus}
				// onSortStatusChange={setSortStatus}
				selectedRecords={selectedAdmins}
				onSelectedRecordsChange={selectedAdminsHandlers.setState}
				selectionColumnClassName={classes.selection}
				fetching={admins.isLoading}
				idAccessor="id"
				selectionTrigger="cell"
				noRecordsText={t('components.adminsTable.empty')}
				scrollViewportRef={tableContainerRef}
				{...props}
			/>
			<Group className={classes.footer}>
				{admins.isSuccess && !showSelectedOnly && (
					<TablePagination context={admins} tableContainerRef={tableContainerRef} />
				)}
			</Group>
		</Stack>
	);
};
export const AdminsTable = (props: AdminsTableProps) =>
	withProviders(<_AdminsTable {...props} />, { provider: SelectionSummaryProvider });
