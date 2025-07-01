'use client';

import { PropsWithChildren, useCallback, useState } from 'react';

import {
	CreateLayoutContext,
	DefaultCreateLayoutContextData,
} from '@/pages/create/_components/Providers';

export const CreateLayoutProvider = ({ children }: PropsWithChildren) => {
	const [title, setTitle] = useState(DefaultCreateLayoutContextData.title);
	const [returnHref, setReturnHref] = useState(DefaultCreateLayoutContextData.returnHref);
	const [returnLabel, setReturnLabel] = useState(DefaultCreateLayoutContextData.returnLabel);
	const [completeLabel, setCompleteLabel] = useState(
		DefaultCreateLayoutContextData.completeLabel,
	);

	const [steps, setSteps] = useState(DefaultCreateLayoutContextData.steps);
	const [activeStep, setActiveStep] = useState(DefaultCreateLayoutContextData.activeStep);
	const [highestStepVisited, setHighestStepVisited] = useState(
		DefaultCreateLayoutContextData.highestStepVisited,
	);
	const [shouldAllowNextStep, setShouldAllowNextStep] = useState(
		() => DefaultCreateLayoutContextData.shouldAllowNextStep,
	);
	const [shouldAllowStepSelect, setShouldAllowStepSelect] = useState(
		() => DefaultCreateLayoutContextData.shouldAllowStepSelect,
	);

	const handleStepChange = useCallback(
		(step: number) => {
			if (step === activeStep) return;
			if (!shouldAllowNextStep(activeStep)) return;

			setActiveStep(step);
			setHighestStepVisited((prev) => Math.max(prev, step));
		},
		[activeStep, shouldAllowNextStep],
	);

	const handleNextStep = useCallback(
		() => handleStepChange(activeStep + 1),
		[activeStep, handleStepChange],
	);
	const handlePrevStep = useCallback(
		() => handleStepChange(activeStep - 1),
		[activeStep, handleStepChange],
	);

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

				steps,
				setSteps,

				activeStep,
				handleStepChange,
				handleNextStep,
				handlePrevStep,

				highestStepVisited,
				setHighestStepVisited,

				shouldAllowNextStep,
				setShouldAllowNextStep,

				shouldAllowStepSelect,
				setShouldAllowStepSelect,
			}}
		>
			{children}
		</CreateLayoutContext.Provider>
	);
};
