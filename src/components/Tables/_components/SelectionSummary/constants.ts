'use client';

import { createContext } from 'react';

import { SummaryTableGroup } from '@/components/SummaryTable';

export const DefaultSelectionSummaryContextData: ISelectionSummaryContext = {
	selectedRecords: [],
	generateSummaryGroups: () => [],
	open: () => {},
	close: () => {},
};

export interface ISelectionSummaryContext {
	selectedRecords: Array<Record<string, unknown>>;
	generateSummaryGroups: (
		selectedRecords: Array<Record<string, unknown>>,
	) => Array<SummaryTableGroup>;
	open: (
		selectedRecords: Array<Record<string, unknown>>,
		generateSummaryGroups: (
			selectedRecords: Array<Record<string, unknown>>,
		) => Array<SummaryTableGroup>,
	) => void;
	close: () => void;
}

export const SelectionSummaryContext = createContext<ISelectionSummaryContext>(
	DefaultSelectionSummaryContextData,
);
