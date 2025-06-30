'use client';

import { useTranslations } from 'next-intl';
import { useContext } from 'react';

import { Switch } from '@/components/SwitchCase';
import { CreateLayoutContext } from '@/pages/create/_components/Providers';
import { Button, Group } from '@mantine/core';
import { IconArrowNarrowRight, IconCheck } from '@tabler/icons-react';

import classes from './styles.module.css';

export const CreateLayoutFooter = () => {
	const t = useTranslations();
	const { completeLabel, steps, activeStep, handleNextStep, handlePrevStep } =
		useContext(CreateLayoutContext);

	return (
		<Group className={classes.root}>
			<Group className={classes.left}>
				<Switch value={activeStep}>
					<Switch.Case when={0}>
						<Button className={`${classes.back} ${classes.button}`} variant="outline">
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
			</Group>
			<Group className={classes.right}>
				<Button className={`${classes.secondary} ${classes.button}`} variant="subtle">
					{t('constants.actions.saveDraft.label')}
				</Button>
				<Switch value={activeStep}>
					<Switch.Case when={steps.length - 1}>
						<Button
							className={`${classes.primary} ${classes.button}`}
							color="green"
							onClick={handleNextStep}
							rightSection={<IconCheck size={16} />}
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
		</Group>
	);
};
