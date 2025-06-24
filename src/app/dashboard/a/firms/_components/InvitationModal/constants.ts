'use client';

import { createContext } from 'react';

import { DefaultFirmData, IFirmData } from '@/schema/models';

export const DefaultInvitationModalContextData: IInvitationModalContext = {
	firmData: DefaultFirmData,
	opened: false,
	open: () => {},
	close: () => {},
};

export interface IInvitationModalContext {
	firmData: IFirmData;
	opened: boolean;
	open: (firmData: IFirmData) => void;
	close: () => void;
}

export const InvitationModalContext = createContext<IInvitationModalContext>(
	DefaultInvitationModalContextData,
);
