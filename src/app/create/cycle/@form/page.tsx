'use client';

import { useTranslations } from 'next-intl';
import { useContext, useEffect } from 'react';

import { CreateLayoutContext } from '@/pages/create/_components/Providers';

export default function CreateCycleLayout() {
	const t = useTranslations();
	const { setTitle, setReturnHref, setReturnLabel, setCompleteLabel, setSteps } =
		useContext(CreateLayoutContext);

	useEffect(() => {
		setTitle('Create New Auction Cycle');
		setReturnHref('/dashboard/a/cycles');
		setReturnLabel(t('constants.return.dashboard.label'));
		setCompleteLabel('Create Cycle');
		setSteps([
			{
				label: 'Basic Information',
				description: 'Set the name and duration of this auction cycle',
			},
			{
				label: 'Team Assignment',
				description: 'Assign internal teams or managers to oversee this cycle',
			},
			{
				label: 'Define KPIs',
				description: 'Optionally set target metrics to track the performance of this cycle',
			},
		]);
	}, [t, setTitle, setReturnHref, setReturnLabel]);

	return <></>;
}
