'use client';

import { valibotResolver } from 'mantine-form-valibot-resolver';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { useContextSelector } from 'use-context-selector';
import { safeParse } from 'valibot';

import { Switch } from '@/components/SwitchCase';
import { useCreateSubsector } from '@/hooks';
import { CreateLayoutContext } from '@/pages/create/_components/Providers';
import { DetailsStep } from '@/pages/create/subsector/@form/Details';
import { FinalStep } from '@/pages/create/subsector/@form/Final';
import {
	CreateSubsectorDataSchema,
	CreateSubsectorDataSchemaTransformer,
	DefaultCreateSubsector,
	ICreateSubsector,
	ICreateSubsectorOutput,
	SectorType,
} from '@/schema/models';
import { List } from '@mantine/core';
import { UseFormReturnType, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

export default function CreateSubsectorLayout() {
	const t = useTranslations();
	const searchParams = useSearchParams();
	// const singleSubsector = useContext(SingleSubsectorContext);

	const [disabled, setDisabled] = useState(false);
	const createSubsector = useCreateSubsector();

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

	const handleIsStepValid = useCallback((step: number, values: ICreateSubsector) => {
		const step1 = valibotResolver(CreateSubsectorDataSchema)(values);
		const step3 = valibotResolver(CreateSubsectorDataSchema)(values);

		if (step >= 0 && Object.keys(step1).length > 0) return step1;
		if (step >= 2 && Object.keys(step3).length > 0) return step3;
		return {};
	}, []);

	const form = useForm<ICreateSubsector, (values: ICreateSubsector) => ICreateSubsectorOutput>({
		mode: 'uncontrolled',
		validateInputOnBlur: true,
		clearInputErrorOnChange: true,
		initialValues: {
			...DefaultCreateSubsector,
			sector: searchParams.get('sector') as SectorType,
		},
		validate: (values) => handleIsStepValid(activeStep, values),
		transformValues: (values) => {
			const parsedData = safeParse(CreateSubsectorDataSchemaTransformer, values);
			if (!parsedData.success)
				notifications.show({
					color: 'red',
					title: t('create.subsector.error.title'),
					message: parsedData.issues.map((issue) => issue.message).join(', '),
					position: 'bottom-center',
				});
			return parsedData.output as ICreateSubsectorOutput;
		},
	});

	const handleFormSubmit = useCallback(
		(formData: ICreateSubsectorOutput) => {
			setIsFormSubmitting(true);
			setFormError([]);
			createSubsector.mutate(formData, {
				onSettled: () => setIsFormSubmitting(false),
				onSuccess: () => handleFinalStep(),
			});
		},
		[handleFinalStep, searchParams],
	);

	useLayoutEffect(() => {
		const sector = searchParams.get('sector');
		const subsectorId = searchParams.get('subsectorId');
		if (subsectorId) document.title = document.title.replace(/^Create New/, 'Edit');
		setTitle(t('create.subsector.title'));
		setReturnHref(
			subsectorId
				? `/dashboard/a/cycles/sectors/${sector}/${subsectorId}`
				: `/dashboard/a/cycles/sectors/${sector}`,
		);
		setReturnLabel(
			subsectorId
				? t('constants.return.subsectorDetails.label')
				: t('constants.return.sectorDetails.label'),
		);
		setCompleteLabel(
			subsectorId
				? t('constants.actions.saveChanges.label')
				: t('create.subsector.complete.label'),
		);
		setSteps([
			{
				label: t('create.subsector.details.steps.label'),
				description: t('create.subsector.details.steps.description'),
			},
			{
				label: t('create.subsector.review.steps.label'),
				description: t('create.subsector.review.steps.description'),
			},
		]);
	}, [t, searchParams]);

	//	Load initial values
	useEffect(() => {
		if (activeStep >= 2) return;
		if (!searchParams.get('subsectorId')) return;

		setIsFormSubmitting(true);
		setDisabled(true);

		// if (!singleSubsector.isSuccess) return;

		setIsFormSubmitting(false);
		setDisabled(false);

		// const transformedData = safeParse(
		// 	CreateSubsectorDataSchema,
		// 	singleSubsector.data,
		// );
		// if (!transformedData.success) return;

		// form.setValues(transformedData.output);
		// form.resetDirty(transformedData.output);
		// form.validate();

		handleSearchParamStep();
	}, [
		searchParams,
		// singleSubsector.data,
		handleSearchParamStep,
	]);

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
				<DetailsStep form={form} disabled={disabled} />
			</Switch.Case>
			<Switch.Case when={2}>
				<FinalStep />
			</Switch.Case>
		</Switch>
	);
}

export interface ICreateSubsectorStepProps {
	form: UseFormReturnType<ICreateSubsector, (values: ICreateSubsector) => ICreateSubsector>;
	disabled: boolean;
}
