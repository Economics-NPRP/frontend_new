'use client';

import { createContext } from 'react';

export const DefaultCycleDetailsPageContextData: ICycleDetailsPageContext = {
	tab: 'members',
	setTab: () => {},

	isDrawerOpen: false,
	openDrawer: () => {},
	closeDrawer: () => {},
};

export interface ICycleDetailsPageContext {
	tab: 'members' | 'updates';
	setTab: (tab: 'members' | 'updates') => void;

	isDrawerOpen: boolean;
	openDrawer: (tab?: 'members' | 'updates') => void;
	closeDrawer: () => void;
}

export const CycleDetailsPageContext = createContext<ICycleDetailsPageContext>(
	DefaultCycleDetailsPageContextData,
);
