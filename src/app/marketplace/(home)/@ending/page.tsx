import { getPaginatedAuctions } from '@/lib/auctions';
import { Container, Stack } from '@mantine/core';
import { QueryClient } from '@tanstack/react-query';

import { AuctionCarousel } from './Carousel';
import { QUERY_PARAMS } from './constants';
import classes from './styles.module.css';

export default async function EndingSoon() {
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: ['marketplace', '@ending'],
		queryFn: () => getPaginatedAuctions(QUERY_PARAMS),
	});

	return (
		<Stack className={classes.root}>
			<Container className={classes.bg}>
				<Container className={`${classes.grid} bg-grid-lg`} />
				<Container className={classes.gradient} />
			</Container>
			<AuctionCarousel />
		</Stack>
	);
}
