'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useContextSelector } from 'use-context-selector';

import { Switch } from '@/components/SwitchCase';
import { CreateLayoutContext } from '@/pages/create/_components/Providers';
import { Button, Group } from '@mantine/core';
import { IconArrowNarrowRight, IconCheck } from '@tabler/icons-react';

import classes from './styles.module.css';

export const CreateLayoutFooter = () => {
	const t = useTranslations();
	const returnHref = useContextSelector(CreateLayoutContext, (context) => context.returnHref);
	const completeLabel = useContextSelector(
		CreateLayoutContext,
		(context) => context.completeLabel,
	);
	const isFormSubmitting = useContextSelector(
		CreateLayoutContext,
		(context) => context.isFormSubmitting,
	);
	const steps = useContextSelector(CreateLayoutContext, (context) => context.steps);
	const activeStep = useContextSelector(CreateLayoutContext, (context) => context.activeStep);
	const handleNextStep = useContextSelector(
		CreateLayoutContext,
		(context) => context.handleNextStep,
	);
	const handlePrevStep = useContextSelector(
		CreateLayoutContext,
		(context) => context.handlePrevStep,
	);

	return (
		<Group className={classes.root}>
			{activeStep < steps.length && (
				<>
					<Group className={classes.left}>
						<Switch value={activeStep}>
							<Switch.Case when={0}>
								<Button
									component={Link}
									href={returnHref}
									className={`${classes.back} ${classes.button}`}
									variant="outline"
								>
									{t('constants.actions.cancel.label')}
								</Button>
							</Switch.Case>
							<Switch.Else>
								<Button
									className={`${classes.back} ${classes.button}`}
									variant="outline"
									onClick={handlePrevStep}
								>
									{t('constants.actions.back.label')}
								</Button>
							</Switch.Else>
						</Switch>
						<Button
							className={`${classes.secondary} ${classes.button}`}
							variant="subtle"
							hiddenFrom="sm"
						>
							{t('constants.actions.saveDraft.label')}
						</Button>
					</Group>
					<Group className={classes.right}>
						<Button
							className={`${classes.secondary} ${classes.button}`}
							variant="subtle"
							visibleFrom="sm"
						>
							{t('constants.actions.saveDraft.label')}
						</Button>
						<Switch value={activeStep}>
							<Switch.Case when={steps.length - 1}>
								<Button
									className={`${classes.green} ${classes.primary} ${classes.button}`}
									type="submit"
									color="green"
									rightSection={<IconCheck size={16} />}
									loading={isFormSubmitting}
								>
									{completeLabel}
								</Button>
							</Switch.Case>
							<Switch.Else>
								<Button
									className={`${classes.primary} ${classes.button}`}
									onClick={handleNextStep}
									rightSection={<IconArrowNarrowRight size={16} />}
								>
									{t('constants.actions.continue.label')}
								</Button>
							</Switch.Else>
						</Switch>
					</Group>
				</>
			)}
		</Group>
	);
};
