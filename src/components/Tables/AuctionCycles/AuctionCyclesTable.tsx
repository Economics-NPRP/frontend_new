'use client';

import { useTranslations } from 'next-intl';
import { useMemo, useRef, useState } from 'react';

import { AuctionCycleCard } from '@/components/AuctionCycleCard';
import { Switch } from '@/components/SwitchCase';
import { TablePagination } from '@/components/Tables/_components/Pagination';
import { IPaginatedAuctionCyclesContext } from '@/contexts';
import { useOffsetPaginationText } from '@/hooks';
import { AuctionCycleStatusFilter, DefaultAuctionCycleData } from '@/schema/models';
import {
	ActionIcon,
	Container,
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
import { IconAdjustments, IconDatabaseOff, IconDownload, IconSearch } from '@tabler/icons-react';

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

	const currentState = useMemo(() => {
		if (auctionCycles.isLoading) return 'loading';
		if (auctionCycles.data.results.length === 0) return 'empty';
		return 'ok';
	}, [auctionCycles]);

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
							data={['5', '10', '20', '50']}
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
			<Group className={classes.footer}>
				{auctionCycles.isSuccess && (
					<TablePagination
						context={auctionCycles}
						tableContainerRef={tableContainerRef}
					/>
				)}
			</Group>
			<Stack className={classes.list} ref={tableContainerRef}>
				<Switch value={currentState}>
					<Switch.Loading>
						<AuctionCycleCard auctionCycleData={DefaultAuctionCycleData} loading />
						<AuctionCycleCard auctionCycleData={DefaultAuctionCycleData} loading />
						<AuctionCycleCard auctionCycleData={DefaultAuctionCycleData} loading />
					</Switch.Loading>
					<Switch.Case when="empty">
						<Stack className={classes.placeholder}>
							<Container className={classes.icon}>
								<IconDatabaseOff size={24} />
							</Container>
							<Text className={classes.text}>
								{t('components.auctionResultsTable.empty')}
							</Text>
						</Stack>
					</Switch.Case>
					<Switch.Else>
						{auctionCycles.data.results.map((cycle) => (
							<AuctionCycleCard key={cycle.id} auctionCycleData={cycle} />
						))}
					</Switch.Else>
				</Switch>
			</Stack>
			<Group className={classes.footer}>
				{auctionCycles.isSuccess && (
					<TablePagination
						context={auctionCycles}
						tableContainerRef={tableContainerRef}
					/>
				)}
			</Group>
		</Stack>
	);
};
