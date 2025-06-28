'use client';

import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { AuctionCycleCard } from '@/components/AuctionCycleCard';
import { AuctionCycleStatusFilter } from '@/components/Tables/AuctionCycles/types';
import { IPaginatedAuctionCyclesContext } from '@/contexts';
import { useOffsetPaginationText } from '@/hooks';
import {
	ActionIcon,
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
import { IconAdjustments, IconDownload, IconSearch } from '@tabler/icons-react';

import classes from '../styles.module.css';

export interface AuctionCyclesTableProps extends TableProps {
	auctionCycles: IPaginatedAuctionCyclesContext;
}
export const AuctionCyclesTable = ({
	auctionCycles,

	className,
}: AuctionCyclesTableProps) => {
	const t = useTranslations();
	const tableContainerRef = useRef<HTMLTableElement>(null);
	const paginationText = useOffsetPaginationText('auctionCycles', auctionCycles);

	const [searchFilter, setSearchFilter] = useState('');

	//	Generate the filter badges
	const filterBadges = useMemo(() => {
		if (!auctionCycles) return null;
		const output = [];

		switch (auctionCycles.status) {
			case 'draft':
				output.push(
					<Pill
						key={'draft'}
						className={classes.badge}
						onRemove={() => auctionCycles.setStatus('all')}
						withRemoveButton
					>
						{t('components.auctionCyclesTable.filters.badges.draft')}
					</Pill>,
				);
				break;
			case 'approved':
				output.push(
					<Pill
						key={'approved'}
						className={classes.badge}
						onRemove={() => auctionCycles.setStatus('all')}
						withRemoveButton
					>
						{t('components.auctionCyclesTable.filters.badges.approved')}
					</Pill>,
				);
				break;
			case 'ongoing':
				output.push(
					<Pill
						key={'ongoing'}
						className={classes.badge}
						onRemove={() => auctionCycles.setStatus('all')}
						withRemoveButton
					>
						{t('components.auctionCyclesTable.filters.badges.ongoing')}
					</Pill>,
				);
				break;
			case 'ended':
				output.push(
					<Pill
						key={'ended'}
						className={classes.badge}
						onRemove={() => auctionCycles.setStatus('all')}
						withRemoveButton
					>
						{t('components.auctionCyclesTable.filters.badges.ended')}
					</Pill>,
				);
				break;
		}

		if (output.length === 0)
			return (
				<Pill className={classes.badge}>
					{t('components.auctionCyclesTable.filters.badges.all')}
				</Pill>
			);
		return output;
	}, [auctionCycles, t]);

	const handleChangePage = useCallback(
		(page: number) => {
			if (!auctionCycles || !tableContainerRef.current) return;
			auctionCycles.setPage(page);
			tableContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
		},
		[auctionCycles, tableContainerRef],
	);

	//	Reset the page when the filter or per page changes
	useEffect(() => auctionCycles.setPage(1), [auctionCycles.status, auctionCycles.perPage]);

	return (
		<Stack className={`${classes.root} ${className}`}>
			<Stack className={classes.header}>
				<Group className={`${classes.row} ${classes.wrapMobile}`}>
					<Group className={classes.label}>
						<Title order={2} className={classes.title}>
							{t('components.auctionCyclesTable.title')}
						</Title>
						<Text className={classes.subtitle}>{paginationText}</Text>
					</Group>
					<Group className={classes.settings}>
						<Text className={classes.label}>
							{t('constants.pagination.sortBy.label')}
						</Text>
						<Select
							className={classes.dropdown}
							w={180}
							value={(auctionCycles.sortBy || '').toString()}
							data={[
								{
									value: 'start_datetime',
									label: t('constants.pagination.sortBy.startDatetime.label'),
								},
								{
									value: 'last_updated',
									label: t('constants.pagination.sortBy.lastUpdated.label'),
								},
								{
									value: 'auctions_count',
									label: t('constants.pagination.sortBy.auctionsCount.label'),
								},
							]}
							onChange={(value) => auctionCycles.setSortBy(value!)}
							allowDeselect={false}
						/>
						<Text className={classes.label}>
							{t('constants.pagination.perPage.label')}
						</Text>
						<Select
							className={classes.dropdown}
							w={80}
							value={auctionCycles.perPage.toString()}
							data={['10', '20', '50', '100']}
							onChange={(value) => auctionCycles.setPerPage(Number(value))}
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
									{t('components.auctionCyclesTable.filters.menu.status.label')}
								</Menu.Label>
								<Radio.Group
									value={auctionCycles.status}
									onChange={(value) =>
										auctionCycles.setStatus(value as AuctionCycleStatusFilter)
									}
								>
									<Stack className={classes.options}>
										<Radio
											value="all"
											label={t(
												'components.auctionCyclesTable.filters.menu.status.all',
											)}
										/>
										<Radio
											value="draft"
											label={t(
												'components.auctionCyclesTable.filters.menu.status.draft',
											)}
										/>
										<Radio
											value="approved"
											label={t(
												'components.auctionCyclesTable.filters.menu.status.approved',
											)}
										/>
										<Radio
											value="ongoing"
											label={t(
												'components.auctionCyclesTable.filters.menu.status.ongoing',
											)}
										/>
										<Radio
											value="ended"
											label={t(
												'components.auctionCyclesTable.filters.menu.status.ended',
											)}
										/>
									</Stack>
								</Radio.Group>
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
							{t('components.auctionCyclesTable.filters.label')}
						</Text>
						<Group className={classes.group}>{filterBadges}</Group>
					</Group>
					<TextInput
						className={classes.search}
						placeholder={t('components.auctionCyclesTable.search.placeholder')}
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
				</Group>
			</Stack>
			<Stack>
				<AuctionCycleCard
					auctionCycleData={{
						id: 'b8b3441f-ca52-4c79-8ea1-7a8c4c56d19c',
						title: 'Summer 2025',
						status: 'draft',
						auctionsCount: 367,
						emissionsCount: 143559152,
						startDatetime: DateTime.now().plus({ days: 3 }).toISO(),
						endDatetime: DateTime.now().plus({ months: 3 }).toISO(),
						updatedAt: DateTime.now().minus({ hours: 3 }).toISO(),
					}}
				/>
				<AuctionCycleCard
					auctionCycleData={{
						id: 'b8b3441f-ca52-4c79-8ea1-7a8c4c56d19c',
						title: 'Summer 2025',
						status: 'approved',
						auctionsCount: 367,
						emissionsCount: 143559152,
						startDatetime: DateTime.now().plus({ days: 3 }).toISO(),
						endDatetime: DateTime.now().plus({ months: 3 }).toISO(),
						updatedAt: DateTime.now().minus({ hours: 3 }).toISO(),
					}}
					loading
				/>
				<AuctionCycleCard
					auctionCycleData={{
						id: 'b8b3441f-ca52-4c79-8ea1-7a8c4c56d19c',
						title: 'Summer 2025',
						status: 'ongoing',
						auctionsCount: 367,
						emissionsCount: 143559152,
						startDatetime: DateTime.now().plus({ days: 3 }).toISO(),
						endDatetime: DateTime.now().plus({ months: 3 }).toISO(),
						updatedAt: DateTime.now().minus({ hours: 3 }).toISO(),
					}}
				/>
				<AuctionCycleCard
					auctionCycleData={{
						id: 'b8b3441f-ca52-4c79-8ea1-7a8c4c56d19c',
						title: 'Summer 2025',
						status: 'ended',
						auctionsCount: 367,
						emissionsCount: 143559152,
						startDatetime: DateTime.now().plus({ days: 3 }).toISO(),
						endDatetime: DateTime.now().plus({ months: 3 }).toISO(),
						updatedAt: DateTime.now().minus({ hours: 3 }).toISO(),
					}}
				/>
			</Stack>
			<Group className={classes.footer}>
				{auctionCycles.isSuccess && (
					<Pagination
						className={classes.pagination}
						value={auctionCycles.page}
						total={auctionCycles.data.pageCount}
						siblings={2}
						boundaries={3}
						onChange={handleChangePage}
					/>
				)}
			</Group>
		</Stack>
	);
};
