'use client';

import { InfinitePaginatedAuctionsContext } from 'contexts/InfinitePaginatedAuctions';
import { useContext } from 'react';

import { Container, Stack } from '@mantine/core';

import { AuctionCarousel } from './Carousel';
import classes from './styles.module.css';

export default function EndingSoon() {
	const infinitePaginatedAuctions = useContext(InfinitePaginatedAuctionsContext);

	return (
		<Stack className={classes.root}>
			<Container className={classes.bg}>
				<Container className={`${classes.grid} bg-dot-sm`} />
				<Container className={classes.gradient} />
			</Container>
			<AuctionCarousel infinitePaginatedAuctions={infinitePaginatedAuctions} />
		</Stack>
	);
}
