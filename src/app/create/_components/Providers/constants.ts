'use client';

import { Dispatch, ReactElement, SetStateAction } from 'react';
import { createContext } from 'use-context-selector';

export const DefaultCreateLayoutContextData: ICreateLayoutContext = {
	title: '',
	setTitle: () => {},

	returnHref: '/',
	setReturnHref: () => {},

	returnLabel: 'Back',
	setReturnLabel: () => {},

	completeLabel: 'Complete',
	setCompleteLabel: () => {},

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

	highestStepVisited: 0,
	setHighestStepVisited: () => () => 0,

	shouldAllowStepSelect: () => true,
	setShouldAllowStepSelect: () => () => true,
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

	highestStepVisited: number;
	setHighestStepVisited: Dispatch<SetStateAction<number>>;

	/** If true, the user can select the specified step or navigate to it  */
	shouldAllowStepSelect: (step: number, isStepper?: boolean) => boolean;
	setShouldAllowStepSelect: Dispatch<
		SetStateAction<(step: number, isStepper?: boolean) => boolean>
	>;
}

export const CreateLayoutContext = createContext<ICreateLayoutContext>(
	DefaultCreateLayoutContextData,
);
