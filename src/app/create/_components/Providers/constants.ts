'use client';

import { Dispatch, SetStateAction, createContext } from 'react';

export const DefaultCreateLayoutContextData: ICreateLayoutContext = {
	title: '',
	setTitle: () => {},

	returnHref: '/',
	setReturnHref: () => {},

	returnLabel: 'Back',
	setReturnLabel: () => {},

	completeLabel: 'Complete',
	setCompleteLabel: () => {},

	steps: [],
	setSteps: () => [],

	activeStep: 0,
	handleStepChange: () => {},
	handleNextStep: () => {},
	handlePrevStep: () => {},

	highestStepVisited: 0,
	setHighestStepVisited: () => () => 0,

	shouldAllowNextStep: () => true,
	setShouldAllowNextStep: () => () => true,

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

	steps: Array<{ label: string; description: string }>;
	setSteps: (steps: Array<{ label: string; description: string }>) => void;

	activeStep: number;
	handleStepChange: (step: number) => void;
	handleNextStep: () => void;
	handlePrevStep: () => void;

	highestStepVisited: number;
	setHighestStepVisited: Dispatch<SetStateAction<number>>;

	/** If true, the user can go to the next step */
	shouldAllowNextStep: (currentStep: number) => boolean;
	setShouldAllowNextStep: Dispatch<SetStateAction<(currentStep: number) => boolean>>;

	/** Used for the stepper component to determine if a step can be selected */
	shouldAllowStepSelect: (step: number) => boolean;
	setShouldAllowStepSelect: Dispatch<SetStateAction<(step: number) => boolean>>;
}

export const CreateLayoutContext = createContext<ICreateLayoutContext>(
	DefaultCreateLayoutContextData,
);
