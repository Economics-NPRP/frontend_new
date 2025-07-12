'use client';

import { Dispatch, MutableRefObject, ReactElement, SetStateAction } from 'react';
import { createContext } from 'use-context-selector';

import { UseFormReturnType } from '@mantine/form';

export const DefaultCreateLayoutContextData: ICreateLayoutContext = {
	title: '',
	setTitle: () => {},

	returnHref: '/',
	setReturnHref: () => {},

	returnLabel: 'Back',
	setReturnLabel: () => {},

	completeLabel: 'Complete',
	setCompleteLabel: () => {},

	formRef: { current: null },

	handleFormSubmit: () => {},
	setHandleFormSubmit: () => () => {},

	formError: [],
	setFormError: () => [],

	isFormSubmitting: false,
	setIsFormSubmitting: () => () => false,

	steps: [],
	setSteps: () => [],

	activeStep: 0,
	handleStepChange: () => {},
	handleNextStep: () => {},
	handlePrevStep: () => {},
	handleFinalStep: () => {},
	handleSearchParamStep: () => {},

	highestStepVisited: 0,
	setHighestStepVisited: () => () => 0,

	shouldAllowStepSelect: () => false,

	isStepValid: () => false,
	setIsStepValid: () => () => false,
};

export interface ICreateLayoutContext {
	title: string;
	setTitle: (title: string) => void;

	returnHref: string;
	setReturnHref: (href: string) => void;

	returnLabel: string;
	setReturnLabel: (label: string) => void;

	completeLabel: string;
	setCompleteLabel: (label: string) => void;

	formRef: MutableRefObject<UseFormReturnType<any, (values: any) => any> | null>;

	handleFormSubmit: (values: any) => void;
	setHandleFormSubmit: (handler: (values: any) => void) => void;

	formError: Array<ReactElement>;
	setFormError: (errors: Array<ReactElement>) => void;

	isFormSubmitting: boolean;
	setIsFormSubmitting: Dispatch<SetStateAction<boolean>>;

	steps: Array<{ label: string; description: string }>;
	setSteps: (steps: Array<{ label: string; description: string }>) => void;

	activeStep: number;
	handleStepChange: (step: number) => void;
	handleNextStep: () => void;
	handlePrevStep: () => void;
	handleFinalStep: () => void;
	handleSearchParamStep: () => void;

	highestStepVisited: number;
	setHighestStepVisited: Dispatch<SetStateAction<number>>;

	//	If true, the user can select the specified step or navigate to it
	shouldAllowStepSelect: (step: number, type?: 'stepper' | 'searchParams') => boolean;

	//	Function to check if the current form is valid for the specified step
	isStepValid: (step: number) => boolean;
	setIsStepValid: Dispatch<SetStateAction<(step: number) => boolean>>;
}

export const CreateLayoutContext = createContext<ICreateLayoutContext>(
	DefaultCreateLayoutContextData,
);
