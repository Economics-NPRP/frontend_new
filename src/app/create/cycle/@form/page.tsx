'use client';

import { useTranslations } from 'next-intl';
import { useContext, useEffect } from 'react';

import { Switch } from '@/components/SwitchCase';
import { CreateLayoutContext } from '@/pages/create/_components/Providers';
import { FirstStep } from '@/pages/create/cycle/@form/First';
import { SecondStep } from '@/pages/create/cycle/@form/Second';

export default function CreateCycleLayout() {
	const t = useTranslations();
	const { setTitle, setReturnHref, setReturnLabel, setCompleteLabel, setSteps, activeStep } =
		useContext(CreateLayoutContext);

	useEffect(() => {
		setTitle(t('create.cycle.title'));
		setReturnHref('/dashboard/a/cycles');
		setReturnLabel(t('constants.return.dashboard.label'));
		setCompleteLabel(t('create.cycle.complete.label'));
		setSteps([
			{
				label: t('create.cycle.first.steps.label'),
				description: t('create.cycle.first.steps.description'),
			},
			{
				label: t('create.cycle.second.steps.label'),
				description: t('create.cycle.second.steps.description'),
			},
			{
				label: t('create.cycle.third.steps.label'),
				description: t('create.cycle.third.steps.description'),
			},
			{
				label: t('create.cycle.fourth.steps.label'),
				description: t('create.cycle.fourth.steps.description'),
			},
		]);
	}, [t, setTitle, setReturnHref, setReturnLabel]);

	return (
		<Switch value={activeStep}>
			<Switch.Case when={0}>
				<FirstStep />
			</Switch.Case>
			<Switch.Case when={1}>
				<SecondStep />
			</Switch.Case>
		</Switch>
	);
}
