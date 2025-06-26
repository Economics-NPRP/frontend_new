'use client';

import { valibotResolver } from 'mantine-form-valibot-resolver';
import { PropsWithChildren, ReactElement, useCallback, useMemo, useState } from 'react';

import {
	DefaultRegistrationPageContextData,
	RegistrationPageContext,
} from '@/pages/(auth)/(external)/register/_components/Providers';
import {
	DefaultCreateFirmApplication,
	FirstFirmApplicationDataSchema,
	FourthFirmApplicationDataSchema,
	ICreateFirmApplication,
	SecondFirmApplicationDataSchema,
	ThirdFirmApplicationDataSchema,
} from '@/schema/models';
import { List } from '@mantine/core';
import { useForm } from '@mantine/form';

export const PageProvider = ({ children }: PropsWithChildren) => {
	const [activeStep, setActiveStep] = useState(DefaultRegistrationPageContextData.activeStep);
	const [highestStepVisited, setHighestStepVisited] = useState(0);
	const [formError, setFormError] = useState<Array<ReactElement>>([]);

	const form = useForm<ICreateFirmApplication>({
		mode: 'uncontrolled',
		initialValues: DefaultCreateFirmApplication,
		validate: (values) => {
			//	@ts-expect-error - TODO: check why crn is giving an error
			if (activeStep === 0) return valibotResolver(FirstFirmApplicationDataSchema)(values);
			if (activeStep === 1) return valibotResolver(SecondFirmApplicationDataSchema)(values);
			if (activeStep === 2) return valibotResolver(ThirdFirmApplicationDataSchema)(values);
			if (activeStep === 3) return valibotResolver(FourthFirmApplicationDataSchema)(values);
			return {};
		},
		onValuesChange: () => setFormError([]),
		transformValues: (values) => ({
			...values,
			websites: [values.websites] as unknown as string,
		}),
	});

	const handleStepChange = useCallback(
		(step: number) => {
			if (step < 0 || step > 4) return;

			//	If we are going to next step, validate the form first
			let newStep = step;
			if (step > activeStep && form.validate().hasErrors) {
				newStep = activeStep;
				if (form.errors.sectors)
					setFormError([<List.Item key={0}>{form.errors.sectors.toString()}</List.Item>]);
			}

			if (newStep === activeStep) return;

			setFormError([]);
			setActiveStep(newStep);
			setHighestStepVisited((prev) => Math.max(prev, newStep));
		},
		[activeStep, highestStepVisited, form],
	);

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
				form,
				formError,
				setFormError,
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
