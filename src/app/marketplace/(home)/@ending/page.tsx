import { use } from 'react';

import {
	IGetPaginatedAuctionsOptions,
	getPaginatedAuctions,
	preloadPaginatedAuctions,
} from '@/lib/auctions';
import { Container, Stack } from '@mantine/core';

import { AuctionCarousel } from './Carousel';
import classes from './styles.module.css';

const QUERY_PARAMS: IGetPaginatedAuctionsOptions = {
	perPage: 20,
	sortBy: 'end_datetime',
	sortDirection: 'asc',
	isLive: true,
} as const;

export default function EndingSoon() {
	preloadPaginatedAuctions(QUERY_PARAMS);

	const { ok, errors, results } = use(getPaginatedAuctions(QUERY_PARAMS));
	if (!ok && errors) throw new Error('Failed to load auctions', { cause: errors.join(', ') });

	return (
		<Stack className={classes.root}>
			<Container className={classes.bg}>
				<Container className={`${classes.grid} bg-grid-lg`} />
				<Container className={classes.gradient} />
			</Container>
			<AuctionCarousel results={results} />
		</Stack>
	);
}
