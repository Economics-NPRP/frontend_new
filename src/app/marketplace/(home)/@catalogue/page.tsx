'use client';

import { useTranslations } from 'next-intl';

import { Container } from '@mantine/core';

import { Filters } from './Filters';
import { Header } from './Header';
import { List } from './List';
import classes from './styles.module.css';

export default function Catalogue() {
	const t = useTranslations();
	console.log(t('components.auctionCard.minBid'));

	return (
		<Container className={classes.root}>
			<Container className={classes.bg}>
				<Container className={`${classes.graphic} bg-grid-md`} />
			</Container>
			<Header />
			<Filters />
			<List />
		</Container>
	);
}
