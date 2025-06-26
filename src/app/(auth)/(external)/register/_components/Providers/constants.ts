'use client';

import { createContext } from 'react';

export const DefaultRegistrationPageContextData: IRegistrationPageContext = {
	activeStep: 0,
	handleStepChange: () => {},
	handleNextStep: () => {},
	handlePrevStep: () => {},
	shouldAllowStepSelect: () => true,
};

export interface IRegistrationPageContext {
	activeStep: number;
	handleStepChange: (step: number) => void;
	handleNextStep: () => void;
	handlePrevStep: () => void;
	shouldAllowStepSelect: (step: number) => boolean;
}

export const RegistrationPageContext = createContext<IRegistrationPageContext>(
	DefaultRegistrationPageContextData,
);
