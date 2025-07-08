'use client';

import { valibotResolver } from 'mantine-form-valibot-resolver';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { useContextSelector } from 'use-context-selector';
import { safeParse } from 'valibot';

import { Switch } from '@/components/SwitchCase';
import { CreateLayoutContext } from '@/pages/create/_components/Providers';
import { FinalStep } from '@/pages/create/auction/@form/Final';
import { SectorStep } from '@/pages/create/auction/@form/Sector';
import { CreateAuctionDataSchema, DefaultCreateAuctionData, ICreateAuction } from '@/schema/models';
import { List } from '@mantine/core';
import { UseFormReturnType, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

export default function CreateAuctionLayout() {
	const t = useTranslations();
	const { cycleId } = useParams();

	const setTitle = useContextSelector(CreateLayoutContext, (context) => context.setTitle);
	const setReturnHref = useContextSelector(
		CreateLayoutContext,
		(context) => context.setReturnHref,
	);
	const setReturnLabel = useContextSelector(
		CreateLayoutContext,
		(context) => context.setReturnLabel,
	);
	const setCompleteLabel = useContextSelector(
		CreateLayoutContext,
		(context) => context.setCompleteLabel,
	);
	const setHandleFormSubmit = useContextSelector(
		CreateLayoutContext,
		(context) => context.setHandleFormSubmit,
	);
	const setFormError = useContextSelector(CreateLayoutContext, (context) => context.setFormError);
	const setIsFormSubmitting = useContextSelector(
		CreateLayoutContext,
		(context) => context.setIsFormSubmitting,
	);
	const setSteps = useContextSelector(CreateLayoutContext, (context) => context.setSteps);
	const setShouldAllowStepSelect = useContextSelector(
		CreateLayoutContext,
		(context) => context.setShouldAllowStepSelect,
	);
	const handleFinalStep = useContextSelector(
		CreateLayoutContext,
		(context) => context.handleFinalStep,
	);
	const activeStep = useContextSelector(CreateLayoutContext, (context) => context.activeStep);
	const highestStepVisited = useContextSelector(
		CreateLayoutContext,
		(context) => context.highestStepVisited,
	);

	const form = useForm<ICreateAuction, (values: ICreateAuction) => ICreateAuction>({
		mode: 'uncontrolled',
		initialValues: DefaultCreateAuctionData,
		validate: (values) => {
			// if (activeStep === 0) return valibotResolver(FirstAuctionCycleDataSchema)(values);
			// if (activeStep === 1) return valibotResolver(SectorAuctionCycleDataSchema)(values);
			//	TODO: uncomment when done with team assignment ui and logic
			// if (activeStep === 2) return valibotResolver(SecondAuctionCycleDataSchema)(values);
			//	TODO: Uncomment when kpis are implemented in backend
			// if (activeStep === 3) return valibotResolver(ThirdAuctionCycleDataSchema)(values);
			return {};
		},
		onValuesChange: () => setFormError([]),
		transformValues: (values) =>
			safeParse(CreateAuctionDataSchema, values).output as ICreateAuction,
	});

	const handleFormSubmit = useCallback(
		(formData: ICreateAuction) => {
			setIsFormSubmitting(true);
			setFormError([]);
		},
		[handleFinalStep],
	);

	useEffect(() => {
		setTitle(t('create.auction.title'));
		setReturnHref(cycleId ? `/dashboard/a/cycles/${cycleId}` : '/marketplace');
		setReturnLabel(
			cycleId
				? t('constants.return.cyclePage.label')
				: t('constants.return.marketplace.label'),
		);
		setCompleteLabel(t('create.auction.complete.label'));
		setSteps([
			{
				label: t('create.auction.sector.steps.label'),
				description: t('create.auction.sector.steps.description'),
			},
		]);
	}, [t, cycleId]);

	useEffect(() => setHandleFormSubmit(() => form.onSubmit(handleFormSubmit)), [handleFormSubmit]);

	useEffect(() => {
		if (form.errors.sectors)
			setFormError([<List.Item key={0}>{form.errors.sectors.toString()}</List.Item>]);
	}, [form.errors.sectors]);

	useEffect(() => {
		setShouldAllowStepSelect(() => (step: number, isStepper?: boolean) => {
			if (step > 5) return false;
			if (isStepper && highestStepVisited < step) return false;
			if (activeStep === 5) return false;
			//	Cant go to next step if current step has errors
			if (!isStepper && step > activeStep && form.validate().hasErrors) return false;
			return true;
		});
	}, [activeStep, highestStepVisited]);

	return (
		<Switch value={activeStep}>
			<Switch.Case when={0}>
				<SectorStep form={form} />
			</Switch.Case>
			<Switch.Case when={5}>
				<FinalStep />
			</Switch.Case>
		</Switch>
	);
}

export interface ICreateAuctionStepProps {
	form: UseFormReturnType<ICreateAuction, (values: ICreateAuction) => ICreateAuction>;
}
