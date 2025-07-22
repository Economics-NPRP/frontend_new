import { PaginatedAuctionsContext } from 'contexts/PaginatedAuctions';
import { useContext, useMemo } from 'react';

import { AuctionCard } from '@/components/AuctionCard';
import { TablePagination } from '@/components/Tables/_components/Pagination';
import { DefaultAuctionData } from '@/schema/models';
import { Container } from '@mantine/core';

import classes from './styles.module.css';

export const List = () => {
	const paginatedAuctions = useContext(PaginatedAuctionsContext);

	const auctions = useMemo(() => {
		if (paginatedAuctions.isFetching)
			return new Array(paginatedAuctions.perPage)
				.fill(null)
				.map((_, index) => (
					<AuctionCard key={index} loading auction={DefaultAuctionData} />
				));

		if (!paginatedAuctions.isSuccess) return [];

		return paginatedAuctions.data.results.map((auction) => (
			<AuctionCard auction={auction} key={auction.id} />
		));
	}, [paginatedAuctions.data.results, paginatedAuctions.isSuccess, paginatedAuctions.isFetching]);

	const pagination = useMemo(
		() =>
			paginatedAuctions.isLoading
				? null
				: paginatedAuctions.data.pageCount > 1 && (
						<TablePagination
							className={classes.pagination}
							context={paginatedAuctions}
						/>
					),
		[paginatedAuctions.isLoading, paginatedAuctions.data.page],
	);

	return (
		<Container className={classes.catalogue}>
			{pagination}
			{auctions}
			{pagination}
		</Container>
	);
};
