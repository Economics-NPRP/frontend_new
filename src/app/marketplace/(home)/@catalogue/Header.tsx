import { useTranslations } from 'next-intl';
import { useCallback, useContext, useMemo, useState } from 'react';

import { SortDirection } from '@/types';
import {
	ActionIcon,
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
import { IconDownload, IconLayoutGrid, IconListDetails } from '@tabler/icons-react';

import { CatalogueContext, DEFAULT_CONTEXT, IAuctionFilters } from './constants';
import classes from './styles.module.css';

type ViewType = 'grid' | 'list';

const FilterPill = (props: PillProps) => (
	<Pill className={classes.badge} withRemoveButton {...props} />
);

export const Header = () => {
	const t = useTranslations();
	const {
		page,
		perPage,
		sortBy,
		sortDirection,
		filters,
		auctionData,
		setPerPage,
		setSortBy,
		setSortDirection,
		removeFilter,
	} = useContext(CatalogueContext);

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
		const index = (page - 1) * perPage;
		const end =
			index + perPage > auctionData.totalCount ? auctionData.totalCount : index + perPage;
		return `${index + 1} - ${end}`;
	}, [page, perPage, auctionData.totalCount]);

	const filterBadges = useMemo(() => {
		const output = [];

		const selectFilters = ['type', 'status', 'sector', 'owner'];
		(Object.entries(filters) as Array<[keyof IAuctionFilters, Array<unknown>]>).forEach(
			([key, value]) => {
				if (!value || (Array.isArray(value) && !value.length)) return;
				if (selectFilters.includes(key))
					output.push(
						...(value as Array<string>).map((val) => (
							<FilterPill
								key={`${key}-${val}`}
								onRemove={() => removeFilter(key, val)}
							>
								{t(`marketplace.home.catalogue.filters.accordion.${key}.title`)}: "
								{val}"
							</FilterPill>
						)),
					);
				else if (key === 'date') {
					const [startDate, endDate] = value as DatesRangeValue;
					output.push(
						<FilterPill
							key={`date-${startDate?.getMilliseconds()}-${endDate?.getMilliseconds()}`}
							onRemove={() => removeFilter(key)}
						>
							{t(`marketplace.home.catalogue.filters.accordion.${key}.title`)}: "
							{startDate?.toLocaleDateString()} - {endDate?.toLocaleDateString()}"
						</FilterPill>,
					);
				} else if (key === 'permits' || key === 'minBid' || key === 'price') {
					const [min, max] = value as [number, number];
					output.push(
						<FilterPill key={`${key}-${min}-${max}`} onRemove={() => removeFilter(key)}>
							{t(`marketplace.home.catalogue.filters.accordion.${key}.title`)}: "{min}{' '}
							- {max}"
						</FilterPill>,
					);
				}
			},
		);

		if (!output.length)
			output.push(
				<FilterPill key={0} withRemoveButton={false}>
					No Filters Applied
				</FilterPill>,
			);
		return output;
	}, [filters]);

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
					<Text className={classes.slash}>-</Text>
					<Text className={classes.subheading}>
						Showing <b>{auctionIndex}</b> of {auctionData.totalCount} auctions
					</Text>
				</Group>
				<Group className={classes.settings}>
					<Text className={classes.label}>Sort by:</Text>
					<Select
						className={classes.dropdown}
						w={180}
						value={`${sortBy}-${sortDirection}`}
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
								`${DEFAULT_CONTEXT.sortBy}-${DEFAULT_CONTEXT.sortDirection}`
							).split('-');
							setSortBy(sortBy);
							setSortDirection(sortDirection as SortDirection);
						}}
					/>
					<Text className={classes.label}>Per page:</Text>
					<Select
						className={classes.dropdown}
						w={64}
						value={perPage.toString()}
						data={['6', '12', '24']}
						onChange={(value) => setPerPage(Number(value))}
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
							<ActionIcon
								className={`${classes.action} ${classes.square}`}
								ref={setControlRef('grid')}
								onClick={() => setView('grid')}
								data-active={view === 'grid'}
							>
								<IconLayoutGrid size={16} />
							</ActionIcon>
						</Tooltip>
						<Tooltip label="Switch to list view">
							<ActionIcon
								className={`${classes.action} ${classes.square}`}
								ref={setControlRef('list')}
								onClick={() => setView('list')}
								data-active={view === 'list'}
							>
								<IconListDetails size={16} />
							</ActionIcon>
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
