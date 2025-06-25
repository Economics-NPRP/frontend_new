'use client';

import { PropsWithChildren, useCallback, useMemo, useState } from 'react';

import {
	DefaultRegistrationPageContextData,
	RegistrationPageContext,
} from '@/pages/(auth)/(external)/register/_components/Providers';

export const PageProvider = ({ children }: PropsWithChildren) => {
	const [activeStep, setActiveStep] = useState(DefaultRegistrationPageContextData.activeStep);
	const [highestStepVisited, setHighestStepVisited] = useState(0);

	const handleStepChange = useCallback((step: number) => {
		if (step < 0 || step > 4) return;
		setActiveStep(step);
		setHighestStepVisited((prev) => Math.max(prev, step));
	}, []);

	const handleNextStep = useCallback(
		() => handleStepChange(activeStep + 1),
		[activeStep, handleStepChange],
	);
	const handlePrevStep = useCallback(
		() => handleStepChange(activeStep - 1),
		[activeStep, handleStepChange],
	);

	const shouldAllowStepSelect = useMemo(
		() => (step: number) => highestStepVisited >= step && activeStep !== step,
		[highestStepVisited, activeStep],
	);

	return (
		<RegistrationPageContext.Provider
			value={{
				activeStep,
				handleStepChange,
				handleNextStep,
				handlePrevStep,
				shouldAllowStepSelect,
			}}
		>
			{children}
		</RegistrationPageContext.Provider>
	);
};
