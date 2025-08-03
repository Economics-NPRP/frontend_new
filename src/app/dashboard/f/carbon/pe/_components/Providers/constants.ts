'use client';

import { DateTime } from 'luxon';
import { createContext } from 'react';

export const DefaultEmissionsPermitsPageContextData: IEmissionsPermitsPageContext = {
	selectedPeriod: DateTime.now().startOf('year'),
	setSelectedPeriod: () => {},
};

export interface IEmissionsPermitsPageContext {
	selectedPeriod: DateTime;
	setSelectedPeriod: (period: DateTime) => void;
}

export const EmissionsPermitsPageContext = createContext<IEmissionsPermitsPageContext>(
	DefaultEmissionsPermitsPageContextData,
);
