import { createContext } from 'react';

import { AuctionType } from '@/schema/models';
import { AuctionCategory } from '@/types';
import { RangeSliderValue } from '@mantine/core';
import { DatesRangeValue } from '@mantine/dates';

export const DefaultAuctionCatalogueContextData: IAuctionCatalogueContext = {
	isFilterModalOpen: false,
	openFiltersModal: () => {},
	closeFiltersModal: () => {},
};

export type IAuctionStatus = 'ongoing' | 'upcoming' | 'ended' | 'all';

export interface IAuctionFilters {
	type?: Array<AuctionType>;
	status?: IAuctionStatus;
	sector?: Array<AuctionCategory>;
	owner?: Array<string>;
	date?: DatesRangeValue;
	permits?: RangeSliderValue;
	minBid?: RangeSliderValue;
	price?: RangeSliderValue;
}

export interface IAuctionCatalogueContext {
	isFilterModalOpen: boolean;
	openFiltersModal: () => void;
	closeFiltersModal: () => void;
}

export const AuctionCatalogueContext = createContext<IAuctionCatalogueContext>(
	DefaultAuctionCatalogueContextData,
);
