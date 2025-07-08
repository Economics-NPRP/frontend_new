'use client';

import { PropsWithChildren, ReactElement, useCallback, useState } from 'react';
import { useContextSelector } from 'use-context-selector';

import {
	CreateLayoutContext,
	DefaultCreateLayoutContextData,
} from '@/pages/create/_components/Providers';

export const FromWrapper = ({ children }: PropsWithChildren) => {
	const handleFormSubmit = useContextSelector(
		CreateLayoutContext,
		(context) => context.handleFormSubmit,
	);

	return (
		<form className="contents" onSubmit={handleFormSubmit}>
			{children}
		</form>
	);
};

export const CreateLayoutProvider = ({ children }: PropsWithChildren) => {
	const [title, setTitle] = useState(DefaultCreateLayoutContextData.title);
	const [returnHref, setReturnHref] = useState(DefaultCreateLayoutContextData.returnHref);
	const [returnLabel, setReturnLabel] = useState(DefaultCreateLayoutContextData.returnLabel);
	const [completeLabel, setCompleteLabel] = useState(
		DefaultCreateLayoutContextData.completeLabel,
	);

	const [handleFormSubmit, setHandleFormSubmit] = useState(
		() => DefaultCreateLayoutContextData.handleFormSubmit,
	);
	const [formError, setFormError] = useState<Array<ReactElement>>(
		DefaultCreateLayoutContextData.formError,
	);
	const [isFormSubmitting, setIsFormSubmitting] = useState<boolean>(
		DefaultCreateLayoutContextData.isFormSubmitting,
	);

	const [steps, setSteps] = useState(DefaultCreateLayoutContextData.steps);
	const [activeStep, setActiveStep] = useState(DefaultCreateLayoutContextData.activeStep);
	const [highestStepVisited, setHighestStepVisited] = useState(
		DefaultCreateLayoutContextData.highestStepVisited,
	);
	const [shouldAllowStepSelect, setShouldAllowStepSelect] = useState(
		() => DefaultCreateLayoutContextData.shouldAllowStepSelect,
	);

	const handleStepChange = useCallback(
		(step: number) => {
			if (step === activeStep) return;
			if (!shouldAllowStepSelect(step)) return;

			setActiveStep(step);
			setHighestStepVisited((prev) => Math.max(prev, step));
		},
		[activeStep, shouldAllowStepSelect],
	);

	const handleNextStep = useCallback(
		() => handleStepChange(activeStep + 1),
		[activeStep, handleStepChange],
	);
	const handlePrevStep = useCallback(
		() => handleStepChange(activeStep - 1),
		[activeStep, handleStepChange],
	);
	const handleFinalStep = useCallback(() => {
		setActiveStep(steps.length);
		setHighestStepVisited((prev) => Math.max(prev, steps.length));
	}, [steps]);

	return (
		<CreateLayoutContext.Provider
			value={{
				title,
				setTitle,

				returnHref,
				setReturnHref,

				returnLabel,
				setReturnLabel,

				completeLabel,
				setCompleteLabel,

				handleFormSubmit,
				setHandleFormSubmit,

				formError,
				setFormError,

				isFormSubmitting,
				setIsFormSubmitting,

				steps,
				setSteps,

				activeStep,
				handleStepChange,
				handleNextStep,
				handlePrevStep,
				handleFinalStep,

				highestStepVisited,
				setHighestStepVisited,

				shouldAllowStepSelect,
				setShouldAllowStepSelect,
			}}
		>
			{children}
		</CreateLayoutContext.Provider>
	);
};
