'use client';

import { useContext, useMemo } from 'react';

import { CreateLayoutContext } from '@/pages/create/_components/Providers';
import { Stack, Stepper } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

import classes from './styles.module.css';

export const CreateLayoutSidebar = () => {
	const { steps, activeStep, handleStepChange, shouldAllowStepSelect } =
		useContext(CreateLayoutContext);

	const stepComponents = useMemo(
		() =>
			steps.map((step, index) => (
				<Stepper.Step
					key={index}
					label={step.label}
					description={step.description}
					allowStepSelect={shouldAllowStepSelect(index)}
				/>
			)),
		[steps, shouldAllowStepSelect],
	);

	return (
		<Stack className={classes.root}>
			<Stepper
				classNames={{
					root: classes.stepper,
					step: classes.step,
					verticalSeparator: classes.separator,
					stepIcon: classes.icon,
					stepBody: classes.body,
					stepLabel: classes.label,
					content: classes.content,
					stepDescription: classes.description,
				}}
				completedIcon={<IconCheck size={20} />}
				active={activeStep}
				onStepClick={handleStepChange}
				orientation="vertical"
				children={stepComponents}
			/>
		</Stack>
	);
};
