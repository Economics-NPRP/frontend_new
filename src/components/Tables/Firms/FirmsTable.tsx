'use client';

import { DateTime } from 'luxon';
import { DataTable } from 'mantine-datatable';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { CategoryBadge, FirmStatusBadge } from '@/components/Badge';
import { Switch } from '@/components/SwitchCase';
import { FirmsFilter } from '@/components/Tables/Firms/types';
import { AuctionCategoryVariants } from '@/constants/AuctionCategory';
import { IPaginatedFirmsContext } from '@/contexts';
import { InvitationModalContext } from '@/pages/dashboard/a/firms/_components/InvitationModal';
import { IFirmData } from '@/schema/models';
import { AuctionCategory } from '@/types';
import {
	ActionIcon,
	Anchor,
	Badge,
	Button,
	Checkbox,
	CopyButton,
	Divider,
	Group,
	HoverCard,
	Input,
	Menu,
	Pagination,
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
	IconArrowUpRight,
	IconCheck,
	IconCopy,
	IconFileSearch,
	IconHelpHexagon,
	IconInfoHexagon,
	IconMailShare,
	IconSearch,
} from '@tabler/icons-react';

import classes from '../styles.module.css';

export interface firmsTableProps extends TableProps {
	firms: IPaginatedFirmsContext;
}
export const FirmsTable = ({
	firms,

	className,
	...props
}: firmsTableProps) => {
	const t = useTranslations();
	const isMobile = useMediaQuery('(max-width: 48em)');
	const tableContainerRef = useRef<HTMLTableElement>(null);

	const invitationModal = useContext(InvitationModalContext);

	const [searchFilter, setSearchFilter] = useState('');
	const [statusFilter, setStatusFilter] = useState<FirmsFilter>('all');
	const [selectedFirms, selectedFirmsHandlers] = useListState<IFirmData>([]);
	const [sectorFilter, sectorFilterHandlers] = useListState<AuctionCategory>([]);

	//	Generate the filter badges
	const filterBadges = useMemo(() => {
		if (!firms) return null;
		const output = [];

		switch (statusFilter) {
			case 'verified':
				output.push(
					<Pill
						className={classes.badge}
						onRemove={() => setStatusFilter('all')}
						withRemoveButton
					>
						{t('components.firmsTable.filters.badges.verified')}
					</Pill>,
				);
				break;
			case 'unverified':
				output.push(
					<Pill
						className={classes.badge}
						onRemove={() => setStatusFilter('all')}
						withRemoveButton
					>
						{t('components.firmsTable.filters.badges.unverified')}
					</Pill>,
				);
				break;
			case 'uninvited':
				output.push(
					<Pill
						className={classes.badge}
						onRemove={() => setStatusFilter('all')}
						withRemoveButton
					>
						{t('components.firmsTable.filters.badges.uninvited')}
					</Pill>,
				);
				break;
		}

		output.push(
			...sectorFilter.map((sector, index) => (
				<CategoryBadge
					key={sector}
					category={sector}
					onRemove={() => sectorFilterHandlers.remove(index)}
					withRemoveButton
				/>
			)),
		);

		if (output.length === 0)
			return (
				<Pill className={classes.badge}>
					{t('components.firmsTable.filters.badges.all')}
				</Pill>
			);
		return output;
	}, [firms, statusFilter, sectorFilter, t, sectorFilterHandlers]);

	const handleChangePage = useCallback(
		(page: number) => {
			if (!firms || !tableContainerRef.current) return;
			firms.setPage(page);
			tableContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
		},
		[firms, tableContainerRef],
	);

	//	Reset the page when the bids filter or per page changes
	useEffect(() => firms.setPage(1), [statusFilter, firms.perPage]);

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
								<Menu.Label className={classes.label}>
									{t('components.firmsTable.filters.menu.status.label')}
								</Menu.Label>
								<Radio.Group
									value={statusFilter}
									onChange={(value) => setStatusFilter(value as FirmsFilter)}
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
								<Menu.Divider className={classes.divider} />
								<Menu.Label className={classes.label}>
									{t('components.firmsTable.filters.menu.sector.label')}
								</Menu.Label>
								<Checkbox.Group
									value={sectorFilter}
									onChange={(values) =>
										sectorFilterHandlers.setState(
											values as Array<AuctionCategory>,
										)
									}
								>
									<Stack className={classes.options}>
										<Checkbox
											className={classes.checkbox}
											value="energy"
											label={t('constants.auctionCategory.energy.title')}
										/>
										<Checkbox
											className={classes.checkbox}
											value="industry"
											label={t('constants.auctionCategory.industry.title')}
										/>
										<Checkbox
											className={classes.checkbox}
											value="transport"
											label={t('constants.auctionCategory.transport.title')}
										/>
										<Checkbox
											className={classes.checkbox}
											value="buildings"
											label={t('constants.auctionCategory.buildings.title')}
										/>
										<Checkbox
											className={classes.checkbox}
											value="agriculture"
											label={t('constants.auctionCategory.agriculture.title')}
										/>
										<Checkbox
											className={classes.checkbox}
											value="waste"
											label={t('constants.auctionCategory.waste.title')}
										/>
									</Stack>
								</Checkbox.Group>
							</Menu.Dropdown>
						</Menu>
					</Group>
				</Group>
				<Group className={`${classes.row} ${classes.wrapMobile}`}>
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
				<Divider className={classes.divider} />
				<Group className={`${classes.row} ${classes.wrapMobile}`}>
					<TextInput
						className={classes.search}
						placeholder={t('components.firmsTable.search.placeholder')}
						value={searchFilter}
						onChange={(event) => setSearchFilter(event.currentTarget.value)}
						leftSection={<IconSearch size={16} />}
						rightSection={
							searchFilter !== '' ? (
								<Input.ClearButton onClick={() => setSearchFilter('')} />
							) : undefined
						}
						rightSectionPointerEvents="auto"
					/>
					<Group className={classes.actions}>
						<Text className={classes.count}>
							{t('components.table.selected.count', { value: selectedFirms.length })}
						</Text>
						<Group className={classes.buttons}>
							<Button
								className={`${classes.secondary} ${classes.button}`}
								variant="outline"
								disabled={selectedFirms.length === 0}
								rightSection={<IconFileSearch size={16} />}
							>
								{t(
									`components.firmsTable.actions.audit.${isMobile ? 'short' : 'default'}`,
									{
										value: selectedFirms.length,
									},
								)}
							</Button>
							{/* <Button
								className={`${classes.primary} ${classes.button}`}
								disabled={selectedFirms.length === 0}
								rightSection={<IconMailShare size={16} />}
							>
								{t(
									`components.firmsTable.actions.invite.${isMobile ? 'short' : 'default'}`,
									{
										value: selectedFirms.length,
									},
								)}
							</Button> */}
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
						width: 240,
						cellsClassName: `${classes.firm} ${classes.between}`,
						ellipsis: true,
						render: (record) => (
							<>
								<Anchor
									component={Link}
									className={classes.anchor}
									href={`/dashboard/a/firms/${record.id}`}
								>
									{record.name}
								</Anchor>
								<Group className={classes.group}>
									{/* TODO: replace with actual verification or invitation check */}
									{!record.isActive && (
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
									{/* TODO: replace with actual uninvited check */}
									{new Date(record.createdAt).getTime() - Date.now() <
										1000 * 60 * 60 * 24 * 3 && (
										<Tooltip
											label={t(
												'components.firmsTable.legend.uninvited.tooltip',
											)}
											position="top"
										>
											<IconInfoHexagon
												size={14}
												className={classes.uninvited}
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
						width: 180,
						render: (record: IFirmData) => {
							const badges = useMemo(
								() =>
									record.sectors
										.filter(
											(sector) =>
												AuctionCategoryVariants[
													sector.toLowerCase() as AuctionCategory
												],
										)
										.map((sector) => (
											<CategoryBadge
												key={sector}
												category={sector}
												className={classes.categoryBadge}
											/>
										)),
								[record.sectors],
							);

							return (
								<>
									<Group className={classes.group}>
										{badges[0]}
										{badges.length > 1 && (
											<HoverCard position="top">
												<HoverCard.Target>
													<Badge variant="light">
														+{badges.length - 1}
													</Badge>
												</HoverCard.Target>
												<HoverCard.Dropdown className={classes.HoverCard}>
													{badges.slice(1).map((badge) => badge)}
												</HoverCard.Dropdown>
											</HoverCard>
										)}
									</Group>
								</>
							);
						},
					},
					{
						accessor: 'email',
						sortable: true,
						title: t('components.firmsTable.columns.email'),
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
						width: 180,
						cellsClassName: `${classes.crn} ${classes.between}`,
						render: () => (
							<>
								<Text>1234567890</Text>
								<CopyButton value={'1234567890'} timeout={2000}>
									{({ copied, copy }) => (
										<Tooltip
											label={
												copied
													? t('constants.actions.copied.label')
													: t('constants.actions.copy.label')
											}
										>
											<ActionIcon
												className={classes.copy}
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
						width: 160,
						cellsClassName: classes.status,
						render: (record) => (
							<FirmStatusBadge
								//	TODO: replace with actual status check
								status={record.isActive ? 'verified' : 'unverified'}
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
						ellipsis: true,
						render: () => (
							//	TODO: add inviter id here
							<Anchor
								component={Link}
								href={`/dashboard/a/admins/`}
								className={`${classes.anchor} max-w-[160px]`}
							>
								Placeholder Admin
							</Anchor>
						),
					},
					{
						accessor: 'actions',
						title: t('constants.actions.actions.column'),
						titleClassName: classes.actions,
						cellsClassName: classes.actions,
						render: (record) => (
							<Group className={classes.cell}>
								{/* TODO: replace with actual status check */}
								<Switch value={record.isActive}>
									<Switch.True>
										<Tooltip
											label={t(
												'components.firmsTable.columns.actions.audit.tooltip',
											)}
											position="top"
										>
											<ActionIcon className={`${classes.button}`}>
												<IconFileSearch size={16} />
											</ActionIcon>
										</Tooltip>
									</Switch.True>
									<Switch.False>
										<Tooltip
											label={t(
												'components.firmsTable.columns.actions.invite.tooltip',
											)}
											position="top"
										>
											<ActionIcon
												className={`${classes.button}`}
												onClick={() => invitationModal.open(record)}
											>
												<IconMailShare size={16} />
											</ActionIcon>
										</Tooltip>
									</Switch.False>
								</Switch>
								<Button
									className={`${classes.primary} ${classes.button}`}
									component={Link}
									href={`/dashboard/a/firms/${record.id}`}
									rightSection={<IconArrowUpRight size={16} />}
								>
									{t('constants.view.details.label')}
								</Button>
							</Group>
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
				selectedRecords={selectedFirms}
				onSelectedRecordsChange={selectedFirmsHandlers.setState}
				selectionColumnClassName={classes.selection}
				fetching={firms.isLoading}
				idAccessor="id"
				selectionTrigger="cell"
				noRecordsText={t('components.firmsTable.empty')}
				scrollViewportRef={tableContainerRef}
				{...props}
			/>
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
