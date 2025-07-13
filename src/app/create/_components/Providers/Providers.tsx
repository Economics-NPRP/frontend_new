'use client';

import { useSearchParams } from 'next/navigation';
import { PropsWithChildren, ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { useContextSelector } from 'use-context-selector';

import {
	CreateLayoutContext,
	DefaultCreateLayoutContextData,
} from '@/pages/create/_components/Providers';
import { UseFormReturnType } from '@mantine/form';

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
	const searchParams = useSearchParams();

	const [title, setTitle] = useState(DefaultCreateLayoutContextData.title);
	const [returnHref, setReturnHref] = useState(DefaultCreateLayoutContextData.returnHref);
	const [returnLabel, setReturnLabel] = useState(DefaultCreateLayoutContextData.returnLabel);
	const [completeLabel, setCompleteLabel] = useState(
		DefaultCreateLayoutContextData.completeLabel,
	);

	const formRef = useRef<UseFormReturnType<any, (values: any) => any>>(
		DefaultCreateLayoutContextData.formRef.current,
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

	const [isStepValid, setIsStepValid] = useState(
		() => DefaultCreateLayoutContextData.isStepValid,
	);
	const shouldAllowStepSelect = useCallback(
		(step: number, type?: 'stepper' | 'searchParams') => {
			if (!formRef.current) return false;

			//	steps.length - 1 is to handle rare case where user is taken to final step using this instead of handleFinalStep
			const clampedStep = Math.max(0, Math.min(step, steps.length - 1));

			//	Dont skip to this step if previous steps have errors
			if (type === 'searchParams' && clampedStep !== activeStep && !formRef.current.isValid())
				return false;
			//	Can only click on steps that have been visited
			if (type === 'stepper' && highestStepVisited < clampedStep) return false;
			//	Disable clicking on stepper if current step is final step
			if (type === 'stepper' && activeStep === steps.length) return false;
			//	Cant go to next step if current step has errors
			if (!type && clampedStep > activeStep && formRef.current.validate().hasErrors)
				return false;
			return true;
		},
		[activeStep, highestStepVisited, formRef.current, steps.length],
	);

	const handleStepChange = useCallback(
		(step: number) => {
			if (step === activeStep) return;
			if (!shouldAllowStepSelect(step)) return;

			const clampedStep = Math.max(0, step);
			setHighestStepVisited((prev) => Math.max(prev, clampedStep));
			setActiveStep(clampedStep);
			setFormError([]);
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
	const handleSearchParamStep = useCallback(() => {
		if (!formRef.current) return;
		if (!searchParams.get('step')) return;

		let step = Math.max(0, Number(searchParams.get('step')));
		if (isNaN(step)) return;

		//	Check if previous steps are valid, if not, go to first valid step
		for (let i = step - 1; i >= 0; i--) {
			if (isStepValid(i)) break;
			step = i;
		}

		setHighestStepVisited((prev) => Math.max(prev, step));
		setActiveStep(step);
	}, [searchParams, isStepValid]);

	//	Whenever the step search param changes, update the active step
	useEffect(() => handleSearchParamStep(), [handleSearchParamStep]);

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

				formRef,

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
				handleSearchParamStep,

				highestStepVisited,
				setHighestStepVisited,

				shouldAllowStepSelect,

				isStepValid,
				setIsStepValid,
			}}
		>
			{children}
		</CreateLayoutContext.Provider>
	);
};
