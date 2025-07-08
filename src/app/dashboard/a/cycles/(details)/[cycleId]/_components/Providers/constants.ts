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
	tab: 'members' | 'comments' | 'updates';
	setTab: (tab: 'members' | 'comments' | 'updates') => void;

	isDrawerOpen: boolean;
	openDrawer: (tab?: 'members' | 'comments' | 'updates') => void;
	closeDrawer: () => void;
}

export const CycleDetailsPageContext = createContext<ICycleDetailsPageContext>(
	DefaultCycleDetailsPageContextData,
);
