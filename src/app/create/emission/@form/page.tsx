'use client';

import { valibotResolver } from 'mantine-form-valibot-resolver';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useLayoutEffect } from 'react';
import { useContextSelector } from 'use-context-selector';
import { safeParse } from 'valibot';

import { Switch } from '@/components/SwitchCase';
// import { useCreateEmission } from '@/hooks';
import { CreateLayoutContext } from '@/pages/create/_components/Providers';
import { FinalStep } from '@/pages/create/emission/@form/Final';
import {
	CreateEmissionDataSchema,
	CreateEmissionDataSchemaTransformer,
	DefaultCreateEmission,
	ICreateEmission,
	ICreateEmissionOutput,
} from '@/schema/models';
import { List } from '@mantine/core';
import { UseFormReturnType, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

export default function CreateEmissionLayout() {
	const t = useTranslations();
	const searchParams = useSearchParams();

	// const [disabled, setDisabled] = useState(false);
	// const createEmission = useCreateEmission();

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

	const handleIsStepValid = useCallback((step: number, values: ICreateEmission) => {
		const step1 = valibotResolver(CreateEmissionDataSchema)(values);
		const step3 = valibotResolver(CreateEmissionDataSchema)(values);

		if (step >= 0 && Object.keys(step1).length > 0) return step1;
		if (step >= 2 && Object.keys(step3).length > 0) return step3;
		return {};
	}, []);

	const form = useForm<ICreateEmission, (values: ICreateEmission) => ICreateEmissionOutput>({
		mode: 'uncontrolled',
		validateInputOnBlur: true,
		clearInputErrorOnChange: true,
		initialValues: DefaultCreateEmission,
		validate: (values) => handleIsStepValid(activeStep, values),
		transformValues: (values) => {
			const parsedData = safeParse(CreateEmissionDataSchemaTransformer, values);
			if (!parsedData.success)
				notifications.show({
					color: 'red',
					title: t('create.emission.error.title'),
					message: parsedData.issues.map((issue) => issue.message).join(', '),
					position: 'bottom-center',
				});
			return parsedData.output as ICreateEmissionOutput;
		},
	});

	const handleFormSubmit = useCallback(
		// (formData: ICreateEmissionOutput) => {
		() => {
			setIsFormSubmitting(true);
			setFormError([]);
			// createEmission.mutate(formData, {
			// 	onSettled: () => setIsFormSubmitting(false),
			// 	onSuccess: () => handleFinalStep(),
			// });
		},
		[handleFinalStep, searchParams],
	);

	useLayoutEffect(() => {
		const emission = searchParams.get('emission');
		if (emission) document.title = document.title.replace(/^Create New/, 'Edit');
		setTitle(t('create.emission.title'));
		setReturnHref('/dashboard/f/carbon/pe');
		setReturnLabel(t('constants.return.permitsEmissions.label'));
		setCompleteLabel(
			emission
				? t('constants.actions.saveChanges.label')
				: t('create.emission.complete.label'),
		);
		setSteps([
			{
				label: t('create.emission.numbers.steps.label'),
				description: t('create.emission.numbers.steps.description'),
			},
			{
				label: t('create.emission.report.steps.label'),
				description: t('create.emission.report.steps.description'),
			},
			{
				label: t('create.emission.review.steps.label'),
				description: t('create.emission.review.steps.description'),
			},
		]);
	}, [t, searchParams]);

	//	Load initial values
	useEffect(() => {
		if (activeStep >= 2) return;
		if (!searchParams.get('emission')) return;

		// setIsFormSubmitting(true);
		// setDisabled(true);

		// if (!singleEmission.isSuccess) {
		// 	if (singleEmission.isError) {
		// 		console.error(
		// 			'There was an error loading the existing emission data for editing:',
		// 			singleEmission,
		// 		);
		// 		notifications.show({
		// 			color: 'red',
		// 			title: t('create.emission.error.title'),
		// 			message: t('create.emission.error.message'),
		// 			position: 'bottom-center',
		// 		});
		// 	}
		// 	return;
		// }

		// const transformedData = safeParse(ReadToCreateEmissionDataTransformer, singleEmission.data);
		// if (!transformedData.success) {
		// 	console.error(
		// 		'There was an error loading the existing emission data for editing:',
		// 		transformedData.issues,
		// 	);
		// 	notifications.show({
		// 		color: 'red',
		// 		title: t('create.emission.error.title'),
		// 		message: t('create.emission.error.message'),
		// 		position: 'bottom-center',
		// 	});
		// 	return;
		// }

		// setIsFormSubmitting(false);
		// setDisabled(false);

		// form.setValues(transformedData.output);
		// form.resetDirty(transformedData.output);
		// form.validate();

		// handleSearchParamStep();
	}, [
		searchParams,
		// singleEmission.data,
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
			<Switch.Case when={2}>
				<FinalStep />
			</Switch.Case>
		</Switch>
	);
}

export interface ICreateEmissionStepProps {
	form: UseFormReturnType<ICreateEmission, (values: ICreateEmission) => ICreateEmission>;
	disabled: boolean;
}
