'use client';

import { DateTime } from 'luxon';
import { DataTable } from 'mantine-datatable';
import { useFormatter, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';

import {
	AuctionStatusBadge,
	AuctionTypeBadge,
	CurrencyBadge,
	SectorBadge,
} from '@/components/Badge';
import { SummaryTableGroup } from '@/components/SummaryTable';
import { TablePagination } from '@/components/Tables/_components/Pagination';
import {
	SelectionSummaryContext,
	SelectionSummaryProvider,
} from '@/components/Tables/_components/SelectionSummary';
import { IPaginatedAuctionsContext } from '@/contexts';
import { withProviders } from '@/helpers';
import { ENDING_SOON_THRESHOLD, useOffsetPaginationText } from '@/hooks';
import { IAuctionStatus } from '@/pages/marketplace/(home)/@catalogue/constants';
import { IAuctionData, SectorType } from '@/schema/models';
import {
	ActionIcon,
	Alert,
	Anchor,
	Button,
	Checkbox,
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
	IconArrowUpRight,
	IconBuildingStore,
	IconDownload,
	IconFilterSearch,
	IconHelpHexagon,
	IconHexagonLetterO,
	IconInfoCircle,
	IconInfoHexagon,
	IconReportAnalytics,
	IconSearch,
} from '@tabler/icons-react';

import classes from '../styles.module.css';

export interface AuctionsTableProps extends TableProps {
	auctions: IPaginatedAuctionsContext;
}
const _AuctionsTable = ({
	auctions,

	className,
	...props
}: AuctionsTableProps) => {
	const t = useTranslations();
	const format = useFormatter();
	const isMobile = useMediaQuery('(max-width: 48em)');
	const tableContainerRef = useRef<HTMLTableElement>(null);
	const paginationText = useOffsetPaginationText('auctions', auctions);
	const { open } = useContext(SelectionSummaryContext);

	const [showSelectedOnly, setShowSelectedOnly] = useState(false);
	const [searchFilter, setSearchFilter] = useState('');
	const [selectedAuctions, selectedAuctionsHandlers] = useListState<IAuctionData>([]);

	//	Generate the filter badges
	const filterBadges = useMemo(() => {
		if (!auctions) return null;
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

		if (auctions.filters.type)
			output.push(
				...auctions.filters.type.map((type, index) => (
					<Pill
						key={`type-${index}`}
						className={classes.badge}
						onRemove={() =>
							auctions.setArrayFilter(
								'type',
								(auctions.filters.type || []).filter((t) => t !== type),
							)
						}
						withRemoveButton
					>
						{t(`components.auctionsTable.filters.badges.${type}`)}
					</Pill>
				)),
			);

		if (output.length === 0)
			return (
				<Pill className={classes.badge}>
					{t('components.auctionsTable.filters.badges.all')}
				</Pill>
			);
		return output;
	}, [auctions, auctions.filters.status, auctions.filters.type, showSelectedOnly, t]);

	const generateSummaryGroups = useMemo(
		() => (selected: Array<IAuctionData>) => [
			{
				title: t('components.auctionsTable.summary.distribution.title'),
				rows: [
					{
						label: t('components.auctionsTable.summary.distribution.total'),
						value: t('constants.quantities.auctions.default', {
							value: selected.length,
						}),
					},
					{
						label: t('components.auctionsTable.summary.distribution.ending'),
						value: t('constants.quantities.auctions.default', {
							value: selected.filter(
								(record) =>
									new Date(record.endDatetime).getTime() - Date.now() <
										ENDING_SOON_THRESHOLD &&
									new Date(record.endDatetime).getTime() > Date.now(),
							).length,
						}),
					},
					{
						label: t('components.auctionsTable.summary.distribution.sealed'),
						value: t('constants.quantities.auctions.default', {
							value: selected.filter((record) => record.type === 'sealed').length,
						}),
					},
					{
						label: t('components.auctionsTable.summary.distribution.open'),
						value: t('constants.quantities.auctions.default', {
							value: selected.filter((record) => record.type === 'open').length,
						}),
					},
					{
						label: t('components.auctionsTable.summary.distribution.upcoming'),
						value: t('constants.quantities.auctions.default', {
							value: selected.filter(
								(record) => new Date(record.startDatetime).getTime() > Date.now(),
							).length,
						}),
					},
					{
						label: t('components.auctionsTable.summary.distribution.ongoing'),
						value: t('constants.quantities.auctions.default', {
							value: selected.filter(
								(record) =>
									new Date(record.startDatetime).getTime() <= Date.now() &&
									new Date(record.endDatetime).getTime() > Date.now(),
							).length,
						}),
					},
					{
						label: t('components.auctionsTable.summary.distribution.ended'),
						value: t('constants.quantities.auctions.default', {
							value: selected.filter(
								(record) => new Date(record.endDatetime).getTime() < Date.now(),
							).length,
						}),
					},
					{
						label: t('components.auctionsTable.summary.distribution.government'),
						value: t('constants.quantities.auctions.default', {
							value: selected.filter((record) => record.owner.type === 'admin')
								.length,
						}),
					},
				],
			},
			{
				title: t('components.auctionsTable.summary.sector.title'),
				rows: [
					{
						label: t('components.auctionsTable.summary.sector.energy'),
						value: t('constants.quantities.auctions.default', {
							value: selected.filter((record) => record.sector === 'energy').length,
						}),
					},
					{
						label: t('components.auctionsTable.summary.sector.industry'),
						value: t('constants.quantities.auctions.default', {
							value: selected.filter((record) => record.sector === 'industry').length,
						}),
					},
					{
						label: t('components.auctionsTable.summary.sector.transport'),
						value: t('constants.quantities.auctions.default', {
							value: selected.filter((record) => record.sector === 'transport')
								.length,
						}),
					},
					{
						label: t('components.auctionsTable.summary.sector.buildings'),
						value: t('constants.quantities.auctions.default', {
							value: selected.filter((record) => record.sector === 'buildings')
								.length,
						}),
					},
					{
						label: t('components.auctionsTable.summary.sector.agriculture'),
						value: t('constants.quantities.auctions.default', {
							value: selected.filter((record) => record.sector === 'agriculture')
								.length,
						}),
					},
					{
						label: t('components.auctionsTable.summary.sector.waste'),
						value: t('constants.quantities.auctions.default', {
							value: selected.filter((record) => record.sector === 'waste').length,
						}),
					},
				],
			},
			{
				title: t('components.auctionsTable.summary.minBid.title'),
				rows: [
					{
						label: t('components.table.selected.summary.min'),
						value: (
							<>
								<CurrencyBadge className="mr-1" />
								{format.number(
									Math.min(...selected.map((record) => record.minBid)),
									'money',
								)}
							</>
						),
					},
					{
						label: t('components.table.selected.summary.avg'),
						value: (
							<>
								<CurrencyBadge className="mr-1" />
								{format.number(
									selected.reduce((acc, record) => acc + record.minBid, 0) /
										selected.length,
									'money',
								)}
							</>
						),
					},
					{
						label: t('components.table.selected.summary.max'),
						value: (
							<>
								<CurrencyBadge className="mr-1" />
								{format.number(
									Math.max(...selected.map((record) => record.minBid)),
									'money',
								)}
							</>
						),
					},
				],
			},
			{
				//	TODO: add min increment here
				title: t('components.auctionsTable.summary.minIncrement.title'),
				rows: [
					{
						label: t('components.table.selected.summary.min'),
						value: (
							<>
								<CurrencyBadge className="mr-1" />
								{format.number(Math.min(...selected.map(() => 0)), 'money')}
							</>
						),
					},
					{
						label: t('components.table.selected.summary.avg'),
						value: (
							<>
								<CurrencyBadge className="mr-1" />
								{format.number(
									selected.reduce((acc) => acc + 0, 0) / selected.length,
									'money',
								)}
							</>
						),
					},
					{
						label: t('components.table.selected.summary.max'),
						value: (
							<>
								<CurrencyBadge className="mr-1" />
								{format.number(Math.max(...selected.map(() => 0)), 'money')}
							</>
						),
					},
				],
			},
			{
				title: t('components.auctionsTable.summary.permitsOffered.title'),
				rows: [
					{
						label: t('components.table.selected.summary.min'),
						value: (
							<>
								<CurrencyBadge className="mr-1" />
								{t('constants.quantities.permits.default', {
									value: Math.min(...selected.map((record) => record.permits)),
								})}
							</>
						),
					},
					{
						label: t('components.table.selected.summary.avg'),
						value: (
							<>
								<CurrencyBadge className="mr-1" />
								{t('constants.quantities.permits.decimals', {
									value:
										selected.reduce((acc, record) => acc + record.permits, 0) /
										selected.length,
								})}
							</>
						),
					},
					{
						label: t('components.table.selected.summary.max'),
						value: (
							<>
								<CurrencyBadge className="mr-1" />
								{t('constants.quantities.permits.default', {
									value: Math.max(...selected.map((record) => record.permits)),
								})}
							</>
						),
					},
				],
			},
			{
				//	TODO: add emissions here
				title: t('components.auctionsTable.summary.emissions.title'),
				rows: [
					{
						label: t('components.table.selected.summary.min'),
						value: (
							<>
								<CurrencyBadge className="mr-1" />
								{t('constants.quantities.emissions.default', {
									value: Math.min(...selected.map(() => 0)),
								})}
							</>
						),
					},
					{
						label: t('components.table.selected.summary.avg'),
						value: (
							<>
								<CurrencyBadge className="mr-1" />
								{t('constants.quantities.emissions.default', {
									value: selected.reduce((acc) => acc + 0, 0) / selected.length,
								})}
							</>
						),
					},
					{
						label: t('components.table.selected.summary.max'),
						value: (
							<>
								<CurrencyBadge className="mr-1" />
								{t('constants.quantities.emissions.default', {
									value: Math.max(...selected.map(() => 0)),
								})}
							</>
						),
					},
				],
			},
			{
				//	TODO: add lifespan here
				title: t('components.auctionsTable.summary.lifespan.title'),
				rows: [
					{
						label: t('components.table.selected.summary.min'),
						value: t('constants.quantities.years.default', {
							value: Math.min(...selected.map(() => 0)),
						}),
					},
					{
						label: t('components.table.selected.summary.avg'),
						value: t('constants.quantities.years.decimals', {
							value: selected.reduce((acc) => acc + 0, 0) / selected.length,
						}),
					},
					{
						label: t('components.table.selected.summary.max'),
						value: t('constants.quantities.years.default', {
							value: Math.max(...selected.map(() => 0)),
						}),
					},
				],
			},
			{
				title: t('components.auctionsTable.summary.numViews.title'),
				rows: [
					{
						label: t('components.table.selected.summary.min'),
						value: t('constants.quantities.views.default', {
							value: Math.min(...selected.map((record) => record.views)),
						}),
					},
					{
						label: t('components.table.selected.summary.avg'),
						value: t('constants.quantities.views.decimals', {
							value:
								selected.reduce((acc, record) => acc + record.views, 0) /
								selected.length,
						}),
					},
					{
						label: t('components.table.selected.summary.max'),
						value: t('constants.quantities.views.default', {
							value: Math.max(...selected.map((record) => record.views)),
						}),
					},
					{
						label: t('components.table.selected.summary.total'),
						value: t('constants.quantities.views.default', {
							value: selected.reduce((acc, record) => acc + record.views, 0),
						}),
					},
				],
			},
			{
				title: t('components.auctionsTable.summary.numBidders.title'),
				rows: [
					{
						label: t('components.table.selected.summary.min'),
						value: t('constants.quantities.bidders.default', {
							value: Math.min(...selected.map((record) => record.biddersCount)),
						}),
					},
					{
						label: t('components.table.selected.summary.avg'),
						value: t('constants.quantities.bidders.decimals', {
							value:
								selected.reduce((acc, record) => acc + record.biddersCount, 0) /
								selected.length,
						}),
					},
					{
						label: t('components.table.selected.summary.max'),
						value: t('constants.quantities.bidders.default', {
							value: Math.max(...selected.map((record) => record.biddersCount)),
						}),
					},
					{
						label: t('components.table.selected.summary.total'),
						value: t('constants.quantities.bidders.default', {
							value: selected.reduce((acc, record) => acc + record.biddersCount, 0),
						}),
					},
				],
			},
			{
				title: t('components.auctionsTable.summary.numBids.title'),
				rows: [
					{
						label: t('components.table.selected.summary.min'),
						value: t('constants.quantities.bids.default', {
							value: Math.min(...selected.map((record) => record.bidsCount)),
						}),
					},
					{
						label: t('components.table.selected.summary.avg'),
						value: t('constants.quantities.bids.decimals', {
							value:
								selected.reduce((acc, record) => acc + record.bidsCount, 0) /
								selected.length,
						}),
					},
					{
						label: t('components.table.selected.summary.max'),
						value: t('constants.quantities.bids.default', {
							value: Math.max(...selected.map((record) => record.bidsCount)),
						}),
					},
					{
						label: t('components.table.selected.summary.total'),
						value: t('constants.quantities.bids.default', {
							value: selected.reduce((acc, record) => acc + record.bidsCount, 0),
						}),
					},
				],
			},
			{
				//	TODO: add bookmark data here
				title: t('components.auctionsTable.summary.numBookmarks.title'),
				rows: [
					{
						label: t('components.table.selected.summary.min'),
						value: t('constants.quantities.bookmarks.default', {
							value: Math.min(...selected.map(() => 0)),
						}),
					},
					{
						label: t('components.table.selected.summary.avg'),
						value: t('constants.quantities.bookmarks.decimals', {
							value: selected.reduce((acc) => acc + 0, 0) / selected.length,
						}),
					},
					{
						label: t('components.table.selected.summary.max'),
						value: t('constants.quantities.bookmarks.default', {
							value: Math.max(...selected.map(() => 0)),
						}),
					},
					{
						label: t('components.table.selected.summary.total'),
						value: t('constants.quantities.bookmarks.default', {
							value: selected.reduce((acc) => acc + 0, 0),
						}),
					},
				],
			},
			{
				title: t('components.auctionsTable.summary.createdDate.title'),
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
		[t, format],
	);

	//	Reset the page when the filter or per page changes
	useEffect(() => auctions.setPage(1), [auctions.filters, auctions.perPage]);

	//	If we are showing selected only and there are no selected auctions, disable the filter
	useEffect(() => {
		if (showSelectedOnly && selectedAuctions.length === 0) setShowSelectedOnly(false);
	}, [showSelectedOnly, selectedAuctions.length]);

	return (
		<Stack className={`${classes.root} ${className}`}>
			<Stack className={classes.header}>
				<Group className={`${classes.row} ${classes.wrapMobile}`}>
					<Group className={classes.label}>
						<Title order={2} className={classes.title}>
							{t('components.auctionsTable.title')}
						</Title>
						<Text className={classes.subtitle}>
							{showSelectedOnly
								? t('components.table.selected.paginationText', {
										value: selectedAuctions.length,
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
							value={auctions.perPage.toString()}
							data={['10', '20', '50', '100']}
							onChange={(value) => auctions.setPerPage(Number(value))}
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
									{t('components.auctionsTable.filters.menu.type.label')}
								</Menu.Label>
								<Checkbox.Group
									value={auctions.filters.type}
									onChange={(values) =>
										auctions.setArrayFilter(
											'type',
											values as Array<IAuctionStatus>,
										)
									}
								>
									<Stack className={classes.options}>
										<Checkbox
											className={classes.checkbox}
											value="open"
											label={t('constants.auctionType.open')}
										/>
										<Checkbox
											className={classes.checkbox}
											value="sealed"
											label={t('constants.auctionType.sealed')}
										/>
									</Stack>
								</Checkbox.Group>
								<Menu.Divider className={classes.divider} />
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
											values as Array<SectorType>,
										)
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
							<IconHelpHexagon
								size={16}
								className={`${classes.icon} ${classes.draftCycle}`}
							/>
							<Text className={classes.value}>
								{t('components.auctionsTable.legend.draftCycle.label')}
							</Text>
						</Group>
						<Group className={classes.cell}>
							<IconHexagonLetterO
								size={16}
								className={`${classes.icon} ${classes.ongoingCycle}`}
							/>
							<Text className={classes.value}>
								{t('components.auctionsTable.legend.ongoingCycle.label')}
							</Text>
						</Group>
						<Group className={classes.cell}>
							<IconInfoHexagon
								size={16}
								className={`${classes.icon} ${classes.secondaryMarket}`}
							/>
							<Text className={classes.value}>
								{t('components.auctionsTable.legend.secondaryMarket.label')}
							</Text>
						</Group>
						<Group className={classes.cell}>
							<IconAlertHexagon
								size={16}
								className={`${classes.icon} ${classes.ending}`}
							/>
							<Text className={classes.value}>
								{t('components.auctionsTable.legend.ending.label')}
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
							onRemove={() => selectedAuctionsHandlers.setState([])}
							withRemoveButton={selectedAuctions.length > 0}
						>
							{t('components.table.selected.count', {
								value: selectedAuctions.length,
							})}
						</Pill>
						<Group className={classes.buttons}>
							<Button
								className={`${classes.secondary} ${classes.button}`}
								variant="outline"
								disabled={selectedAuctions.length === 0}
								rightSection={<IconReportAnalytics size={16} />}
								onClick={() =>
									open(
										selectedAuctions,
										generateSummaryGroups as () => Array<SummaryTableGroup>,
									)
								}
							>
								{t('components.table.selected.viewSummary')}
							</Button>
							<Button
								className={`${classes.secondary} ${classes.button}`}
								variant="outline"
								disabled={selectedAuctions.length === 0}
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
				{auctions.isSuccess && !showSelectedOnly && (
					<TablePagination context={auctions} tableContainerRef={tableContainerRef} />
				)}
			</Group>
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
										<Anchor
											component={Link}
											className={classes.anchor}
											href={`/dashboard/a/cycles/auctions/${record.id}`}
										>
											{record.title}
										</Anchor>
										<Group className={classes.group}>
											{record.cycle && record.cycle.status === 'draft' && (
												<Tooltip
													label={t(
														'components.auctionsTable.legend.draftCycle.tooltip',
													)}
													position="top"
												>
													<IconHelpHexagon
														size={14}
														className={classes.draftCycle}
													/>
												</Tooltip>
											)}
											{record.cycle && record.cycle.status === 'ongoing' && (
												<Tooltip
													label={t(
														'components.auctionsTable.legend.ongoingCycle.tooltip',
													)}
													position="top"
												>
													<IconHexagonLetterO
														size={14}
														className={classes.ongoingCycle}
													/>
												</Tooltip>
											)}
											{!record.isPrimaryMarket && (
												<Tooltip
													label={t(
														'components.auctionsTable.legend.secondaryMarket.tooltip',
													)}
													position="top"
												>
													<IconInfoHexagon
														size={14}
														className={classes.secondaryMarket}
													/>
												</Tooltip>
											)}
											{new Date(record.endDatetime).getTime() - Date.now() <
												ENDING_SOON_THRESHOLD &&
												new Date(record.endDatetime).getTime() >
													Date.now() && (
													<Tooltip
														label={t(
															'components.auctionsTable.legend.ending.tooltip',
														)}
														position="top"
													>
														<IconAlertHexagon
															size={14}
															className={classes.ending}
														/>
													</Tooltip>
												)}
										</Group>
									</Group>
								),
							},
							{
								accessor: 'type',
								sortable: true,
								title: t('components.auctionsTable.columns.type'),
								width: 120,
								cellsClassName: classes.status,
								render: (record) => (
									<AuctionTypeBadge type={record.type} showOpen />
								),
							},
							{
								accessor: 'sector',
								sortable: true,
								title: t('components.auctionsTable.columns.sector'),
								width: 160,
								cellsClassName: classes.status,
								render: (record) => <SectorBadge sector={record.sector} />,
							},
							{
								accessor: 'status',
								sortable: true,
								title: t('components.auctionsTable.columns.status'),
								width: 120,
								cellsClassName: classes.status,
								render: (record) => <AuctionStatusBadge auctionData={record} />,
							},
							{
								accessor: 'cycleId',
								sortable: false,
								title: t('components.auctionsTable.columns.cycle'),
								width: 240,
								ellipsis: true,
								render: (record) =>
									record.cycle ? (
										<Anchor
											component={Link}
											className={classes.anchor}
											href={`/dashboard/a/cycles/${record.cycleId}`}
										>
											{record.cycle.title}
										</Anchor>
									) : null,
							},
							{
								accessor: 'startDatetime',
								sortable: true,
								title: t('components.auctionsTable.columns.startDatetime'),
								width: 160,
								render: (record) =>
									DateTime.fromISO(record.startDatetime).toLocaleString(
										DateTime.DATETIME_MED,
									),
							},
							{
								accessor: 'endDatetime',
								sortable: true,
								title: t('components.auctionsTable.columns.endDatetime'),
								width: 160,
								render: (record) =>
									DateTime.fromISO(record.endDatetime).toLocaleString(
										DateTime.DATETIME_MED,
									),
							},
						],
					},
					{
						id: 'economic',
						title: t('components.auctionsTable.groups.economic'),
						columns: [
							{
								accessor: 'minBid',
								sortable: true,
								title: t('components.auctionsTable.columns.minBid'),
								width: 160,
								cellsClassName: classes.cell,
								render: (record) => (
									<>
										<CurrencyBadge className="mr-1" />
										{format.number(record.minBid, 'money')}
									</>
								),
							},
							{
								accessor: 'minIncrement',
								sortable: true,
								title: t('components.auctionsTable.columns.minIncrement'),
								width: 180,
								cellsClassName: classes.cell,
								render: () => (
									<>
										<CurrencyBadge className="mr-1" />
										{/* TODO: add min increment once available */}
										{format.number(1, 'money')}
									</>
								),
							},
						],
					},
					{
						id: 'permit',
						title: t('components.auctionsTable.groups.permit'),
						columns: [
							{
								accessor: 'permits',
								sortable: true,
								title: t('components.auctionsTable.columns.permits'),
								width: 160,
								render: (record) =>
									t('constants.quantities.permits.default', {
										value: record.permits,
									}),
							},
							{
								accessor: 'emissions',
								sortable: true,
								title: t('components.auctionsTable.columns.emissions'),
								width: 200,
								render: () =>
									t('constants.quantities.emissions.default', {
										//	TODO: add emissions once available
										value: 1000,
									}),
							},
							{
								accessor: 'lifespan',
								sortable: true,
								title: t('components.auctionsTable.columns.lifespan'),
								width: 160,
								render: () =>
									t('constants.quantities.years.default', {
										//	TODO: add lifespan once available
										value: 1,
									}),
							},
						],
					},
					{
						id: 'owner',
						title: t('components.auctionsTable.groups.owner'),
						columns: [
							{
								accessor: 'owner',
								sortable: true,
								title: t('components.auctionsTable.columns.owner'),
								width: 240,
								ellipsis: true,
								render: (record) => (
									<Anchor
										component={Link}
										className={classes.anchor}
										href={`/dashboard/a/firms/${record.ownerId}`}
									>
										{record.owner.name}
									</Anchor>
								),
							},
							{
								accessor: 'email',
								sortable: true,
								title: t('components.auctionsTable.columns.email'),
								width: 200,
								ellipsis: true,
								render: (record) => (
									<Anchor
										className={classes.anchor}
										href={`mailto:${record.owner.email}`}
									>
										{record.owner.email}
									</Anchor>
								),
							},
							{
								accessor: 'phone',
								sortable: true,
								title: t('components.auctionsTable.columns.phone'),
								render: (record) => (
									<Anchor
										className={classes.anchor}
										href={`tel:${record.owner.phone}`}
									>
										{record.owner.phone}
									</Anchor>
								),
							},
							{
								accessor: 'isGovernment',
								sortable: true,
								title: t('components.auctionsTable.columns.isGovernment'),
								width: 120,
								render: (record) =>
									record.owner.type === 'admin'
										? t('constants.yes')
										: t('constants.no'),
							},
						],
					},
					{
						id: 'miscellaneous',
						title: t('components.auctionsTable.groups.miscellaneous'),
						columns: [
							{
								accessor: 'views',
								sortable: true,
								title: t('components.auctionsTable.columns.views'),
								width: 100,
								render: (record) =>
									t('constants.quantities.views.default', {
										value: record.views || 0,
									}),
							},
							{
								accessor: 'bidders',
								sortable: true,
								title: t('components.auctionsTable.columns.bidders'),
								width: 120,
								render: (record) =>
									t('constants.quantities.bidders.default', {
										value: record.biddersCount || 0,
									}),
							},
							{
								accessor: 'bids',
								sortable: true,
								title: t('components.auctionsTable.columns.bids'),
								width: 120,
								render: (record) =>
									t('constants.quantities.bids.default', {
										value: record.bidsCount || 0,
									}),
							},
							{
								accessor: 'bookmarks',
								sortable: true,
								title: t('components.auctionsTable.columns.bookmarks'),
								width: 140,
								render: () =>
									t('constants.quantities.bookmarks.default', {
										//	TODO: add bookmarks once available
										value: 0,
									}),
							},
							{
								accessor: 'createdAt',
								sortable: true,
								title: t('components.auctionsTable.columns.createdAt'),
								width: 160,
								render: (record) =>
									DateTime.fromISO(record.createdAt).toLocaleString(
										DateTime.DATETIME_SHORT,
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
												'components.auctionsTable.columns.actions.marketplace.tooltip',
											)}
											position="top"
										>
											<ActionIcon
												component={Link}
												href={`/marketplace/auction/${record.id}`}
												target="_blank"
												className={`${classes.button}`}
											>
												<IconBuildingStore size={16} />
											</ActionIcon>
										</Tooltip>
										<Button
											className={`${classes.primary} ${classes.button}`}
											component={Link}
											href={`/dashboard/a/cycles/auctions/${record.id}`}
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
				records={showSelectedOnly ? selectedAuctions : auctions.data.results}
				striped
				withRowBorders
				withColumnBorders
				highlightOnHover
				pinLastColumn
				// sortStatus={sortStatus}
				// onSortStatusChange={setSortStatus}
				selectedRecords={selectedAuctions}
				onSelectedRecordsChange={selectedAuctionsHandlers.setState}
				selectionColumnClassName={classes.selection}
				fetching={auctions.isLoading}
				idAccessor="id"
				noRecordsText={t('components.auctionsTable.empty')}
				scrollViewportRef={tableContainerRef}
				{...props}
			/>
			<Group className={classes.footer}>
				{auctions.isSuccess && !showSelectedOnly && (
					<TablePagination context={auctions} tableContainerRef={tableContainerRef} />
				)}
			</Group>
		</Stack>
	);
};
export const AuctionsTable = (props: AuctionsTableProps) =>
	withProviders(<_AuctionsTable {...props} />, { provider: SelectionSummaryProvider });
