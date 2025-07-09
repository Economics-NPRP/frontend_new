'use client';

import { valibotResolver } from 'mantine-form-valibot-resolver';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useCallback, useContext, useEffect } from 'react';
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

	const form = useForm<ICreateAuction, (values: ICreateAuction) => ICreateAuctionOutput>({
		mode: 'uncontrolled',
		validate: (values) => {
			if (activeStep === 2) return valibotResolver(DetailsAuctionDataSchema)(values);
			if (activeStep === 3) return valibotResolver(CreateAuctionDataSchema)(values);
			return {};
		},
		onValuesChange: () => setFormError([]),
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
			console.log(formData);
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

	useEffect(() => {
		setTitle(t('create.auction.title'));
		setReturnHref(
			searchParams.get('cycleId')
				? `/dashboard/a/cycles/${searchParams.get('cycleId')}`
				: '/marketplace',
		);
		setReturnLabel(
			searchParams.get('cycleId')
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

	useEffect(() => {
		if (form.errors.sectors)
			setFormError([<List.Item key={0}>{form.errors.sectors.toString()}</List.Item>]);
	}, [form.errors.sectors]);

	useEffect(() => {
		setShouldAllowStepSelect(() => (step: number, isStepper?: boolean) => {
			if (step > 4) return false;
			if (isStepper && highestStepVisited < step) return false;
			if (activeStep === 4) return false;
			//	Cant go to next step if current step has errors
			if (!isStepper && step > activeStep && form.validate().hasErrors) return false;
			return true;
		});
	}, [activeStep, highestStepVisited]);

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
