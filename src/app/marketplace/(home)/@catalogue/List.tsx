import { useContext, useMemo } from 'react';

import { AuctionCard } from '@/components/AuctionCard';
import { Container, Pagination } from '@mantine/core';

import { CatalogueContext } from './constants';
import classes from './styles.module.css';

export const List = () => {
	const context = useContext(CatalogueContext);

	const auctions = useMemo(() => {
		if (!context.isSuccess) return [];

		return context.auctionData.results.map((auction) => (
			<AuctionCard auction={auction} key={auction.id} />
		));
	}, [context.auctionData, context.isSuccess]);

	const pagination = useMemo(
		() =>
			context.pageCount > 1 && (
				<Pagination
					className={classes.pagination}
					value={context.auctionData.page}
					total={context.pageCount}
					siblings={2}
					boundaries={3}
					onChange={context.setPage}
				/>
			),
		[context.auctionData.page, context.pageCount, context.setPage],
	);

	return (
		<Container className={classes.catalogue}>
			{pagination}
			{auctions}
			{pagination}
		</Container>
	);
};
