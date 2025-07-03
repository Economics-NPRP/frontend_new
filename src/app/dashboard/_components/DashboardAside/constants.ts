'use client';

import { ReactNode, createContext } from 'react';

export const DefaultDashboardAsideContextData: IDashboardAsideContext = {
	tabs: [],
	setTabs: () => [],
};

export interface DashboardAsideTabData {
	label: ReactNode;
	value: string;
	icon?: ReactNode;
	content: ReactNode;
}
export interface IDashboardAsideContext {
	tabs: Array<DashboardAsideTabData>;
	setTabs: (tabs: Array<DashboardAsideTabData>) => void;
}

export const DashboardAsideContext = createContext<IDashboardAsideContext>(
	DefaultDashboardAsideContextData,
);
