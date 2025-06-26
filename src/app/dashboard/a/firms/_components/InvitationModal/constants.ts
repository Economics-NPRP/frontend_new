'use client';

import { createContext } from 'react';

import { DefaultFirmApplication, IFirmApplication } from '@/schema/models';

export const DefaultInvitationModalContextData: IInvitationModalContext = {
	data: DefaultFirmApplication,
	open: () => {},
	close: () => {},
	openReject: () => {},
	closeReject: () => {},
};

export interface IInvitationModalContext {
	data: IFirmApplication;
	open: (data: IFirmApplication) => void;
	close: () => void;
	openReject: () => void;
	closeReject: () => void;
}

export const InvitationModalContext = createContext<IInvitationModalContext>(
	DefaultInvitationModalContextData,
);
