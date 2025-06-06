'use client';

import { PropsWithChildren } from 'react';

import { withProviders } from '@/helpers';
import { Container } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { FiltersList, FiltersModal } from './Filters';
import { Header } from './Header';
import { List } from './List';
import { AuctionCatalogueContext } from './constants';
import classes from './styles.module.css';

export default function Catalogue() {
	return withProviders(
		<>
			<Container className={classes.root}>
				<Container className={classes.bg}>
					<Container className={`${classes.graphic} bg-grid-md`} />
				</Container>
				<Header />
				<FiltersList />
				<FiltersModal />
				<List />
			</Container>
		</>,
		{ provider: ComponentProviders },
	);
}

const ComponentProviders = ({ children }: PropsWithChildren) => {
	const [opened, { open, close }] = useDisclosure(false);

	return (
		<AuctionCatalogueContext.Provider
			value={{
				isFilterModalOpen: opened,
				openFiltersModal: open,
				closeFiltersModal: close,
			}}
		>
			{children}
		</AuctionCatalogueContext.Provider>
	);
};
