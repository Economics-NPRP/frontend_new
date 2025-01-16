'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

import { IGetPaginatedAuctionsOptions, getPaginatedAuctions } from '@/lib/auctions';
import { Container } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { Filters } from './Filters';
import { Header } from './Header';
import { List } from './List';
import { CatalogueContext, DEFAULT_CONTEXT } from './constants';
import classes from './styles.module.css';

export default function Catalogue() {
	const t = useTranslations();
	console.log(t('components.auctionCard.minBid'));

	const [page, setPage] = useState(DEFAULT_CONTEXT.page);
	const [perPage, setPerPage] = useLocalStorage({
		key: 'perPage',
		defaultValue: DEFAULT_CONTEXT.perPage,
	});
	const [pageCount, setPageCount] = useState(DEFAULT_CONTEXT.pageCount);

	const [sortBy, setSortBy] = useState(DEFAULT_CONTEXT.sortBy);
	const [sortDirection, setSortDirection] = useState(DEFAULT_CONTEXT.sortDirection);

	const queryParams = useMemo<IGetPaginatedAuctionsOptions>(
		() => ({ page, perPage, sortBy, sortDirection, isLive: true }),
		[page, perPage, sortBy, sortDirection],
	);
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

				auctionData: data || DEFAULT_CONTEXT.auctionData,
				isLoading,
				isError,
				isSuccess,

				setPage,
				setPerPage,
				setPageCount,

				setSortBy,
				setSortDirection,
			}}
		>
			<Container className={classes.root}>
				<Container className={classes.bg}>
					<Container className={`${classes.graphic} bg-grid-md`} />
				</Container>
				<Header />
				<Filters />
				<List />
			</Container>
		</CatalogueContext.Provider>
	);
}
