import { useTranslations } from 'next-intl';
import { ReactNode, createContext } from 'react';

import { AuctionType, SectorType } from '@/schema/models';
import { Anchor, RangeSliderValue } from '@mantine/core';
import { DatesRangeValue } from '@mantine/dates';

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

export type IAuctionStatus = 'ongoing' | 'upcoming' | 'ended' | 'all';
export type AuctionTypeFilter = 'all' | AuctionType;
export type AuctionJoinedFilter = 'joined' | 'notJoined' | 'all';
export type AuctionOwnershipFilter = 'government' | 'private' | 'all';

export interface IAuctionFilters {
	type?: AuctionTypeFilter;
	status?: IAuctionStatus;
	sector?: Array<SectorType>;
	joined?: AuctionJoinedFilter;
	ownership?: AuctionOwnershipFilter;
	date?: DatesRangeValue;
	permits?: RangeSliderValue;
	minBid?: RangeSliderValue;
	price?: RangeSliderValue;
}

export interface AuctionFilterData {
	id: keyof IAuctionFilters;
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
		title: t('marketplace.home.catalogue.filters.accordion.type.title'),
		description: t.rich('marketplace.home.catalogue.filters.accordion.type.description', {
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
				label: t('marketplace.home.catalogue.filters.all'),
			},
		],
	},
	{
		id: 'status',
		title: t('marketplace.home.catalogue.filters.accordion.status.title'),
		description: t('marketplace.home.catalogue.filters.accordion.status.description'),
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
				label: t('marketplace.home.catalogue.filters.all'),
			},
		],
	},
	{
		id: 'sector',
		title: t('marketplace.home.catalogue.filters.accordion.sector.title'),
		description: t('marketplace.home.catalogue.filters.accordion.sector.description'),
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
		title: t('marketplace.home.catalogue.filters.accordion.joined.title'),
		description: t('marketplace.home.catalogue.filters.accordion.joined.description'),
		type: 'radio',
		options: [
			{
				value: 'joined',
				label: t('marketplace.home.catalogue.filters.accordion.joined.options.joined'),
			},
			{
				value: 'notJoined',
				label: t('marketplace.home.catalogue.filters.accordion.joined.options.notJoined'),
			},
			{
				value: 'all',
				label: t('marketplace.home.catalogue.filters.all'),
			},
		],
	},
	{
		id: 'ownership',
		title: t('marketplace.home.catalogue.filters.accordion.ownership.title'),
		description: t('marketplace.home.catalogue.filters.accordion.ownership.description'),
		type: 'radio',
		options: [
			{
				value: 'government',
				label: t(
					'marketplace.home.catalogue.filters.accordion.ownership.options.government',
				),
			},
			{
				value: 'private',
				label: t('marketplace.home.catalogue.filters.accordion.ownership.options.private'),
			},
			{
				value: 'all',
				label: t('marketplace.home.catalogue.filters.all'),
			},
		],
	},
];
