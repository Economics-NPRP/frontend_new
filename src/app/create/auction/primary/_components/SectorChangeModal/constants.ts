'use client';

import { createContext } from 'react';

import { SectorType } from '@/schema/models';

export const DefaultSectorChangeModalContextData: ISectorChangeModalContext = {
	oldSector: 'energy',
	newSector: 'energy',
	open: () => {},
	close: () => {},
	handleConfirm: () => {},
};

export interface ISectorChangeModalContext {
	oldSector: SectorType;
	newSector: SectorType;
	open: (oldSector: SectorType, newSector: SectorType, onConfirm: () => void) => void;
	close: () => void;
	handleConfirm: () => void;
}

export const SectorChangeModalContext = createContext<ISectorChangeModalContext>(
	DefaultSectorChangeModalContextData,
);
