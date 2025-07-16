'use client';

import { valibotResolver } from 'mantine-form-valibot-resolver';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { useContextSelector } from 'use-context-selector';
import { safeParse } from 'valibot';

import { Switch } from '@/components/SwitchCase';
import { SingleCycleContext } from '@/contexts';
import { useCreateCycle } from '@/hooks';
import { CreateLayoutContext } from '@/pages/create/_components/Providers';
import { FinalStep } from '@/pages/create/cycle/@form/Final';
import { FirstStep } from '@/pages/create/cycle/@form/First';
import { SecondStep } from '@/pages/create/cycle/@form/Second';
import { SectorStep } from '@/pages/create/cycle/@form/Sector';
import { ThirdStep } from '@/pages/create/cycle/@form/Third';
import {
	CreateAuctionCycleDataSchema,
	CreateAuctionCycleDataSchemaTransformer,
	FirstAuctionCycleDataSchema,
	ICreateAuctionCycle,
	ICreateAuctionCycleOutput,
	ReadToCreateAuctionCycleDataTransformer,
	SectorAuctionCycleDataSchema,
} from '@/schema/models';
import { List } from '@mantine/core';
import { UseFormReturnType, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

export default function CreateCycleLayout() {
	const t = useTranslations();
	const searchParams = useSearchParams();
	const singleCycle = useContext(SingleCycleContext);

	const [disabled, setDisabled] = useState(false);
	const createCycle = useCreateCycle();

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
	const formRef = useContextSelector(CreateLayoutContext, (context) => context.formRef);
	const setFormError = useContextSelector(CreateLayoutContext, (context) => context.setFormError);
	const setIsFormSubmitting = useContextSelector(
		CreateLayoutContext,
		(context) => context.setIsFormSubmitting,
	);
	const setSteps = useContextSelector(CreateLayoutContext, (context) => context.setSteps);
	const handleFinalStep = useContextSelector(
		CreateLayoutContext,
		(context) => context.handleFinalStep,
	);
	const handleSearchParamStep = useContextSelector(
		CreateLayoutContext,
		(context) => context.handleSearchParamStep,
	);
	const activeStep = useContextSelector(CreateLayoutContext, (context) => context.activeStep);
	const setIsStepValid = useContextSelector(
		CreateLayoutContext,
		(context) => context.setIsStepValid,
	);

	const handleIsStepValid = useCallback((step: number, values: ICreateAuctionCycle) => {
		const step1 = valibotResolver(FirstAuctionCycleDataSchema)(values);
		const step2 = valibotResolver(SectorAuctionCycleDataSchema)(values);
		const step3 = {};
		const step4 = {};
		const step5 = valibotResolver(CreateAuctionCycleDataSchema)(values);

		if (step >= 0 && Object.keys(step1).length > 0) return step1;
		if (step >= 1 && Object.keys(step2).length > 0) return step2;
		if (step >= 2 && Object.keys(step3).length > 0) return step3;
		if (step >= 3 && Object.keys(step4).length > 0) return step4;
		if (step >= 4 && Object.keys(step5).length > 0) return step5;
		return {};
	}, []);

	const form = useForm<
		ICreateAuctionCycle,
		(values: ICreateAuctionCycle) => ICreateAuctionCycleOutput
	>({
		mode: 'uncontrolled',
		validateInputOnBlur: true,
		clearInputErrorOnChange: true,
		validate: (values) => handleIsStepValid(activeStep, values),
		transformValues: (values) => {
			const parsedData = safeParse(CreateAuctionCycleDataSchemaTransformer, values);
			if (!parsedData.success)
				notifications.show({
					color: 'red',
					title: t('create.cycle.error.title'),
					message: parsedData.issues.map((issue) => issue.message).join(', '),
					position: 'bottom-center',
				});
			return parsedData.output as ICreateAuctionCycleOutput;
		},
	});

	const handleFormSubmit = useCallback(
		(formData: ICreateAuctionCycleOutput) => {
			setIsFormSubmitting(true);
			setFormError([]);
			createCycle.mutate(formData, {
				onSettled: () => setIsFormSubmitting(false),
				onSuccess: () => handleFinalStep(),
			});
		},
		[handleFinalStep, searchParams],
	);

	useLayoutEffect(() => {
		const cycleId = searchParams.get('cycleId');
		if (cycleId) document.title = document.title.replace(/^Create New/, 'Edit');
		setTitle(t('create.cycle.title'));
		setReturnHref(cycleId ? `/dashboard/a/cycles/${cycleId}` : '/dashboard/a/cycles');
		setReturnLabel(
			cycleId
				? t('constants.return.cycleDetails.label')
				: t('constants.return.cyclesList.label'),
		);
		setCompleteLabel(
			cycleId ? t('constants.actions.saveChanges.label') : t('create.cycle.complete.label'),
		);
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
	}, [t, searchParams]);

	//	Load initial values
	useEffect(() => {
		if (activeStep >= 5) return;
		if (!searchParams.get('cycleId')) return;

		setIsFormSubmitting(true);
		setDisabled(true);

		if (!singleCycle.isSuccess) return;

		setIsFormSubmitting(false);
		setDisabled(false);

		const transformedData = safeParse(
			ReadToCreateAuctionCycleDataTransformer,
			singleCycle.data,
		);
		if (!transformedData.success) return;

		form.setValues(transformedData.output);
		form.resetDirty(transformedData.output);
		form.validate();

		handleSearchParamStep();
	}, [searchParams, singleCycle.data, handleSearchParamStep]);

	useEffect(() => setHandleFormSubmit(() => form.onSubmit(handleFormSubmit)), [handleFormSubmit]);
	useEffect(
		() =>
			setIsStepValid(
				() => (step: number) =>
					Object.keys(handleIsStepValid(step, form.getValues())).length === 0,
			),
		[handleIsStepValid],
	);

	//	Pass form object to layout context
	useEffect(() => {
		formRef.current = form;
	}, [form]);

	//	Manually handle case where sector errors are present, as they dont use mantine inputs
	useEffect(() => {
		if (form.errors.sectors)
			setFormError([<List.Item key={0}>{form.errors.sectors.toString()}</List.Item>]);
	}, [form.errors.sectors]);

	return (
		<Switch value={activeStep}>
			<Switch.Case when={0}>
				<FirstStep form={form} disabled={disabled} />
			</Switch.Case>
			<Switch.Case when={1}>
				<SectorStep form={form} disabled={disabled} />
			</Switch.Case>
			<Switch.Case when={2}>
				<SecondStep form={form} disabled={disabled} />
			</Switch.Case>
			<Switch.Case when={3}>
				<ThirdStep form={form} disabled={disabled} />
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
	disabled: boolean;
}
