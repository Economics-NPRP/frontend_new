'use client';

import { DateTime } from 'luxon';
import { DataTable } from 'mantine-datatable';
import { useTranslations } from 'next-intl';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { CategoryBadge, FirmStatusBadge } from '@/components/Badge';
import { FirmApplicationsFilter } from '@/components/Tables/FirmApplications/types';
import { AuctionCategoryVariants } from '@/constants/AuctionCategory';
import { IPaginatedFirmApplicationsContext } from '@/contexts';
import { useKeysetPaginationText } from '@/hooks';
import { InvitationModalContext } from '@/pages/dashboard/a/firms/_components/InvitationModal';
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
	IconCheck,
	IconChevronLeft,
	IconChevronRight,
	IconCopy,
	IconDownload,
	IconFileSearch,
	IconHelpHexagon,
	IconSearch,
} from '@tabler/icons-react';

import classes from '../styles.module.css';

export interface FirmApplicationsTableProps extends TableProps {
	firmApplications: IPaginatedFirmApplicationsContext;
}
export const FirmApplicationsTable = ({
	firmApplications,

	className,
	...props
}: FirmApplicationsTableProps) => {
	const t = useTranslations();
	const isMobile = useMediaQuery('(max-width: 48em)');
	const tableContainerRef = useRef<HTMLTableElement>(null);
	const paginationText = useKeysetPaginationText('firmApplications', firmApplications);

	const invitationModal = useContext(InvitationModalContext);

	const [searchFilter, setSearchFilter] = useState('');
	const [sectorFilter, sectorFilterHandlers] = useListState<AuctionCategory>([]);

	//	Generate the filter badges
	const filterBadges = useMemo(() => {
		if (!firmApplications) return null;
		const output = [];

		switch (firmApplications.status) {
			case 'approved':
				output.push(
					<Pill
						key={'approved'}
						className={classes.badge}
						onRemove={() => firmApplications.setStatus('all')}
						withRemoveButton
					>
						{t('components.firmApplicationsTable.filters.badges.approved')}
					</Pill>,
				);
				break;
			case 'pending':
				output.push(
					<Pill
						key={'pending'}
						className={classes.badge}
						onRemove={() => firmApplications.setStatus('all')}
						withRemoveButton
					>
						{t('components.firmApplicationsTable.filters.badges.pending')}
					</Pill>,
				);
				break;
			case 'rejected':
				output.push(
					<Pill
						key={'rejected'}
						className={classes.badge}
						onRemove={() => firmApplications.setStatus('all')}
						withRemoveButton
					>
						{t('components.firmApplicationsTable.filters.badges.rejected')}
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
					{t('components.firmApplicationsTable.filters.badges.all')}
				</Pill>
			);
		return output;
	}, [firmApplications, sectorFilter, t]);

	const handlePrevPage = useCallback(() => {
		if (!firmApplications.data.hasPrev) return;
		tableContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
		firmApplications.setCursor(firmApplications.data.cursorForPrevPage);
	}, [firmApplications, tableContainerRef]);

	const handleNextPage = useCallback(() => {
		if (!firmApplications.data.hasNext) return;
		tableContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
		firmApplications.setCursor(firmApplications.data.cursorForNextPage);
	}, [firmApplications, tableContainerRef]);

	//	Reset the page when the filter or per page changes
	useEffect(
		() => firmApplications.setCursor(null),
		[firmApplications.status, sectorFilter, firmApplications.perPage],
	);

	return (
		<Stack className={`${classes.root} ${className}`}>
			<Stack className={classes.header}>
				<Group className={classes.row}>
					<Group className={classes.label}>
						<Title order={2} className={classes.title}>
							{t('components.firmApplicationsTable.title')}
						</Title>
						<Text className={classes.subtitle}>{paginationText}</Text>
					</Group>
					<Group className={classes.settings}>
						<Text className={classes.label}>
							{t('constants.pagination.perPage.label')}
						</Text>
						<Select
							className={classes.dropdown}
							w={80}
							value={firmApplications.perPage.toString()}
							data={['10', '20', '50', '100']}
							onChange={(value) => firmApplications.setPerPage(Number(value))}
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
									{t(
										'components.firmApplicationsTable.filters.menu.status.label',
									)}
								</Menu.Label>
								<Radio.Group
									value={firmApplications.status}
									onChange={(value) =>
										firmApplications.setStatus(value as FirmApplicationsFilter)
									}
								>
									<Stack className={classes.options}>
										<Radio
											value="all"
											label={t(
												'components.firmApplicationsTable.filters.menu.status.all',
											)}
										/>
										<Radio
											value="approved"
											label={t(
												'components.firmApplicationsTable.filters.menu.status.approved',
											)}
										/>
										<Radio
											value="pending"
											label={t(
												'components.firmApplicationsTable.filters.menu.status.pending',
											)}
										/>
										<Radio
											value="rejected"
											label={t(
												'components.firmApplicationsTable.filters.menu.status.rejected',
											)}
										/>
									</Stack>
								</Radio.Group>
								<Menu.Divider className={classes.divider} />
								<Menu.Label className={classes.label}>
									{t(
										'components.firmApplicationsTable.filters.menu.sector.label',
									)}
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
						<Tooltip label={t('constants.download.applications')}>
							<ActionIcon className={classes.button}>
								<IconDownload size={16} />
							</ActionIcon>
						</Tooltip>
					</Group>
				</Group>
				<Group className={`${classes.row} ${classes.wrapMobile}`}>
					<Group className={classes.filters}>
						<Text className={classes.label}>
							{t('components.firmApplicationsTable.filters.label')}
						</Text>
						<Group className={classes.group}>{filterBadges}</Group>
					</Group>
					<Group className={classes.legend}>
						<Group className={classes.cell}>
							<IconHelpHexagon
								size={16}
								className={`${classes.icon} ${classes.unverified}`}
							/>
							<Text className={classes.value}>
								{t('components.firmApplicationsTable.legend.pending.label')}
							</Text>
						</Group>
					</Group>
				</Group>
				<Divider className={classes.divider} />
				<Group className={`${classes.row} ${classes.wrapMobile}`}>
					<TextInput
						className={classes.search}
						placeholder={t('components.firmApplicationsTable.search.placeholder')}
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
					<Group className={classes.actions}></Group>
				</Group>
			</Stack>
			{/* @ts-expect-error - data table props from library are not exposed */}
			<DataTable
				className={classes.table}
				groups={[
					{
						id: 'company',
						title: t('components.firmApplicationsTable.groups.company'),
						columns: [
							{
								accessor: 'name',
								sortable: true,
								title: t('components.firmApplicationsTable.columns.name'),
								width: 240,
								ellipsis: true,
								render: (record) => (
									<Group className={`${classes.firm} ${classes.between}`}>
										<Text className={classes.anchor}>{record.companyName}</Text>
										<Group className={classes.group}>
											{record.status === 'pending' && (
												<Tooltip
													label={t(
														'components.firmApplicationsTable.legend.pending.tooltip',
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
									</Group>
								),
							},
							{
								accessor: 'sectors',
								sortable: false,
								title: t('components.firmApplicationsTable.columns.sectors'),
								width: 180,
								render: (record) => {
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
														<HoverCard.Dropdown
															className={classes.HoverCard}
														>
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
								accessor: 'crn',
								sortable: true,
								title: t('components.firmApplicationsTable.columns.crn'),
								width: 180,
								render: (record) => (
									<Group className={classes.between}>
										<Text>{record.crn}</Text>
										<CopyButton value={record.crn.toString()} timeout={2000}>
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
									</Group>
								),
							},
							{
								accessor: 'iban',
								sortable: true,
								title: t('components.firmApplicationsTable.columns.iban'),
								width: 180,
								render: (record) => (
									<Group className={classes.between}>
										<Text>{record.iban}</Text>
										<CopyButton value={record.iban} timeout={2000}>
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
									</Group>
								),
							},
						],
					},
					{
						id: 'miscellaneous',
						title: t('components.firmApplicationsTable.groups.miscellaneous'),
						columns: [
							{
								accessor: 'status',
								sortable: false,
								title: t('components.firmApplicationsTable.columns.status'),
								width: 160,
								cellsClassName: classes.status,
								render: (record) => <FirmStatusBadge status={record.status} />,
							},
							{
								accessor: 'createdAt',
								sortable: true,
								title: t('components.firmApplicationsTable.columns.createdAt'),
								render: (record) =>
									DateTime.fromISO(record.createdAt).toLocaleString(
										DateTime.DATETIME_SHORT,
									),
							},
						],
					},
					{
						id: 'representative',
						title: t('components.firmApplicationsTable.groups.representative'),
						columns: [
							{
								accessor: 'repName',
								sortable: true,
								title: t('components.firmApplicationsTable.columns.repName'),
								width: 280,
								ellipsis: true,
								render: (record) => record.repName,
							},
							{
								accessor: 'repPosition',
								sortable: true,
								title: t('components.firmApplicationsTable.columns.repPosition'),
								width: 160,
								ellipsis: true,
								render: (record) => record.repPosition || t('constants.na'),
							},
							{
								accessor: 'repEmail',
								sortable: true,
								title: t('components.firmApplicationsTable.columns.email'),
								width: 200,
								ellipsis: true,
								render: (record) => (
									<Anchor
										href={`mailto:${record.repEmail}`}
										className={classes.anchor}
									>
										{record.repEmail}
									</Anchor>
								),
							},
							{
								accessor: 'repPhone',
								sortable: true,
								title: t('components.firmApplicationsTable.columns.phone'),
								render: (record) => (
									<Anchor
										href={`tel:${record.repPhone}`}
										className={classes.anchor}
									>
										{record.repPhone}
									</Anchor>
								),
							},
							{
								accessor: 'websites',
								sortable: true,
								title: t('components.firmApplicationsTable.columns.websites'),
								width: 240,
								ellipsis: true,
								render: (record) =>
									record.websites.length > 0 ? (
										<Anchor
											href={record.websites[0]}
											className={classes.anchor}
										>
											{record.websites[0]}
										</Anchor>
									) : (
										t('constants.na')
									),
							},
							{
								accessor: 'address',
								sortable: true,
								title: t('components.firmApplicationsTable.columns.address'),
								width: 320,
								ellipsis: true,
								render: (record) => record.address || t('constants.na'),
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
												'components.firmApplicationsTable.columns.actions.review.tooltip',
											)}
											position="top"
										>
											<Button
												className={`${classes.primary} ${classes.button}`}
												onClick={() => invitationModal.open(record)}
												rightSection={<IconFileSearch size={16} />}
												disabled={record.status !== 'pending'}
											>
												{t(
													isMobile
														? 'constants.actions.review.label'
														: 'components.firmApplicationsTable.actions.review.default',
												)}
											</Button>
										</Tooltip>
									</Group>
								),
							},
						],
					},
				]}
				records={firmApplications.data.results}
				striped
				withRowBorders
				withColumnBorders
				highlightOnHover
				pinLastColumn
				fetching={firmApplications.isLoading}
				idAccessor="id"
				noRecordsText={t('components.firmApplicationsTable.empty')}
				scrollViewportRef={tableContainerRef}
				{...props}
			/>
			<Group className={classes.footer}>
				<Group className={classes.pagination}>
					<ActionIcon
						className={classes.button}
						variant="outline"
						disabled={!firmApplications.data.hasPrev}
						onClick={handlePrevPage}
					>
						<IconChevronLeft size={16} />
					</ActionIcon>
					<ActionIcon
						className={classes.button}
						variant="outline"
						disabled={!firmApplications.data.hasNext}
						onClick={handleNextPage}
					>
						<IconChevronRight size={16} />
					</ActionIcon>
				</Group>
			</Group>
		</Stack>
	);
};
