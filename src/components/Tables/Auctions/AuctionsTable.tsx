'use client';

import { DataTable } from 'mantine-datatable';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { IPaginatedAuctionsContext } from '@/contexts';
import { useOffsetPaginationText } from '@/hooks';
import { IAuctionStatus } from '@/pages/marketplace/(home)/@catalogue/constants';
import { AuctionCategory } from '@/types';
import {
	ActionIcon,
	Checkbox,
	Divider,
	Group,
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
import { useMediaQuery } from '@mantine/hooks';
import {
	IconAdjustments,
	IconDownload,
	IconHelpHexagon,
	IconHexagonLetterS,
	IconSearch,
} from '@tabler/icons-react';

import classes from '../styles.module.css';

export interface AuctionsTableProps extends TableProps {
	auctions: IPaginatedAuctionsContext;
}
export const AuctionsTable = ({
	auctions,

	className,
	...props
}: AuctionsTableProps) => {
	const t = useTranslations();
	const isMobile = useMediaQuery('(max-width: 48em)');
	const tableContainerRef = useRef<HTMLTableElement>(null);
	const paginationText = useOffsetPaginationText('auctions', auctions);

	const [searchFilter, setSearchFilter] = useState('');

	//	Generate the filter badges
	const filterBadges = useMemo(() => {
		if (!auctions) return null;
		const output = [];

		switch (auctions.filters.status) {
			case 'upcoming':
				output.push(
					<Pill
						key={'upcoming'}
						className={classes.badge}
						onRemove={() => auctions.setSingleFilter('status', 'all')}
						withRemoveButton
					>
						{t('components.auctionsTable.filters.badges.upcoming')}
					</Pill>,
				);
				break;
			case 'ongoing':
				output.push(
					<Pill
						key={'ongoing'}
						className={classes.badge}
						onRemove={() => auctions.setSingleFilter('status', 'all')}
						withRemoveButton
					>
						{t('components.auctionsTable.filters.badges.ongoing')}
					</Pill>,
				);
				break;
			case 'ended':
				output.push(
					<Pill
						key={'ended'}
						className={classes.badge}
						onRemove={() => auctions.setSingleFilter('status', 'all')}
						withRemoveButton
					>
						{t('components.auctionsTable.filters.badges.ended')}
					</Pill>,
				);
				break;
		}

		if (output.length === 0)
			return (
				<Pill className={classes.badge}>
					{t('components.auctionsTable.filters.badges.all')}
				</Pill>
			);
		return output;
	}, [auctions, t]);

	const handleChangePage = useCallback(
		(newPage: number) => {
			tableContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
			auctions.setPage(newPage);
		},
		[auctions],
	);

	//	Reset the page when the filter or per page changes
	useEffect(() => auctions.setPage(1), [auctions.filters, auctions.perPage]);

	return (
		<Stack className={`${classes.root} ${className}`}>
			<Stack className={classes.header}>
				<Group className={`${classes.row} ${classes.wrapMobile}`}>
					<Group className={classes.label}>
						<Title order={2} className={classes.title}>
							{t('components.auctionsTable.title')}
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
							value={auctions.perPage.toString()}
							data={['10', '20', '50', '100']}
							onChange={(value) => auctions.setPerPage(Number(value))}
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
									{t('components.auctionsTable.filters.menu.status.label')}
								</Menu.Label>
								<Radio.Group
									value={auctions.filters.status}
									onChange={(value) =>
										auctions.setSingleFilter('status', value as IAuctionStatus)
									}
								>
									<Stack className={classes.options}>
										<Radio
											value="upcoming"
											label={t(
												'components.auctionsTable.filters.menu.status.upcoming',
											)}
										/>
										<Radio
											value="ongoing"
											label={t(
												'components.auctionsTable.filters.menu.status.ongoing',
											)}
										/>
										<Radio
											value="ended"
											label={t(
												'components.auctionsTable.filters.menu.status.ended',
											)}
										/>
										<Radio
											value="all"
											label={t(
												'components.auctionsTable.filters.menu.status.all',
											)}
										/>
									</Stack>
								</Radio.Group>
								<Menu.Divider className={classes.divider} />
								<Menu.Label className={classes.label}>
									{t('components.auctionsTable.filters.menu.sector.label')}
								</Menu.Label>
								<Checkbox.Group
									value={auctions.filters.sector}
									onChange={(values) =>
										auctions.setArrayFilter(
											'sector',
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
						<Tooltip label={t('constants.download.auctions')}>
							<ActionIcon className={classes.button}>
								<IconDownload size={16} />
							</ActionIcon>
						</Tooltip>
					</Group>
				</Group>
				<Group className={`${classes.row} ${classes.wrapMobile}`}>
					<Group className={classes.filters}>
						<Text className={classes.label}>
							{t('components.auctionsTable.filters.label')}
						</Text>
						<Group className={classes.group}>{filterBadges}</Group>
					</Group>
					<Group className={classes.legend}>
						<Group className={classes.cell}>
							<IconHexagonLetterS
								size={16}
								className={`${classes.icon} ${classes.sealed}`}
							/>
							<Text className={classes.value}>
								{t('components.auctionsTable.legend.sealed.label')}
							</Text>
						</Group>
					</Group>
				</Group>
				<Divider className={classes.divider} />
				<Group className={`${classes.row} ${classes.wrapMobile}`}>
					<TextInput
						className={classes.search}
						placeholder={t('components.auctionsTable.search.placeholder')}
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
						id: 'details',
						title: t('components.auctionsTable.groups.details'),
						columns: [
							{
								accessor: 'title',
								sortable: true,
								title: t('components.auctionsTable.columns.name'),
								width: 240,
								ellipsis: true,
								render: (record) => (
									<Group className={`${classes.firm} ${classes.between}`}>
										<Text className={classes.anchor}>{record.title}</Text>
										<Group className={classes.group}>
											{record.type === 'sealed' && (
												<Tooltip
													label={t(
														'components.auctionsTable.legend.sealed.tooltip',
													)}
													position="top"
												>
													<IconHexagonLetterS
														size={14}
														className={classes.sealed}
													/>
												</Tooltip>
											)}
										</Group>
									</Group>
								),
							},
						],
					},
					// {
					// 	id: 'economic'
					// 	//	Min bid, min increment
					// },
					// {
					// 	id: 'permit',
					// 	//	sector, permits offered, emissions per permit, total emissions, permit lifespan
					// },
					// {
					// 	id: 'miscellaneous',
					// 	//	Number of views, bidders, bids, bookmarks
					// 	//	Creation date
					// },
					// {
					// 	id: 'owner'
					// 	//	Name
					// 	//	Email
					// 	//	Is government
					// },
					// {
					// 	id: 'miscellaneous',
					// 	title: t('components.firmApplicationsTable.groups.miscellaneous'),
					// 	columns: [
					// 		{
					// 			accessor: 'status',
					// 			sortable: false,
					// 			title: t('components.firmApplicationsTable.columns.status'),
					// 			width: 160,
					// 			cellsClassName: classes.status,
					// 			render: (record) => <FirmStatusBadge status={record.status} />,
					// 		},
					// 		{
					// 			accessor: 'createdAt',
					// 			sortable: true,
					// 			title: t('components.firmApplicationsTable.columns.createdAt'),
					// 			render: (record) =>
					// 				DateTime.fromISO(record.createdAt).toLocaleString(
					// 					DateTime.DATETIME_SHORT,
					// 				),
					// 		},
					// 	],
					// },
					// {
					// 	id: 'representative',
					// 	title: t('components.firmApplicationsTable.groups.representative'),
					// 	columns: [
					// 		{
					// 			accessor: 'repName',
					// 			sortable: true,
					// 			title: t('components.firmApplicationsTable.columns.repName'),
					// 			width: 280,
					// 			ellipsis: true,
					// 			render: (record) => record.repName,
					// 		},
					// 		{
					// 			accessor: 'repPosition',
					// 			sortable: true,
					// 			title: t('components.firmApplicationsTable.columns.repPosition'),
					// 			width: 160,
					// 			ellipsis: true,
					// 			render: (record) => record.repPosition || t('constants.na'),
					// 		},
					// 		{
					// 			accessor: 'repEmail',
					// 			sortable: true,
					// 			title: t('components.firmApplicationsTable.columns.email'),
					// 			width: 200,
					// 			ellipsis: true,
					// 			render: (record) => (
					// 				<Anchor
					// 					href={`mailto:${record.repEmail}`}
					// 					className={classes.anchor}
					// 				>
					// 					{record.repEmail}
					// 				</Anchor>
					// 			),
					// 		},
					// 		{
					// 			accessor: 'repPhone',
					// 			sortable: true,
					// 			title: t('components.firmApplicationsTable.columns.phone'),
					// 			render: (record) => (
					// 				<Anchor
					// 					href={`tel:${record.repPhone}`}
					// 					className={classes.anchor}
					// 				>
					// 					{record.repPhone}
					// 				</Anchor>
					// 			),
					// 		},
					// 		{
					// 			accessor: 'websites',
					// 			sortable: true,
					// 			title: t('components.firmApplicationsTable.columns.websites'),
					// 			width: 240,
					// 			ellipsis: true,
					// 			render: (record) =>
					// 				record.websites.length > 0 ? (
					// 					<Anchor
					// 						href={record.websites[0]}
					// 						className={classes.anchor}
					// 					>
					// 						{record.websites[0]}
					// 					</Anchor>
					// 				) : (
					// 					t('constants.na')
					// 				),
					// 		},
					// 		{
					// 			accessor: 'address',
					// 			sortable: true,
					// 			title: t('components.firmApplicationsTable.columns.address'),
					// 			width: 320,
					// 			ellipsis: true,
					// 			render: (record) => record.address || t('constants.na'),
					// 		},
					// 	],
					// },
					// {
					// 	id: 'actions',
					// 	title: '',
					// 	className: classes.actions,
					// 	columns: [
					// 		{
					// 			accessor: 'actions',
					// 			title: t('constants.actions.actions.column'),
					// 			titleClassName: classes.actions,
					// 			cellsClassName: classes.actions,
					// 			render: (record) => (
					// 				<Group className={classes.cell}>
					// 					<Tooltip
					// 						label={t(
					// 							'components.firmApplicationsTable.columns.actions.review.tooltip',
					// 						)}
					// 						position="top"
					// 					>
					// 						<Button
					// 							className={`${classes.primary} ${classes.button}`}
					// 							onClick={() => invitationModal.open(record)}
					// 							rightSection={<IconFileSearch size={16} />}
					// 							disabled={record.status !== 'pending'}
					// 						>
					// 							{t(
					// 								isMobile
					// 									? 'constants.actions.review.label'
					// 									: 'components.firmApplicationsTable.actions.review.default',
					// 							)}
					// 						</Button>
					// 					</Tooltip>
					// 				</Group>
					// 			),
					// 		},
					// 	],
					// },
				]}
				records={auctions.data.results}
				striped
				withRowBorders
				withColumnBorders
				highlightOnHover
				pinLastColumn
				fetching={auctions.isLoading}
				idAccessor="id"
				noRecordsText={t('components.auctionsTable.empty')}
				scrollViewportRef={tableContainerRef}
				{...props}
			/>
			<Group className={classes.footer}>
				{auctions.isSuccess && (
					<Pagination
						className={classes.pagination}
						value={auctions.page}
						total={auctions.data.pageCount}
						siblings={2}
						boundaries={3}
						onChange={handleChangePage}
					/>
				)}
			</Group>
		</Stack>
	);
};
