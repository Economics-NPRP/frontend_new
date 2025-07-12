'use client';

import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';
import { useContextSelector } from 'use-context-selector';

import { CreateLayoutContext } from '@/pages/create/_components/Providers';
import { ICreateCycleStepProps } from '@/pages/create/cycle/@form/page';
import {
	Alert,
	Input,
	List,
	Stack,
	Text,
	TextInput,
	Textarea,
	Title,
	useMatches,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { IconExclamationCircle, IconLabel } from '@tabler/icons-react';

import classes from './styles.module.css';

export const FirstStep = ({ form, disabled }: ICreateCycleStepProps) => {
	const t = useTranslations();
	const numCalendarColumns = useMatches({ base: 1, md: 2, lg: 3 });
	const formError = useContextSelector(CreateLayoutContext, (context) => context.formError);
	const setFormError = useContextSelector(CreateLayoutContext, (context) => context.setFormError);

	return (
		<Stack className={`${classes.first} ${classes.root}`}>
			<Stack className={classes.header}>
				<Title order={2} className={classes.heading}>
					{t('create.cycle.first.header.heading')}
				</Title>
				<Text className={classes.subheading}>
					{t('create.cycle.first.header.subheading')}
				</Text>
			</Stack>
			{formError.length > 0 && (
				<Alert
					variant="light"
					color="red"
					title={t('create.cycle.error.title')}
					icon={<IconExclamationCircle />}
					className={classes.alert}
					onClose={() => setFormError([])}
					withCloseButton
				>
					<List>{formError}</List>
				</Alert>
			)}
			<Stack className={classes.inputs}>
				<TextInput
					label={t('create.cycle.first.name.label')}
					placeholder={t('create.cycle.first.name.placeholder')}
					autoComplete="company"
					leftSection={<IconLabel size={16} />}
					required
					disabled={disabled}
					key={form.key('title')}
					{...form.getInputProps('title')}
				/>
				<Textarea
					resize="vertical"
					label={t('create.cycle.first.description.label')}
					description={t('create.cycle.first.description.description')}
					placeholder={t('create.cycle.first.description.placeholder')}
					minRows={4}
					autosize
					required
					disabled={disabled}
					key={form.key('description')}
					{...form.getInputProps('description')}
				/>
				<Input.Wrapper
					label={t('create.cycle.first.date.label')}
					description={t('create.cycle.first.date.placeholder')}
					error={
						form.getInputProps('dates').error ||
						form.getInputProps('dates.0').error ||
						form.getInputProps('dates.1').error
					}
					required
				>
					<DatePicker
						className={`${classes.calendar} ${disabled ? 'pointer-events-none' : ''}`}
						classNames={{ day: classes.day }}
						type="range"
						numberOfColumns={numCalendarColumns}
						minDate={DateTime.now().plus({ days: 1 }).toJSDate()}
						key={form.key('dates')}
						{...form.getInputProps('dates')}
					/>
				</Input.Wrapper>
			</Stack>
		</Stack>
	);
};
