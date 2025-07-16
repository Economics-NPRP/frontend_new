import { PaginatedAuctionsContext } from 'contexts/PaginatedAuctions';
import { useContext, useMemo } from 'react';

import { AuctionCard } from '@/components/AuctionCard';
import { TablePagination } from '@/components/Tables/_components/Pagination';
import { Container } from '@mantine/core';

import classes from './styles.module.css';

export const List = () => {
	const paginatedAuctions = useContext(PaginatedAuctionsContext);

	const auctions = useMemo(() => {
		if (!paginatedAuctions.isSuccess) return [];

		return paginatedAuctions.data.results.map((auction) => (
			<AuctionCard auction={auction} key={auction.id} />
		));
	}, [paginatedAuctions.data.results, paginatedAuctions.isSuccess]);

	const pagination = useMemo(
		() =>
			paginatedAuctions.data.pageCount > 1 && (
				<TablePagination className={classes.pagination} context={paginatedAuctions} />
			),
		[paginatedAuctions.data.page, paginatedAuctions.data.pageCount, paginatedAuctions.setPage],
	);

	return (
		<Container className={classes.catalogue}>
			{pagination}
			{auctions}
			{pagination}
		</Container>
	);
};
