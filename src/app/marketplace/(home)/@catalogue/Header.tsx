import { useTranslations } from 'next-intl';
import { ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import { DefaultPaginatedAuctionsContextData, PaginatedAuctionsContext } from '@/contexts';
import { useOffsetPaginationText } from '@/hooks';
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
import { IconDownload, IconFilter, IconLayoutGrid, IconListDetails } from '@tabler/icons-react';

import { AuctionCatalogueContext, getAuctionFilters } from './constants';
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

	const filterBadges = useMemo(() => {
		const output = [];

		output.push(
			...getAuctionFilters(t).reduce((acc, { id, type, options }) => {
				const value = paginatedAuctions.filters[id];
				const option = options?.find(({ value: optionVal }) => optionVal === value);
				switch (type) {
					case 'checkbox':
						acc.push(
							...((value as Array<string>) || []).map((val) => (
								<FilterPill
									key={`${id}-${val}`}
									onRemove={() => paginatedAuctions.removeFilter(id, val)}
								>
									{t('marketplace.home.catalogue.header.filter.label', {
										value: option ? (option.label as string) : val,
									})}
								</FilterPill>
							)),
						);
						break;
					case 'radio':
						if (value && value !== 'all')
							acc.push(
								<FilterPill
									key={id}
									onRemove={() => paginatedAuctions.removeFilter(id)}
								>
									{t('marketplace.home.catalogue.header.filter.label', {
										value: option
											? (option.label as string)
											: (value as string),
									})}
								</FilterPill>,
							);
						break;
				}
				return acc;
			}, [] as Array<ReactNode>),
		);

		if (!output.length)
			output.push(
				<FilterPill key={0} withRemoveButton={false}>
					{t('marketplace.home.catalogue.filters.total', { value: 0 })}
				</FilterPill>,
			);

		return output;
	}, [t, paginatedAuctions.filters]);

	const paginationText = useOffsetPaginationText('auctions', paginatedAuctions);

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
						{t('marketplace.home.catalogue.header.heading')}
					</Title>
					<Text className={classes.slash} visibleFrom="md">
						-
					</Text>
					<Text className={classes.subheading}>{paginationText}</Text>
				</Group>
				<Group className={classes.settings}>
					<Text className={classes.label}>{t('constants.pagination.sortBy.label')}</Text>
					<Select
						className={classes.dropdown}
						w={180}
						value={`${paginatedAuctions.sortBy}-${paginatedAuctions.sortDirection}`}
						data={[
							{
								value: 'created_at-desc',
								label: t('marketplace.home.catalogue.header.sortBy.newest'),
							},
							{
								value: 'created_at-asc',
								label: t('marketplace.home.catalogue.header.sortBy.oldest'),
							},
							{
								value: 'end_datetime-asc',
								label: t('marketplace.home.catalogue.header.sortBy.endingSoon'),
							},
							{
								value: 'permits-desc',
								label: t('marketplace.home.catalogue.header.sortBy.mostPermits'),
							},
							{
								value: 'permits-asc',
								label: t('marketplace.home.catalogue.header.sortBy.leastPermits'),
							},
							{
								value: 'min_bid-desc',
								label: t('marketplace.home.catalogue.header.sortBy.highMinBid'),
							},
							{
								value: 'min_bid-asc',
								label: t('marketplace.home.catalogue.header.sortBy.lowMinBid'),
							},
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
					<Text className={classes.label}>{t('constants.pagination.perPage.label')}</Text>
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
				<Group className={classes.list}>
					<Text className={classes.heading}>
						{t('marketplace.home.catalogue.header.filter.list')}
					</Text>
					{filterBadges}
				</Group>
				<Group>
					<Group className={classes.viewActions} ref={setRootRef}>
						<Tooltip label={t('marketplace.home.catalogue.header.view.grid.tooltip')}>
							<Button
								className={`${classes.action} ${classes.square}`}
								ref={setControlRef('grid')}
								onClick={() => setView('grid')}
								data-active={view === 'grid'}
								leftSection={<IconLayoutGrid size={16} />}
							>
								{t('marketplace.home.catalogue.header.view.grid.label')}
							</Button>
						</Tooltip>
						<Tooltip label={t('marketplace.home.catalogue.header.view.list.tooltip')}>
							<Button
								className={`${classes.action} ${classes.square}`}
								ref={setControlRef('list')}
								onClick={() => setView('list')}
								data-active={view === 'list'}
								leftSection={<IconListDetails size={16} />}
							>
								{t('marketplace.home.catalogue.header.view.list.label')}
							</Button>
						</Tooltip>

						<FloatingIndicator
							className={classes.indicator}
							target={controlsRefs[view]}
							parent={rootRef}
						/>
					</Group>
					<Tooltip label={t('constants.download.auctions')}>
						<ActionIcon className={`${classes.action} ${classes.square}`}>
							<IconDownload size={16} />
						</ActionIcon>
					</Tooltip>
					<Tooltip label={t('marketplace.home.catalogue.header.filter.tooltip')}>
						<ActionIcon
							className={`${classes.action} ${classes.square}`}
							onClick={openFiltersModal}
							hiddenFrom="md"
						>
							<IconFilter size={16} />
						</ActionIcon>
					</Tooltip>
				</Group>
			</Group>
		</Stack>
	);
};
