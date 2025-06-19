'use client';

import { DateTime } from 'luxon';
import { DataTable } from 'mantine-datatable';
import { useFormatter, useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { FirmStatusBadge } from '@/components/Badge';
import { Switch } from '@/components/SwitchCase';
import { FirmsFilter } from '@/components/Tables/Firms/types';
import { IPaginatedFirmsContext } from '@/contexts';
import {
	ActionIcon,
	Anchor,
	Container,
	CopyButton,
	Group,
	Loader,
	Menu,
	Pagination,
	Pill,
	Radio,
	Select,
	Stack,
	Table,
	TableProps,
	Text,
	Title,
	Tooltip,
} from '@mantine/core';
import {
	IconAdjustments,
	IconArrowNarrowDown,
	IconCheck,
	IconCopy,
	IconDatabaseOff,
	IconHelpHexagon,
	IconInfoHexagon,
} from '@tabler/icons-react';

import classes from '../styles.module.css';

export interface firmsTableProps extends TableProps {
	firms: IPaginatedFirmsContext;

	loading?: boolean;
	unavailable?: boolean;
}
export const FirmsTable = ({
	firms,

	loading = false,
	unavailable = false,

	className,
	...props
}: firmsTableProps) => {
	const t = useTranslations();
	const format = useFormatter();
	const tableContainerRef = useRef<HTMLTableElement>(null);

	const [firmsFilter, setFirmsFilter] = useState<FirmsFilter>('all');

	//	Generate the table rows
	const tableData = useMemo(() => {
		if (!firms) return null;
		//	TODO: generate sector badges here once user data has sectors
		const sectors = [];
		return firms.data.results.map((firm) => (
			<Table.Tr>
				<Table.Td className={classes.firm}>
					<Anchor className={classes.anchor} href={`/dashboard/a/firms/${firm.id}`}>
						{firm.name}
					</Anchor>
					<Group className={classes.badges}>
						{/* TODO: replace with actual verification or invitation check */}
						{!firm.emailVerified && (
							<Tooltip
								label={t('components.firmsTable.legend.unverified.tooltip')}
								position="top"
							>
								<IconHelpHexagon size={14} className={classes.unverified} />
							</Tooltip>
						)}
					</Group>
				</Table.Td>
				<Table.Td className={classes.sectors}></Table.Td>
				<Table.Td className={classes.email}>
					<Anchor href={`mailto:${firm.email}`} className={classes.anchor}>
						{firm.email}
					</Anchor>
				</Table.Td>
				<Table.Td className={classes.phone}>
					<Anchor href={`tel:${firm.phone}`} className={classes.anchor}>
						{firm.phone}
					</Anchor>
				</Table.Td>
				{/* TODO: replace with actual CRN once available */}
				<Table.Td className={classes.crn}>
					1234567890
					<CopyButton value={'1234567890'} timeout={2000}>
						{({ copied, copy }) => (
							<Tooltip label={copied ? 'Copied' : 'Copy'}>
								<ActionIcon
									color={copied ? 'teal' : 'gray'}
									variant="light"
									onClick={copy}
								>
									{copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
								</ActionIcon>
							</Tooltip>
						)}
					</CopyButton>
				</Table.Td>
				<Table.Td className={classes.status}>
					<FirmStatusBadge status={firm.emailVerified ? 'verified' : 'unverified'} />
				</Table.Td>
				<Table.Td className={classes.creationDate}>
					{DateTime.fromISO(firm.createdAt).toLocaleString(DateTime.DATETIME_SHORT)}
				</Table.Td>
				<Table.Td className={classes.invitedBy}>
					{/* TODO: add inviter id here */}
					<Anchor href={`/dashboard/a/admins/`} className={classes.anchor}>
						Placeholder Admin
					</Anchor>
				</Table.Td>
			</Table.Tr>
		));
	}, [firms, t, format]);

	//	Generate the filter badges
	const filterBadges = useMemo(() => {
		if (!firms) return null;
		if (firmsFilter === 'all')
			return (
				<Pill className={classes.badge}>
					{t('components.firmsTable.filters.badges.all')}
				</Pill>
			);
		if (firmsFilter === 'verified')
			return (
				<Pill
					className={classes.badge}
					onRemove={() => setFirmsFilter('all')}
					withRemoveButton
				>
					{t('components.firmsTable.filters.badges.verified')}
				</Pill>
			);
		if (firmsFilter === 'unverified')
			return (
				<Pill
					className={classes.badge}
					onRemove={() => setFirmsFilter('all')}
					withRemoveButton
				>
					{t('components.firmsTable.filters.badges.unverified')}
				</Pill>
			);
		if (firmsFilter === 'uninvited')
			return (
				<Pill
					className={classes.badge}
					onRemove={() => setFirmsFilter('all')}
					withRemoveButton
				>
					{t('components.firmsTable.filters.badges.uninvited')}
				</Pill>
			);
	}, [firms, firmsFilter, t]);

	const handleChangePage = useCallback(
		(page: number) => {
			if (!firms || !tableContainerRef.current) return;
			firms.setPage(page);
			tableContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
		},
		[firms, tableContainerRef],
	);

	//	Reset the page when the bids filter or per page changes
	useEffect(() => firms.setPage(1), [firmsFilter, firms.perPage]);

	const currentState = useMemo(() => {
		if (!tableData && loading) return 'loading';
		if (unavailable) return 'unavailable';
		if (!tableData || tableData.length === 0) return 'empty';
		return 'ok';
	}, [loading, tableData]);

	return (
		<Stack className={`${classes.root} ${className}`}>
			<Stack className={classes.header}>
				<Group className={classes.row}>
					<Group className={classes.label}>
						<Title order={2} className={classes.title}>
							{t('components.firmsTable.title')}
						</Title>
						<Text className={classes.subtitle}>
							{t('constants.pagination.offset.firms', {
								start: Math.min(
									(firms.page - 1) * firms.perPage + 1,
									firms.data.totalCount,
								),
								end:
									(firms.page - 1) * firms.perPage + firms.perPage >
									firms.data.totalCount
										? firms.data.totalCount
										: (firms.page - 1) * firms.perPage + firms.perPage,
								total: firms.data.totalCount,
							})}
						</Text>
					</Group>
					<Group className={classes.settings}>
						<Text className={classes.label}>
							{t('constants.pagination.perPage.label')}
						</Text>
						<Select
							className={classes.dropdown}
							w={80}
							value={firms.perPage.toString()}
							data={['10', '20', '50', '100']}
							onChange={(value) => firms.setPerPage(Number(value))}
							allowDeselect={false}
						/>
						<Menu position="bottom-end">
							<Menu.Target>
								<ActionIcon className={classes.button}>
									<IconAdjustments size={16} />
								</ActionIcon>
							</Menu.Target>
							<Menu.Dropdown className={classes.filterMenu}>
								<Menu.Label>
									{t('components.firmsTable.filters.menu.status.label')}
								</Menu.Label>
								<Radio.Group
									classNames={{ label: classes.label }}
									value={firmsFilter}
									onChange={(value) => setFirmsFilter(value as FirmsFilter)}
								>
									<Stack className={classes.options}>
										<Radio
											value="all"
											label={t(
												'components.firmsTable.filters.menu.status.all',
											)}
										/>
										<Radio
											value="verified"
											label={t(
												'components.firmsTable.filters.menu.status.verified',
											)}
										/>
										<Radio
											value="unverified"
											label={t(
												'components.firmsTable.filters.menu.status.unverified',
											)}
										/>
										<Radio
											value="uninvited"
											label={t(
												'components.firmsTable.filters.menu.status.uninvited',
											)}
										/>
									</Stack>
								</Radio.Group>
								<Menu.Divider />
								<Menu.Label>
									{t('components.firmsTable.filters.menu.sector.label')}
								</Menu.Label>
							</Menu.Dropdown>
						</Menu>
					</Group>
				</Group>
				<Group className={classes.row}>
					<Group className={classes.filters}>
						<Text className={classes.label}>
							{t('components.firmsTable.filters.label')}
						</Text>
						<Group className={classes.badges}>{filterBadges}</Group>
					</Group>
					<Group className={classes.legend}>
						<Group className={classes.cell}>
							<IconHelpHexagon
								size={16}
								className={`${classes.icon} ${classes.unverified}`}
							/>
							<Text className={classes.value}>
								{t('components.firmsTable.legend.unverified.label')}
							</Text>
						</Group>
						<Group className={classes.cell}>
							<IconInfoHexagon
								size={16}
								className={`${classes.icon} ${classes.uninvited}`}
							/>
							<Text className={classes.value}>
								{t('components.firmsTable.legend.uninvited.label')}
							</Text>
						</Group>
					</Group>
				</Group>
			</Stack>
			{/* @ts-expect-error - data table props from library are not exposed */}
			<DataTable
				className={classes.table}
				columns={[
					{
						accessor: 'name',
						sortable: true,
						title: t('components.firmsTable.columns.name'),
						render: (record) => (
							<>
								<Anchor
									className={classes.anchor}
									href={`/dashboard/a/firms/${record.id}`}
								>
									{record.name}
								</Anchor>
								<Group className={classes.badges}>
									{/* TODO: replace with actual verification or invitation check */}
									{!record.emailVerified && (
										<Tooltip
											label={t(
												'components.firmsTable.legend.unverified.tooltip',
											)}
											position="top"
										>
											<IconHelpHexagon
												size={14}
												className={classes.unverified}
											/>
										</Tooltip>
									)}
								</Group>
							</>
						),
					},
					{
						accessor: 'sectors',
						sortable: false,
						title: t('components.firmsTable.columns.sectors'),
						render: (record) => <Text className={classes.sectors}></Text>,
					},
					{
						accessor: 'email',
						sortable: true,
						title: t('components.firmsTable.columns.email'),
						render: (record) => (
							<Anchor href={`mailto:${record.email}`} className={classes.anchor}>
								{record.email}
							</Anchor>
						),
					},
					{
						accessor: 'phone',
						sortable: true,
						title: t('components.firmsTable.columns.phone'),
						render: (record) => (
							<Anchor href={`tel:${record.phone}`} className={classes.anchor}>
								{record.phone}
							</Anchor>
						),
					},
					{
						accessor: 'crn',
						sortable: true,
						title: t('components.firmsTable.columns.crn'),
						render: (record) => (
							<>
								<Text>1234567890</Text>
								<CopyButton value={'1234567890'} timeout={2000}>
									{({ copied, copy }) => (
										<Tooltip label={copied ? 'Copied' : 'Copy'}>
											<ActionIcon
												color={copied ? 'teal' : 'gray'}
												variant="light"
												onClick={copy}
											>
												{copied ? (
													<IconCheck size={14} />
												) : (
													<IconCopy size={14} />
												)}
											</ActionIcon>
										</Tooltip>
									)}
								</CopyButton>
							</>
						),
					},
					{
						accessor: 'status',
						sortable: false,
						title: t('components.firmsTable.columns.status'),
						render: (record) => (
							<FirmStatusBadge
								status={record.emailVerified ? 'verified' : 'unverified'}
							/>
						),
					},
					{
						accessor: 'createdAt',
						sortable: true,
						title: t('components.firmsTable.columns.createdAt'),
						render: (record) =>
							DateTime.fromISO(record.createdAt).toLocaleString(
								DateTime.DATETIME_SHORT,
							),
					},
					{
						accessor: 'invitedBy',
						sortable: false,
						title: t('components.firmsTable.columns.invitedBy'),
						render: (record) => (
							//	TODO: add inviter id here
							<Anchor href={`/dashboard/a/admins/`} className={classes.anchor}>
								Placeholder Admin
							</Anchor>
						),
					},
				]}
				records={firms.data.results}
				striped
				withRowBorders
				withColumnBorders
				highlightOnHover
				pinLastColumn
				// sortStatus={sortStatus}
				// onSortStatusChange={setSortStatus}
				// selectedRecords={!readOnly ? selectedBids : undefined}
				// onSelectedRecordsChange={!readOnly ? selectedBidsHandlers.setState : undefined}
				idAccessor="id"
				selectionTrigger="cell"
				noRecordsText={t('components.firmsTable.empty')}
				scrollViewportRef={tableContainerRef}
				{...props}
			/>
			{/* <Stack className={classes.table} ref={tableContainerRef}>
				<Table highlightOnHover withColumnBorders stickyHeader {...props}>
					<Table.Thead>
						<Table.Tr>
							<Table.Th className="min-w-[120px]">
								{t('components.firmsTable.columns.name')}
							</Table.Th>
							<Table.Th className="min-w-[120px]">
								{t('components.firmsTable.columns.sectors')}
							</Table.Th>
							<Table.Th className="min-w-[120px]">
								{t('components.firmsTable.columns.email')}
							</Table.Th>
							<Table.Th className="min-w-[120px]">
								{t('components.firmsTable.columns.phone')}
							</Table.Th>
							<Table.Th className="min-w-[120px]">
								{t('components.firmsTable.columns.crn')}
							</Table.Th>
							<Table.Th className="min-w-[80px]">
								{t('components.firmsTable.columns.status')}
							</Table.Th>
							<Table.Th className="min-w-[160px] flex items-center justify-between">
								{t('components.firmsTable.columns.createdAt')}
								<IconArrowNarrowDown size={14} />
							</Table.Th>
							<Table.Th className="min-w-[160px]">
								{t('components.firmsTable.columns.invitedBy')}
							</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>{tableData}</Table.Tbody>
				</Table>
				<Switch value={currentState}>
					<Switch.Loading>
						<Stack className={classes.placeholder}>
							<Loader color="gray" />
						</Stack>
					</Switch.Loading>
					<Switch.Case when="empty">
						<Stack className={classes.placeholder}>
							<Container className={classes.icon}>
								<IconDatabaseOff size={24} />
							</Container>
							<Text className={classes.text}>{t('components.firmsTable.empty')}</Text>
						</Stack>
					</Switch.Case>
				</Switch>
			</Stack> */}
			<Group className={classes.footer}>
				{firms.isSuccess && (
					<Pagination
						className={classes.pagination}
						value={firms.page}
						total={firms.data.pageCount}
						siblings={2}
						boundaries={3}
						onChange={handleChangePage}
					/>
				)}
			</Group>
		</Stack>
	);
};
