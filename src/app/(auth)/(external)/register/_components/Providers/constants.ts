'use client';

import { ReactElement, createContext } from 'react';

import { ICreateFirmApplication } from '@/schema/models';
import { UseFormReturnType } from '@mantine/form';

export const DefaultRegistrationPageContextData: IRegistrationPageContext = {
	form: {} as UseFormReturnType<
		ICreateFirmApplication,
		(values: ICreateFirmApplication) => ICreateFirmApplication
	>,
	formError: [],
	setFormError: () => {},
	activeStep: 0,
	handleStepChange: () => {},
	handleNextStep: () => {},
	handlePrevStep: () => {},
	shouldAllowStepSelect: () => true,
};

export interface IRegistrationPageContext {
	form: UseFormReturnType<
		ICreateFirmApplication,
		(values: ICreateFirmApplication) => ICreateFirmApplication
	>;
	formError: Array<ReactElement>;
	setFormError: (errors: Array<ReactElement>) => void;
	activeStep: number;
	handleStepChange: (step: number) => void;
	handleNextStep: () => void;
	handlePrevStep: () => void;
	shouldAllowStepSelect: (step: number) => boolean;
}

export const RegistrationPageContext = createContext<IRegistrationPageContext>(
	DefaultRegistrationPageContextData,
);
