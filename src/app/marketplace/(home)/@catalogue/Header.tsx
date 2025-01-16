import { useCallback, useContext, useMemo, useState } from 'react';

import { SortDirection } from '@/types';
import {
	ActionIcon,
	Badge,
	Container,
	FloatingIndicator,
	Group,
	Select,
	Stack,
	Text,
	Title,
	Tooltip,
} from '@mantine/core';
import { IconDownload, IconLayoutGrid, IconListDetails } from '@tabler/icons-react';

import { CatalogueContext, DEFAULT_CONTEXT } from './constants';
import classes from './styles.module.css';

type ViewType = 'grid' | 'list';

export const Header = () => {
	const context = useContext(CatalogueContext);

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
		const index = (context.page - 1) * context.perPage;
		const end =
			index + context.perPage > context.auctionData.totalCount
				? context.auctionData.totalCount
				: index + context.perPage;
		return `${index + 1} - ${end}`;
	}, [context.page, context.perPage, context.auctionData.totalCount]);

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
						Showing <b>{auctionIndex}</b> of {context.auctionData.totalCount} auctions
					</Text>
				</Group>
				<Group className={classes.settings}>
					<Text className={classes.label}>Sort by:</Text>
					<Select
						className={classes.dropdown}
						w={180}
						value={`${context.sortBy}-${context.sortDirection}`}
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
							context.setSortBy(sortBy);
							context.setSortDirection(sortDirection as SortDirection);
						}}
					/>
					<Text className={classes.label}>Per page:</Text>
					<Select
						className={classes.dropdown}
						w={64}
						value={context.perPage.toString()}
						data={['6', '12', '24']}
						onChange={(value) => context.setPerPage(Number(value))}
					/>
				</Group>
			</Group>
			<Group className={classes.row}>
				<Group className={classes.filters}>
					<Text className={classes.heading}>Filters:</Text>
					<Badge className={classes.badge}>No Filters Applied</Badge>
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
