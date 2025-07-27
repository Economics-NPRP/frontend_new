'use client';

import { DateTime } from 'luxon';
import { DataTable } from 'mantine-datatable';
import { useTranslations } from 'next-intl';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { FirmStatusBadge, SectorBadge } from '@/components/Badge';
import { SummaryTableGroup } from '@/components/SummaryTable';
import { FirmApplicationsFilter } from '@/components/Tables/FirmApplications/types';
import {
	SelectionSummaryContext,
	SelectionSummaryProvider,
} from '@/components/Tables/_components/SelectionSummary';
import { SectorVariants } from '@/constants/SectorData';
import { IPaginatedFirmApplicationsContext } from '@/contexts';
import { withProviders } from '@/helpers';
import { useKeysetPaginationText } from '@/hooks';
import { InvitationModalContext } from '@/pages/dashboard/a/firms/_components/InvitationModal';
import { IFirmApplication, SectorType } from '@/schema/models';
import {
	ActionIcon,
	Alert,
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
	IconFilterSearch,
	IconHelpHexagon,
	IconInfoCircle,
	IconReportAnalytics,
	IconSearch,
} from '@tabler/icons-react';

import classes from '../styles.module.css';

export interface FirmApplicationsTableProps extends TableProps {
	firmApplications: IPaginatedFirmApplicationsContext;
}
const _FirmApplicationsTable = ({
	firmApplications,

	className,
	...props
}: FirmApplicationsTableProps) => {
	const t = useTranslations();
	const isMobile = useMediaQuery('(max-width: 48em)');
	const tableContainerRef = useRef<HTMLTableElement>(null);
	const paginationText = useKeysetPaginationText('firmApplications', firmApplications);

	const invitationModal = useContext(InvitationModalContext);
	const { open } = useContext(SelectionSummaryContext);

	const [showSelectedOnly, setShowSelectedOnly] = useState(false);
	const [searchFilter, setSearchFilter] = useState('');
	const [sectorFilter, sectorFilterHandlers] = useListState<SectorType>([]);
	const [selectedApplications, selectedApplicationsHandlers] = useListState<IFirmApplication>([]);

	//	Generate the filter badges
	const filterBadges = useMemo(() => {
		if (!firmApplications) return null;
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
				<SectorBadge
					key={sector}
					sector={sector}
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
	}, [firmApplications, showSelectedOnly, sectorFilter, sectorFilterHandlers, t]);

	const generateSummaryGroups = useMemo(
		() => (selected: Array<IFirmApplication>) => [
			{
				title: t('components.firmApplicationsTable.summary.distribution.title'),
				rows: [
					{
						label: t('components.firmApplicationsTable.summary.distribution.total'),
						value: t('constants.quantities.applications.default', {
							value: selected.length,
						}),
					},
					{
						label: t('components.firmApplicationsTable.summary.distribution.approved'),
						value: t('constants.quantities.applications.default', {
							value: selected.filter((record) => record.status === 'approved').length,
						}),
					},
					{
						label: t('components.firmApplicationsTable.summary.distribution.pending'),
						value: t('constants.quantities.applications.default', {
							value: selected.filter((record) => record.status === 'pending').length,
						}),
					},
					{
						label: t('components.firmApplicationsTable.summary.distribution.rejected'),
						value: t('constants.quantities.applications.default', {
							value: selected.filter((record) => record.status === 'rejected').length,
						}),
					},
				],
			},
			{
				title: t('components.firmApplicationsTable.summary.sector.title'),
				rows: [
					{
						label: t('components.firmApplicationsTable.summary.sector.energy'),
						value: t('constants.quantities.applications.default', {
							value: selected.filter((record) => record.sectors.includes('energy'))
								.length,
						}),
					},
					{
						label: t('components.firmApplicationsTable.summary.sector.industry'),
						value: t('constants.quantities.applications.default', {
							value: selected.filter((record) => record.sectors.includes('industry'))
								.length,
						}),
					},
					{
						label: t('components.firmApplicationsTable.summary.sector.transport'),
						value: t('constants.quantities.applications.default', {
							value: selected.filter((record) => record.sectors.includes('transport'))
								.length,
						}),
					},
					{
						label: t('components.firmApplicationsTable.summary.sector.buildings'),
						value: t('constants.quantities.applications.default', {
							value: selected.filter((record) => record.sectors.includes('buildings'))
								.length,
						}),
					},
					{
						label: t('components.firmApplicationsTable.summary.sector.agriculture'),
						value: t('constants.quantities.applications.default', {
							value: selected.filter((record) =>
								record.sectors.includes('agriculture'),
							).length,
						}),
					},
					{
						label: t('components.firmApplicationsTable.summary.sector.waste'),
						value: t('constants.quantities.applications.default', {
							value: selected.filter((record) => record.sectors.includes('waste'))
								.length,
						}),
					},
				],
			},
			{
				title: t('components.firmApplicationsTable.summary.numSectors.title'),
				rows: [
					{
						label: t('components.table.selected.summary.min'),
						value: t('constants.quantities.sectors.default', {
							value: Math.min(...selected.map((record) => record.sectors.length)),
						}),
					},
					{
						label: t('components.table.selected.summary.avg'),
						value: t('constants.quantities.sectors.decimals', {
							value:
								selected.reduce((acc, record) => acc + record.sectors.length, 0) /
								selected.length,
						}),
					},
					{
						label: t('components.table.selected.summary.max'),
						value: t('constants.quantities.sectors.default', {
							value: Math.max(...selected.map((record) => record.sectors.length)),
						}),
					},
				],
			},
			{
				title: t('components.firmApplicationsTable.summary.createdDate.title'),
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

	//	If we are showing selected only and there are no selected auctions, disable the filter
	useEffect(() => {
		if (showSelectedOnly && selectedApplications.length === 0) setShowSelectedOnly(false);
	}, [showSelectedOnly, selectedApplications.length]);

	return (
		<Stack className={`${classes.root} ${className}`}>
			<Stack className={classes.header}>
				<Group className={`${classes.row} ${classes.wrapMobile}`}>
					<Group className={classes.label}>
						<Title order={2} className={classes.title}>
							{t('components.firmApplicationsTable.title')}
						</Title>
						<Text className={classes.subtitle}>
							{showSelectedOnly
								? t('components.table.selected.paginationText', {
										value: selectedApplications.length,
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
							value={firmApplications.perPage.toString()}
							data={['10', '20', '50', '100']}
							onChange={(value) => firmApplications.setPerPage(Number(value))}
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
										sectorFilterHandlers.setState(values as Array<SectorType>)
									}
								>
									<Stack className={classes.options}>
										<Checkbox
											className={classes.checkbox}
											value="energy"
											label={t('constants.sector.energy.title')}
										/>
										<Checkbox
											className={classes.checkbox}
											value="industry"
											label={t('constants.sector.industry.title')}
										/>
										<Checkbox
											className={classes.checkbox}
											value="transport"
											label={t('constants.sector.transport.title')}
										/>
										<Checkbox
											className={classes.checkbox}
											value="buildings"
											label={t('constants.sector.buildings.title')}
										/>
										<Checkbox
											className={classes.checkbox}
											value="agriculture"
											label={t('constants.sector.agriculture.title')}
										/>
										<Checkbox
											className={classes.checkbox}
											value="waste"
											label={t('constants.sector.waste.title')}
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
							onRemove={() => selectedApplicationsHandlers.setState([])}
							withRemoveButton={selectedApplications.length > 0}
						>
							{t('components.table.selected.count', {
								value: selectedApplications.length,
							})}
						</Pill>
						<Group className={classes.buttons}>
							<Button
								className={`${classes.secondary} ${classes.button}`}
								variant="outline"
								disabled={selectedApplications.length === 0}
								rightSection={<IconReportAnalytics size={16} />}
								onClick={() =>
									open(
										selectedApplications,
										generateSummaryGroups as () => Array<SummaryTableGroup>,
									)
								}
							>
								{t('components.table.selected.viewSummary')}
							</Button>
							<Button
								className={`${classes.secondary} ${classes.button}`}
								variant="outline"
								disabled={selectedApplications.length === 0}
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
				{firmApplications.isSuccess && !showSelectedOnly && (
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
				)}
			</Group>
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
														SectorVariants[
															sector.toLowerCase() as SectorType
														],
												)
												.map((sector) => (
													<SectorBadge key={sector} sector={sector} />
												)),
										[record.sectors],
									);

									return (
										<HoverCard position="top" disabled={badges.length <= 1}>
											<HoverCard.Target>
												<Group className={classes.group}>
													{badges[0]}
													{badges.length > 1 && (
														<Badge variant="light">
															+{badges.length - 1}
														</Badge>
													)}
												</Group>
											</HoverCard.Target>
											<HoverCard.Dropdown className="flex flex-row gap-1">
												{badges.slice(1).map((badge) => badge)}
											</HoverCard.Dropdown>
										</HoverCard>
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
								sortable: true,
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
							{
								accessor: 'message',
								sortable: false,
								title: t('components.firmApplicationsTable.columns.message'),
								width: 480,
								ellipsis: true,
								render: (record) => (
									<HoverCard>
										<HoverCard.Target>
											<Text>{record.message}</Text>
										</HoverCard.Target>
										<HoverCard.Dropdown className="max-w-[80vw] max-h-[80vh] overflow-y-auto">
											<Text>{record.message}</Text>
										</HoverCard.Dropdown>
									</HoverCard>
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
												`components.firmApplicationsTable.columns.actions.${record.status === 'pending' ? 'review' : 'resend'}.tooltip`,
											)}
											position="top"
										>
											<Button
												className={`${classes.primary} ${classes.button}`}
												onClick={() => invitationModal.open(record)}
												rightSection={<IconFileSearch size={16} />}
											>
												{t(
													isMobile
														? `constants.actions.${record.status === 'pending' ? 'review' : 'resend'}.label`
														: `components.firmApplicationsTable.actions.${record.status === 'pending' ? 'review' : 'resend'}.default`,
												)}
											</Button>
										</Tooltip>
									</Group>
								),
							},
						],
					},
				]}
				records={showSelectedOnly ? selectedApplications : firmApplications.data.results}
				striped
				withRowBorders
				withColumnBorders
				highlightOnHover
				pinLastColumn
				selectedRecords={selectedApplications}
				onSelectedRecordsChange={selectedApplicationsHandlers.setState}
				selectionColumnClassName={classes.selection}
				fetching={firmApplications.isLoading}
				idAccessor="id"
				noRecordsText={t('components.firmApplicationsTable.empty')}
				scrollViewportRef={tableContainerRef}
				{...props}
			/>
			<Group className={classes.footer}>
				{firmApplications.isSuccess && !showSelectedOnly && (
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
				)}
			</Group>
		</Stack>
	);
};
export const FirmApplicationsTable = (props: FirmApplicationsTableProps) =>
	withProviders(<_FirmApplicationsTable {...props} />, { provider: SelectionSummaryProvider });
