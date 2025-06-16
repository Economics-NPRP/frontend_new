import { useTranslations } from 'next-intl';
import { useCallback, useContext, useMemo, useState } from 'react';

import { DefaultPaginatedAuctionsContextData, PaginatedAuctionsContext } from '@/contexts';
import { SortDirection } from '@/types';
import {
	ActionIcon,
	Button,
	Container,
	FloatingIndicator,
	Group,
	Pill,
	PillProps,
	Select,
	Stack,
	Text,
	Title,
	Tooltip,
} from '@mantine/core';
import { DatesRangeValue } from '@mantine/dates';
import { IconDownload, IconFilter, IconLayoutGrid, IconListDetails } from '@tabler/icons-react';

import { AuctionCatalogueContext, IAuctionFilters, IAuctionStatus } from './constants';
import classes from './styles.module.css';

type ViewType = 'grid' | 'list';

const FilterPill = (props: PillProps) => (
	<Pill className={classes.badge} withRemoveButton {...props} />
);

export const Header = () => {
	const t = useTranslations();
	const paginatedAuctions = useContext(PaginatedAuctionsContext);
	const { openFiltersModal } = useContext(AuctionCatalogueContext);

	const [view, setView] = useState<ViewType>('grid');
	const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
	const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLButtonElement | null>>({});

	const setControlRef = useCallback(
		(index: ViewType) => (node: HTMLButtonElement) => {
			controlsRefs[index] = node;
			setControlsRefs(controlsRefs);
		},
		[],
	);

	const auctionIndex = useMemo(() => {
		const index = (paginatedAuctions.page - 1) * paginatedAuctions.perPage;
		const end =
			index + paginatedAuctions.perPage > paginatedAuctions.data.totalCount
				? paginatedAuctions.data.totalCount
				: index + paginatedAuctions.perPage;
		return `${Math.min(index + 1, paginatedAuctions.data.totalCount)} - ${end}`;
	}, [paginatedAuctions.page, paginatedAuctions.perPage, paginatedAuctions.data.totalCount]);

	const filterBadges = useMemo(() => {
		const output = [];

		const selectFilters = ['type', 'sector', 'owner'];
		(
			Object.entries(paginatedAuctions.filters) as Array<
				[keyof IAuctionFilters, Array<unknown> | IAuctionStatus]
			>
		).forEach(([key, value]) => {
			if (!value || (Array.isArray(value) && !value.length)) return;
			if (selectFilters.includes(key))
				output.push(
					...(value as Array<string>).map((val) => (
						<FilterPill
							key={`${key}-${val}`}
							onRemove={() => paginatedAuctions.removeFilter(key, val)}
						>
							{t(`marketplace.home.catalogue.filters.accordion.${key}.title`)}: "{val}
							"
						</FilterPill>
					)),
				);
			else if (key === 'status') {
				const status = value as IAuctionStatus;
				if (status !== 'all') {
					output.push(
						<FilterPill key={key} onRemove={() => paginatedAuctions.removeFilter(key)}>
							{t(
								`marketplace.home.catalogue.filters.accordion.${key}.options.${status}`,
							)}{' '}
							Auctions
						</FilterPill>,
					);
				}
			} else if (key === 'date') {
				const [startDate, endDate] = value as DatesRangeValue;
				output.push(
					<FilterPill
						key={`date-${startDate?.getMilliseconds()}-${endDate?.getMilliseconds()}`}
						onRemove={() => paginatedAuctions.removeFilter(key)}
					>
						{t(`marketplace.home.catalogue.filters.accordion.${key}.title`)}: "
						{startDate?.toLocaleDateString()} - {endDate?.toLocaleDateString()}"
					</FilterPill>,
				);
			} else if (key === 'permits' || key === 'minBid' || key === 'price') {
				const [min, max] = value as [number, number];
				output.push(
					<FilterPill
						key={`${key}-${min}-${max}`}
						onRemove={() => paginatedAuctions.removeFilter(key)}
					>
						{t(`marketplace.home.catalogue.filters.accordion.${key}.title`)}: "{min} -{' '}
						{max}"
					</FilterPill>,
				);
			}
		});

		if (!output.length)
			output.push(
				<FilterPill key={0} withRemoveButton={false}>
					No Filters Applied
				</FilterPill>,
			);
		return output;
	}, [paginatedAuctions.filters]);

	return (
		<Stack className={classes.header}>
			<Container className={classes.bg}>
				<Container className={classes.graphic} />
				<Container className={classes.graphic} />
				<Container className={classes.graphic} />
				<Container className={classes.graphic} />
			</Container>
			<Group className={classes.row}>
				<Group className={classes.label}>
					<Title className={classes.heading} order={2}>
						Auction Catalogue
					</Title>
					<Text className={classes.slash} visibleFrom="md">
						-
					</Text>
					<Text className={classes.subheading}>
						Showing <b>{auctionIndex}</b> of {paginatedAuctions.data.totalCount}{' '}
						auctions
					</Text>
				</Group>
				<Group className={classes.settings}>
					<Text className={classes.label}>Sort by:</Text>
					<Select
						className={classes.dropdown}
						w={180}
						value={`${paginatedAuctions.sortBy}-${paginatedAuctions.sortDirection}`}
						data={[
							{ value: 'created_at-desc', label: 'Newest' },
							{ value: 'created_at-asc', label: 'Oldest' },
							{ value: 'end_datetime-asc', label: 'Ending Soon' },
							{ value: 'permits-desc', label: 'Most Permits' },
							{ value: 'permits-asc', label: 'Lowest Permits' },
							{ value: 'min_bid-desc', label: 'Highest Minimum Bid' },
							{ value: 'min_bid-asc', label: 'Lowest Minimum Bid' },
						]}
						onChange={(value) => {
							const [sortBy, sortDirection] = (
								value ||
								`${DefaultPaginatedAuctionsContextData.sortBy}-${DefaultPaginatedAuctionsContextData.sortDirection}`
							).split('-');
							paginatedAuctions.setSortBy(sortBy);
							paginatedAuctions.setSortDirection(sortDirection as SortDirection);
						}}
					/>
					<Text className={classes.label}>Per page:</Text>
					<Select
						className={classes.dropdown}
						w={64}
						value={paginatedAuctions.perPage.toString()}
						data={['6', '12', '24']}
						onChange={(value) => paginatedAuctions.setPerPage(Number(value))}
					/>
				</Group>
			</Group>
			<Group className={classes.row}>
				<Group className={classes.filters}>
					<Text className={classes.heading}>Filters:</Text>
					{filterBadges}
				</Group>
				<Group>
					<Group className={classes.viewActions} ref={setRootRef}>
						<Tooltip label="Switch to grid view">
							<Button
								className={`${classes.action} ${classes.square}`}
								ref={setControlRef('grid')}
								onClick={() => setView('grid')}
								data-active={view === 'grid'}
								leftSection={<IconLayoutGrid size={16} />}
							>
								Grid
							</Button>
						</Tooltip>
						<Tooltip label="Switch to list view">
							<Button
								className={`${classes.action} ${classes.square}`}
								ref={setControlRef('list')}
								onClick={() => setView('list')}
								data-active={view === 'list'}
								leftSection={<IconListDetails size={16} />}
							>
								List
							</Button>
						</Tooltip>

						<FloatingIndicator
							className={classes.indicator}
							target={controlsRefs[view]}
							parent={rootRef}
						/>
					</Group>
					<Tooltip label="Download all auctions as CSV">
						<ActionIcon className={`${classes.action} ${classes.square}`}>
							<IconDownload size={16} />
						</ActionIcon>
					</Tooltip>
					<Tooltip label="Filter auctions to find what you need">
						<ActionIcon
							className={`${classes.action} ${classes.square}`}
							onClick={openFiltersModal}
							hiddenFrom="md"
						>
							<IconFilter size={16} />
						</ActionIcon>
					</Tooltip>
				</Group>
				{/* <Pagination
					classNames={{
						root: classes.pagination,
						dots: classes.dots,
						control: classes.action,
					}}
					total={10}
				/> */}
			</Group>
		</Stack>
	);
};
