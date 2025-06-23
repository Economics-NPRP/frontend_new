'use client';

import { useContext } from 'react';

import { RegistrationPageContext } from '@/pages/(auth)/(external)/register/_components/Providers';
import { Stepper } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

import classes from './styles.module.css';

export default function RegistrationStepper() {
	const { activeStep, handleStepChange, shouldAllowStepSelect } =
		useContext(RegistrationPageContext);

	return (
		<Stepper
			active={activeStep}
			onStepClick={handleStepChange}
			completedIcon={<IconCheck size={24} />}
			classNames={{
				root: classes.root,
				step: classes.step,
				stepIcon: classes.icon,
				stepBody: classes.body,
				stepLabel: classes.label,
				content: classes.content,
			}}
		>
			<Stepper.Step
				label="Basic Information"
				allowStepSelect={shouldAllowStepSelect(0)}
			></Stepper.Step>
			<Stepper.Step
				label="Business Sector"
				allowStepSelect={shouldAllowStepSelect(1)}
			></Stepper.Step>
			<Stepper.Step
				label="Primary Contact Details"
				allowStepSelect={shouldAllowStepSelect(2)}
			></Stepper.Step>
			<Stepper.Step
				label="Review Details"
				allowStepSelect={shouldAllowStepSelect(3)}
			></Stepper.Step>
			<Stepper.Completed>1</Stepper.Completed>
		</Stepper>
	);
}
