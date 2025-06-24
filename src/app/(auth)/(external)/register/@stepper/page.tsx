'use client';

import { useTranslations } from 'next-intl';
import { useContext } from 'react';

import { RegistrationPageContext } from '@/pages/(auth)/(external)/register/_components/Providers';
import { Stepper } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

import classes from './styles.module.css';

export default function RegistrationStepper() {
	const t = useTranslations();
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
				separator: classes.separator,
				content: classes.content,
			}}
		>
			<Stepper.Step
				label={t('auth.register.stepper.first.label')}
				allowStepSelect={shouldAllowStepSelect(0)}
			></Stepper.Step>
			<Stepper.Step
				label={t('auth.register.stepper.second.label')}
				allowStepSelect={shouldAllowStepSelect(1)}
			></Stepper.Step>
			<Stepper.Step
				label={t('auth.register.stepper.third.label')}
				allowStepSelect={shouldAllowStepSelect(2)}
			></Stepper.Step>
			<Stepper.Step
				label={t('auth.register.stepper.fourth.label')}
				allowStepSelect={shouldAllowStepSelect(3)}
			></Stepper.Step>
			<Stepper.Completed>1</Stepper.Completed>
		</Stepper>
	);
}
