'use client';

import { valibotResolver } from 'mantine-form-valibot-resolver';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect } from 'react';
import { useContextSelector } from 'use-context-selector';
import { safeParse } from 'valibot';

import { Switch } from '@/components/SwitchCase';
import { createAuctionCycle } from '@/lib/cycles';
import { CreateLayoutContext } from '@/pages/create/_components/Providers';
import { FinalStep } from '@/pages/create/cycle/@form/Final';
import { FirstStep } from '@/pages/create/cycle/@form/First';
import { SecondStep } from '@/pages/create/cycle/@form/Second';
import { SectorStep } from '@/pages/create/cycle/@form/Sector';
import { ThirdStep } from '@/pages/create/cycle/@form/Third';
import {
	CreateAuctionCycleDataSchema,
	DefaultCreateAuctionCycleData,
	FirstAuctionCycleDataSchema,
	ICreateAuctionCycle,
	ICreateAuctionCycleOutput,
	SecondAuctionCycleDataSchema,
	SectorAuctionCycleDataSchema,
} from '@/schema/models';
import { List } from '@mantine/core';
import { UseFormReturnType, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

export default function CreateCycleLayout() {
	const t = useTranslations();

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

	const form = useForm<
		ICreateAuctionCycle,
		(values: ICreateAuctionCycle) => ICreateAuctionCycleOutput
	>({
		mode: 'uncontrolled',
		initialValues: DefaultCreateAuctionCycleData,
		validate: (values) => {
			if (activeStep === 0) return valibotResolver(FirstAuctionCycleDataSchema)(values);
			if (activeStep === 1) return valibotResolver(SectorAuctionCycleDataSchema)(values);
			//	TODO: uncomment when done with team assignment ui and logic
			// if (activeStep === 2) return valibotResolver(SecondAuctionCycleDataSchema)(values);
			//	TODO: Uncomment when kpis are implemented in backend
			// if (activeStep === 3) return valibotResolver(ThirdAuctionCycleDataSchema)(values);
			return {};
		},
		onValuesChange: () => setFormError([]),
		transformValues: (values) =>
			safeParse(CreateAuctionCycleDataSchema, values).output as ICreateAuctionCycleOutput,
	});

	const handleFormSubmit = useCallback(
		(formData: ICreateAuctionCycleOutput) => {
			setIsFormSubmitting(true);
			setFormError([]);

			createAuctionCycle(formData)
				.then((res) => {
					if (res.ok) handleFinalStep();
					else {
						const errorMessage = (res.errors || ['Unknown error']).join(', ');
						console.error('Error creating a new auction cycle:', errorMessage);
						setFormError(
							(res.errors || []).map((error, index) => (
								<List.Item key={index}>{error}</List.Item>
							)),
						);
						notifications.show({
							color: 'red',
							title: t('create.cycle.error.title'),
							message: errorMessage,
							position: 'bottom-center',
						});
					}
					setIsFormSubmitting(false);
				})
				.catch((err) => {
					console.error('Error creating a new auction cycle:', err);
					setFormError([
						<List.Item key={0}>{t('create.cycle.error.message')}</List.Item>,
					]);
					setIsFormSubmitting(false);
				});
		},
		[handleFinalStep],
	);

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
				label: t('create.cycle.sector.steps.label'),
				description: t('create.cycle.sector.steps.description'),
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
	}, [t]);

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
				<FirstStep form={form} />
			</Switch.Case>
			<Switch.Case when={1}>
				<SectorStep form={form} />
			</Switch.Case>
			<Switch.Case when={2}>
				<SecondStep form={form} />
			</Switch.Case>
			<Switch.Case when={3}>
				<ThirdStep form={form} />
			</Switch.Case>
			<Switch.Case when={5}>
				<FinalStep />
			</Switch.Case>
		</Switch>
	);
}

export interface ICreateCycleStepProps {
	form: UseFormReturnType<
		ICreateAuctionCycle,
		(values: ICreateAuctionCycle) => ICreateAuctionCycleOutput
	>;
}
