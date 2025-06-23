'use client';

import { useContext } from 'react';

import { RegistrationPageContext } from '@/pages/(auth)/(external)/register/_components/Providers';
import { Stepper } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

import classes from './styles.module.css';

export default function RegistrationStepper() {
	const { activeStep, setActiveStep } = useContext(RegistrationPageContext);

	return (
		<Stepper
			active={activeStep}
			onStepClick={setActiveStep}
			completedIcon={<IconCheck size={24} />}
			classNames={{
				root: classes.root,
				step: classes.step,
				stepIcon: classes.icon,
				stepBody: classes.body,
				stepLabel: classes.label,
			}}
		>
			<Stepper.Step label="Basic Information"></Stepper.Step>
			<Stepper.Step label="Business Sector"></Stepper.Step>
			<Stepper.Step label="Primary Contact Details"></Stepper.Step>
			<Stepper.Step label="Preview Account"></Stepper.Step>
		</Stepper>
	);
}
