'use client';

import { createContext } from 'react';

export const DefaultApprovalModalContextData: IApprovalModalContext = {
	id: '',
	open: () => {},
	close: () => {},
	openConfirmation: () => {},
	closeConfirmation: () => {},
};

export interface IApprovalModalContext {
	id: string;
	open: () => void;
	close: () => void;
	openConfirmation: () => void;
	closeConfirmation: () => void;
}

export const ApprovalModalContext = createContext<IApprovalModalContext>(
	DefaultApprovalModalContextData,
);
