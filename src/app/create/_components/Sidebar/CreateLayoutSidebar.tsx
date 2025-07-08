'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useContextSelector } from 'use-context-selector';

import { CreateLayoutContext } from '@/pages/create/_components/Providers';
import { Button, Divider, Stack, Stepper, Text } from '@mantine/core';
import { IconArrowUpRight, IconCheck } from '@tabler/icons-react';

import classes from './styles.module.css';

export const CreateLayoutSidebar = () => {
	const t = useTranslations();
	const steps = useContextSelector(CreateLayoutContext, (context) => context.steps);
	const activeStep = useContextSelector(CreateLayoutContext, (context) => context.activeStep);
	const handleStepChange = useContextSelector(
		CreateLayoutContext,
		(context) => context.handleStepChange,
	);
	const shouldAllowStepSelect = useContextSelector(
		CreateLayoutContext,
		(context) => context.shouldAllowStepSelect,
	);

	const stepComponents = useMemo(
		() =>
			steps.map((step, index) => (
				<Stepper.Step
					key={index}
					label={step.label}
					description={step.description}
					allowStepSelect={shouldAllowStepSelect(index, true)}
				/>
			)),
		[steps, shouldAllowStepSelect],
	);

	return (
		<Stack className={classes.root} visibleFrom="md">
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
			<Divider className={classes.divider} />
			<Stack className={classes.help}>
				<Text className={classes.title}>{t('create.layout.sidebar.help.title')}</Text>
				<Text className={classes.description}>
					{t('create.layout.sidebar.help.description')}
				</Text>
				<Button
					className={classes.button}
					variant="outline"
					rightSection={<IconArrowUpRight size={16} />}
				>
					{t('constants.actions.contactUs.label')}
				</Button>
			</Stack>
		</Stack>
	);
};
