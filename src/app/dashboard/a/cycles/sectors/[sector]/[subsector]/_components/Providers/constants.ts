'use client';

import { DateTime } from 'luxon';
import { createContext } from 'react';

export const DefaultSubsectorDetailsPageContextData: ISubsectorDetailsPageContext = {
	selectedPeriod: DateTime.now().startOf('year'),
	setSelectedPeriod: () => {},
};

export interface ISubsectorDetailsPageContext {
	selectedPeriod: DateTime;
	setSelectedPeriod: (period: DateTime) => void;
}

export const SubsectorDetailsPageContext = createContext<ISubsectorDetailsPageContext>(
	DefaultSubsectorDetailsPageContextData,
);
