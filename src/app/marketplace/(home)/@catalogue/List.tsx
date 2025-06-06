import { PaginatedAuctionsContext } from 'contexts/PaginatedAuctions';
import { useContext, useMemo } from 'react';

import { AuctionCard } from '@/components/AuctionCard';
import { Container, Pagination } from '@mantine/core';

import classes from './styles.module.css';

export const List = () => {
	const paginatedAuctions = useContext(PaginatedAuctionsContext);

	const auctions = useMemo(() => {
		if (!paginatedAuctions.isSuccess) return [];

		return paginatedAuctions.data.results.map((auction) => (
			<AuctionCard auction={auction} key={auction.id} />
		));
	}, [paginatedAuctions.data, paginatedAuctions.isSuccess]);

	const pagination = useMemo(
		() =>
			paginatedAuctions.data.pageCount > 1 && (
				<Pagination
					className={classes.pagination}
					value={paginatedAuctions.data.page}
					total={paginatedAuctions.data.pageCount}
					siblings={2}
					boundaries={3}
					onChange={paginatedAuctions.setPage}
				/>
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
