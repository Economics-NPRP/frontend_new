import { useTranslations } from 'next-intl';
import { ReactNode, createContext } from 'react';

import { QueryFiltersData } from '@/schema/models';
import { Anchor } from '@mantine/core';

export const DefaultAuctionCatalogueContextData: IAuctionCatalogueContext = {
	isFilterModalOpen: false,
	openFiltersModal: () => {},
	closeFiltersModal: () => {},
};

export interface IAuctionCatalogueContext {
	isFilterModalOpen: boolean;
	openFiltersModal: () => void;
	closeFiltersModal: () => void;
}

export const AuctionCatalogueContext = createContext<IAuctionCatalogueContext>(
	DefaultAuctionCatalogueContextData,
);

export interface AuctionFilterData {
	id: keyof QueryFiltersData;
	title: ReactNode;
	description: ReactNode;
	type: 'checkbox' | 'radio';
	options?: Array<{
		value: string;
		label: ReactNode;
	}>;
}

export const getAuctionFilters: (
	t: ReturnType<typeof useTranslations<never>>,
) => Array<AuctionFilterData> = (t) => [
	{
		id: 'type',
		title: t('components.auctionCatalogue.filters.accordion.type.title'),
		description: t.rich('components.auctionCatalogue.filters.accordion.type.description', {
			a: (chunks) => <Anchor href="#">{chunks}</Anchor>,
		}),
		type: 'radio',
		options: [
			{
				value: 'open',
				label: t('constants.auctionType.open'),
			},
			{
				value: 'sealed',
				label: t('constants.auctionType.sealed'),
			},
			{
				value: 'all',
				label: t('components.auctionCatalogue.filters.all'),
			},
		],
	},
	{
		id: 'status',
		title: t('components.auctionCatalogue.filters.accordion.status.title'),
		description: t('components.auctionCatalogue.filters.accordion.status.description'),
		type: 'radio',
		options: [
			{
				value: 'upcoming',
				label: t('constants.auctionStatus.upcoming.label'),
			},
			{
				value: 'ongoing',
				label: t('constants.auctionStatus.ongoing.label'),
			},
			{
				value: 'ended',
				label: t('constants.auctionStatus.ended.label'),
			},
			{
				value: 'all',
				label: t('components.auctionCatalogue.filters.all'),
			},
		],
	},
	{
		id: 'sector',
		title: t('components.auctionCatalogue.filters.accordion.sector.title'),
		description: t('components.auctionCatalogue.filters.accordion.sector.description'),
		type: 'checkbox',
		options: [
			{
				value: 'energy',
				label: t('constants.sector.energy.title'),
			},
			{
				value: 'industry',
				label: t('constants.sector.industry.title'),
			},
			{
				value: 'transport',
				label: t('constants.sector.transport.title'),
			},
			{
				value: 'buildings',
				label: t('constants.sector.buildings.title'),
			},
			{
				value: 'agriculture',
				label: t('constants.sector.agriculture.title'),
			},
			{
				value: 'waste',
				label: t('constants.sector.waste.title'),
			},
		],
	},
	{
		id: 'joined',
		title: t('components.auctionCatalogue.filters.accordion.joined.title'),
		description: t('components.auctionCatalogue.filters.accordion.joined.description'),
		type: 'radio',
		options: [
			{
				value: 'joined',
				label: t('components.auctionCatalogue.filters.accordion.joined.options.joined'),
			},
			{
				value: 'notJoined',
				label: t('components.auctionCatalogue.filters.accordion.joined.options.notJoined'),
			},
			{
				value: 'all',
				label: t('components.auctionCatalogue.filters.all'),
			},
		],
	}
];
