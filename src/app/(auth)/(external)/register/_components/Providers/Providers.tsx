'use client';

import { PropsWithChildren, useCallback, useState } from 'react';

import { RegistrationPageContext } from '@/pages/(auth)/(external)/register/_components/Providers';

export const PageProvider = ({ children }: PropsWithChildren) => {
	const [activeStep, setActiveStep] = useState(0);

	const handleNextStep = useCallback(() => setActiveStep((prev) => prev + 1), []);
	const handlePrevStep = useCallback(() => setActiveStep((prev) => prev - 1), []);

	return (
		<RegistrationPageContext.Provider
			value={{
				activeStep,
				setActiveStep,
				handleNextStep,
				handlePrevStep,
			}}
		>
			{children}
		</RegistrationPageContext.Provider>
	);
};
