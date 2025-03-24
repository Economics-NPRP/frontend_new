'use client';

import { intersection } from 'lodash-es';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { IGetPaginatedAuctionsOptions, getPaginatedAuctions } from '@/lib/auctions';
import { Container } from '@mantine/core';
import { useDisclosure, useLocalStorage } from '@mantine/hooks';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { FiltersList, FiltersModal } from './Filters';
import { Header } from './Header';
import { List } from './List';
import { CatalogueContext, DEFAULT_CONTEXT, ICatalogueContext } from './constants';
import classes from './styles.module.css';

export default function Catalogue() {
	const [page, setPage] = useState(DEFAULT_CONTEXT.page);
	const [perPage, setPerPage] = useLocalStorage({
		key: 'perPage',
		defaultValue: DEFAULT_CONTEXT.perPage,
	});
	const [pageCount, setPageCount] = useState(DEFAULT_CONTEXT.pageCount);

	const [sortBy, setSortBy] = useState(DEFAULT_CONTEXT.sortBy);
	const [sortDirection, setSortDirection] = useState(DEFAULT_CONTEXT.sortDirection);

	const [filters, setFilters] = useState(DEFAULT_CONTEXT.filters);
	const removeFilter = useCallback<ICatalogueContext['removeFilter']>((key, value) => {
		if (value) {
			setFilters((filters) => ({
				...filters,
				[key]: (filters[key] as Array<string>).filter((v) => v !== value),
			}));
		}
		setFilters((filters) => ({ ...filters, [key]: DEFAULT_CONTEXT.filters[key] }));
	}, []);

	const [opened, { open, close }] = useDisclosure(false);

	const queryParams = useMemo<IGetPaginatedAuctionsOptions>(() => {
		const { type, status } = filters;

		const isLive = intersection(['ongoing', 'ending'], status).length > 0;
		const hasEnded = intersection(['ended'], status).length > 0;

		return {
			page,
			perPage,
			sortBy,
			sortDirection,
			type: (type || [])[0],
			isLive,
			hasEnded,
		};
	}, [page, perPage, sortBy, sortDirection, filters]);

	const { data, isLoading, isError, isSuccess } = useQuery({
		queryKey: ['marketplace', '@catalogue', JSON.stringify(queryParams)],
		queryFn: () => getPaginatedAuctions(queryParams),
		placeholderData: keepPreviousData,
	});

	useEffect(() => data && setPageCount(data.pageCount), [data]);

	return (
		<CatalogueContext.Provider
			value={{
				page,
				perPage,
				pageCount,

				sortBy,
				sortDirection,

				filters,

				auctionData: data || DEFAULT_CONTEXT.auctionData,
				isLoading,
				isError,
				isSuccess,

				setPage,
				setPerPage,
				setPageCount,

				setSortBy,
				setSortDirection,

				setFilters,
				removeFilter,

				isFilterModalOpen: opened,
				openFiltersModal: open,
				closeFiltersModal: close,
			}}
		>
			<Container className={classes.root}>
				<Container className={classes.bg}>
					<Container className={`${classes.graphic} bg-grid-md`} />
				</Container>
				<Header />
				<FiltersList />
				<FiltersModal />
				<List />
			</Container>
		</CatalogueContext.Provider>
	);
}
