'use client';

import { PropsWithChildren } from 'react';

import {
	AuctionCatalogueContext,
	AuctionCatalogueFiltersList,
	AuctionCatalogueFiltersModal,
	AuctionCatalogueHeader,
	AuctionCatalogueList,
} from '@/components/AuctionCatalogue';
import { withProviders } from '@/helpers';
import { Container } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import classes from './styles.module.css';

export const AuctionCatalogue = () => {
	return withProviders(
		<>
			<Container className={classes.root}>
				<Container className={classes.bg}>
					<Container className={`${classes.graphic} bg-grid-md`} />
				</Container>
				<AuctionCatalogueHeader />
				<AuctionCatalogueFiltersList />
				<AuctionCatalogueFiltersModal />
				<AuctionCatalogueList />
			</Container>
		</>,
		{ provider: ComponentProviders },
	);
};

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
