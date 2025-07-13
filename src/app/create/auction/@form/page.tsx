'use client';

import { valibotResolver } from 'mantine-form-valibot-resolver';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useCallback, useContext, useEffect, useLayoutEffect } from 'react';
import { useContextSelector } from 'use-context-selector';
import { safeParse } from 'valibot';

import { Switch } from '@/components/SwitchCase';
import { MyUserProfileContext } from '@/contexts';
import { createAuction } from '@/lib/auctions';
import { CreateLayoutContext } from '@/pages/create/_components/Providers';
import { DetailsStep } from '@/pages/create/auction/@form/Details';
import { FinalStep } from '@/pages/create/auction/@form/Final';
import { SectorStep } from '@/pages/create/auction/@form/Sector';
import { SubsectorStep } from '@/pages/create/auction/@form/Subsector';
import {
	CreateAuctionDataSchema,
	CreateAuctionDataSchemaTransformer,
	DetailsAuctionDataSchema,
	ICreateAuction,
	ICreateAuctionOutput,
	SectorAuctionDataSchema,
	SubsectorAuctionDataSchema,
} from '@/schema/models';
import { List } from '@mantine/core';
import { UseFormReturnType, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

export default function CreateAuctionLayout() {
	const t = useTranslations();
	const searchParams = useSearchParams();
	const currentUser = useContext(MyUserProfileContext);

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
	const activeStep = useContextSelector(CreateLayoutContext, (context) => context.activeStep);
	const setIsStepValid = useContextSelector(
		CreateLayoutContext,
		(context) => context.setIsStepValid,
	);

	const handleIsStepValid = useCallback((step: number, values: ICreateAuction) => {
		const step1 = valibotResolver(SectorAuctionDataSchema)(values);
		const step2 = valibotResolver(SubsectorAuctionDataSchema)(values);
		const step3 = valibotResolver(DetailsAuctionDataSchema)(values);
		const step4 = valibotResolver(CreateAuctionDataSchema)(values);

		if (step >= 0 && Object.keys(step1).length > 0) return step1;
		if (step >= 1 && Object.keys(step2).length > 0) return step2;
		if (step >= 2 && Object.keys(step3).length > 0) return step3;
		if (step >= 3 && Object.keys(step4).length > 0) return step4;
		return {};
	}, []);
	const form = useForm<ICreateAuction, (values: ICreateAuction) => ICreateAuctionOutput>({
		mode: 'uncontrolled',
		validateInputOnBlur: true,
		clearInputErrorOnChange: true,
		validate: (values) => handleIsStepValid(activeStep, values),
		transformValues: (values) => {
			const parsedData = safeParse(CreateAuctionDataSchemaTransformer, values);
			if (!parsedData.success)
				notifications.show({
					color: 'red',
					title: t('create.auction.error.title'),
					message: parsedData.issues.map((issue) => issue.message).join(', '),
					position: 'bottom-center',
				});
			return parsedData.output as ICreateAuctionOutput;
		},
	});

	const handleFormSubmit = useCallback(
		(formData: ICreateAuctionOutput) => {
			setIsFormSubmitting(true);
			setFormError([]);
			createAuction(formData)
				.then((res) => {
					if (res.ok) handleFinalStep();
					else {
						const errorMessage = (res.errors || ['Unknown error']).join(', ');
						console.error('Error creating a new auction:', errorMessage);
						setFormError(
							(res.errors || []).map((error, index) => (
								<List.Item key={index}>{error}</List.Item>
							)),
						);
						notifications.show({
							color: 'red',
							title: t('create.auction.error.title'),
							message: errorMessage,
							position: 'bottom-center',
						});
					}
					setIsFormSubmitting(false);
				})
				.catch((err) => {
					console.error('Error creating a new auction:', err);
					setFormError([
						<List.Item key={0}>{t('create.auction.error.message')}</List.Item>,
					]);
					setIsFormSubmitting(false);
				});
		},
		[handleFinalStep],
	);

	useLayoutEffect(() => {
		const cycleId = searchParams.get('cycleId');
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
			{
				label: t('create.auction.subsector.steps.label'),
				description: t('create.auction.subsector.steps.description'),
			},
			{
				label: t('create.auction.details.steps.label'),
				description: t('create.auction.details.steps.description'),
			},
			{
				label: t('create.auction.review.steps.label'),
				description: t('create.auction.review.steps.description'),
			},
		]);
	}, [t, searchParams]);

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

	//	Manually handle case where sector or subsector errors are present, as they dont use mantine inputs
	useEffect(() => {
		if (form.errors.sector)
			setFormError([<List.Item key={0}>{form.errors.sector.toString()}</List.Item>]);
		if (form.errors.subsector)
			setFormError([<List.Item key={1}>{form.errors.subsector.toString()}</List.Item>]);
	}, [form.errors.sector, form.errors.subsector]);

	//	Pass hidden data to form
	useEffect(
		() => form.setFieldValue('cycleId', searchParams.get('cycleId') as string),
		[searchParams],
	);
	useEffect(() => form.setFieldValue('ownerId', currentUser.data.id), [currentUser.data.id]);
	useEffect(
		() => form.setFieldValue('isPrimaryMarket', currentUser.data.type === 'admin'),
		[currentUser.data.type],
	);

	return (
		<>
			<input type="hidden" key={form.key('cycleId')} {...form.getInputProps('cycleId')} />
			<input type="hidden" key={form.key('ownerId')} {...form.getInputProps('ownerId')} />
			<input
				type="hidden"
				key={form.key('isPrimaryMarket')}
				{...form.getInputProps('isPrimaryMarket')}
			/>
			<Switch value={activeStep}>
				<Switch.Case when={0}>
					<SectorStep form={form} />
				</Switch.Case>
				<Switch.Case when={1}>
					<SubsectorStep form={form} />
				</Switch.Case>
				<Switch.Case when={2}>
					<DetailsStep form={form} />
				</Switch.Case>
				<Switch.Case when={4}>
					<FinalStep />
				</Switch.Case>
			</Switch>
		</>
	);
}

export interface ICreateAuctionStepProps {
	form: UseFormReturnType<ICreateAuction, (values: ICreateAuction) => ICreateAuctionOutput>;
}
