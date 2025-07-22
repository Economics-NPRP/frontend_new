'use client';

import { DateTime } from 'luxon';
import { createContext } from 'react';

export const DefaultSectorDetailsPageContextData: ISectorDetailsPageContext = {
	selectedPeriod: DateTime.now().startOf('year'),
	setSelectedPeriod: () => {},

	selectedSubsector: null,
	setSelectedSubsector: () => {},
};

export interface ISectorDetailsPageContext {
	selectedPeriod: DateTime;
	setSelectedPeriod: (period: DateTime) => void;

	selectedSubsector: string | null;
	setSelectedSubsector: (subsector: string | null) => void;
}

export const SectorDetailsPageContext = createContext<ISectorDetailsPageContext>(
	DefaultSectorDetailsPageContextData,
);
