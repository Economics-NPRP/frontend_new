import { useTranslations } from 'next-intl';

import { Stack, Text, TextInput, Title } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconCalendar, IconLabel } from '@tabler/icons-react';

import classes from './styles.module.css';

export const SecondStep = () => {
	const t = useTranslations();

	return (
		<Stack className={`${classes.second} ${classes.root}`}>
			<Stack className={classes.header}>
				<Title order={2} className={classes.heading}>
					{t('create.cycle.second.header.heading')}
				</Title>
				<Text className={classes.subheading}>
					{t('create.cycle.second.header.subheading')}
				</Text>
			</Stack>
			<Stack className={classes.inputs}>
				<TextInput
					label={t('create.cycle.second.name.label')}
					placeholder={t('create.cycle.second.name.placeholder')}
					autoComplete="company"
					leftSection={<IconLabel size={16} />}
					required
				/>
				<DatePickerInput
					label={t('create.cycle.second.date.label')}
					placeholder={t('create.cycle.second.date.placeholder')}
					leftSection={<IconCalendar size={16} />}
					type="range"
					numberOfColumns={2}
					clearable
					required
				/>
			</Stack>
		</Stack>
	);
};
