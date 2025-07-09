'use client';

import { useTranslations } from 'next-intl';
import { useContextSelector } from 'use-context-selector';

import { CreateLayoutContext } from '@/pages/create/_components/Providers';
import { ICreateAuctionStepProps } from '@/pages/create/auction/@form/page';
import { Alert, List, NumberInput, Select, Stack, Text, Title } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { IconExclamationCircle } from '@tabler/icons-react';

import classes from './styles.module.css';

export const DetailsStep = ({ form }: ICreateAuctionStepProps) => {
	const t = useTranslations();
	const formError = useContextSelector(CreateLayoutContext, (context) => context.formError);
	const setFormError = useContextSelector(CreateLayoutContext, (context) => context.setFormError);

	return (
		<Stack className={`${classes.details} ${classes.root}`}>
			<Stack className={classes.header}>
				<Title order={2} className={classes.heading}>
					{t('create.auction.details.header.heading')}
				</Title>
				<Text className={classes.subheading}>
					{t('create.auction.details.header.subheading')}
				</Text>
			</Stack>
			{formError.length > 0 && (
				<Alert
					variant="light"
					color="red"
					title={t('create.auction.error.title')}
					icon={<IconExclamationCircle />}
					className={classes.alert}
					withCloseButton
					onClose={() => setFormError([])}
				>
					<List>{formError}</List>
				</Alert>
			)}
			<Stack className={classes.inputs}>
				<Select
					label={t('create.auction.details.type.label')}
					description={t('create.auction.details.type.description')}
					data={[
						{ label: t('constants.auctionType.open'), value: 'open' },
						{ label: t('constants.auctionType.sealed'), value: 'sealed' },
					]}
					key={form.key('type')}
					{...form.getInputProps('type')}
				/>
				<NumberInput
					label={t('create.auction.details.permits.label')}
					description={t('create.auction.details.permits.description')}
					placeholder="0"
					suffix={` ${t('constants.permits.unit')}`}
					thousandSeparator=" "
					thousandsGroupStyle="thousand"
					stepHoldDelay={500}
					stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
					key={form.key('permits')}
					{...form.getInputProps('permits')}
				/>
				<NumberInput
					label={t('create.auction.details.emissions.label')}
					description={t('create.auction.details.emissions.description')}
					placeholder="0"
					suffix={` ${t('constants.emissions.unit')}`}
					thousandSeparator=" "
					thousandsGroupStyle="thousand"
					stepHoldDelay={500}
					stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
					//	TODO: uncomment when backend has emissions
					// key={form.key('emissions')}
					// {...form.getInputProps('emissions')}
				/>
				<NumberInput
					label={t('create.auction.details.minBid.label')}
					description={t('create.auction.details.minBid.description')}
					placeholder="0"
					prefix={`${t('constants.currency.QAR.symbol')} `}
					thousandSeparator=" "
					thousandsGroupStyle="thousand"
					decimalScale={2}
					stepHoldDelay={500}
					stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
					key={form.key('minBid')}
					{...form.getInputProps('minBid')}
				/>
				<NumberInput
					label={t('create.auction.details.minIncrement.label')}
					description={t('create.auction.details.minIncrement.description')}
					placeholder="0"
					prefix={`${t('constants.currency.QAR.symbol')} `}
					thousandSeparator=" "
					thousandsGroupStyle="thousand"
					decimalScale={2}
					stepHoldDelay={500}
					stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
					//	TODO: uncomment when backend has min increment
					// key={form.key('minIncrement')}
					// {...form.getInputProps('minIncrement')}
				/>
				<DateTimePicker
					label={t('create.auction.details.startDatetime.label')}
					description={t('create.auction.details.startDatetime.description')}
					valueFormat="DD MMM YYYY hh:mm A"
					//	TODO: uncomment after migrating to mantine v8
					// timePickerProps={{
					// 	withDropdown: true,
					// 	popoverProps: { withinPortal: false },
					// 	format: '12h',
					// }}
					required
					clearable
					key={form.key('startDatetime')}
					{...form.getInputProps('startDatetime')}
				/>
				<DateTimePicker
					label={t('create.auction.details.endDatetime.label')}
					description={t('create.auction.details.endDatetime.description')}
					valueFormat="DD MMM YYYY hh:mm A"
					//	TODO: uncomment after migrating to mantine v8
					// timePickerProps={{
					// 	withDropdown: true,
					// 	popoverProps: { withinPortal: false },
					// 	format: '12h',
					// }}
					required
					clearable
					key={form.key('endDatetime')}
					{...form.getInputProps('endDatetime')}
				/>
			</Stack>
		</Stack>
	);
};
