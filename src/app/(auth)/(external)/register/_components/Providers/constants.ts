'use client';

import { createContext } from 'react';

export const DefaultRegistrationPageContextData: IRegistrationPageContext = {
	activeStep: 0,
	setActiveStep: () => {},
	handleNextStep: () => {},
	handlePrevStep: () => {},
};

export interface IRegistrationPageContext {
	activeStep: number;
	setActiveStep: (step: number) => void;
	handleNextStep: () => void;
	handlePrevStep: () => void;
}

export const RegistrationPageContext = createContext<IRegistrationPageContext>(
	DefaultRegistrationPageContextData,
);
