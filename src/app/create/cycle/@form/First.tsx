import { useTranslations } from 'next-intl';

import { Input, Stack, Text, TextInput, Title } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { IconLabel } from '@tabler/icons-react';

import classes from './styles.module.css';

export const FirstStep = () => {
	const t = useTranslations();

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
			<Stack className={classes.inputs}>
				<TextInput
					label={t('create.cycle.first.name.label')}
					placeholder={t('create.cycle.first.name.placeholder')}
					autoComplete="company"
					leftSection={<IconLabel size={16} />}
					required
				/>
				<Input.Wrapper
					label={t('create.cycle.first.date.label')}
					description={t('create.cycle.first.date.placeholder')}
					required
				>
					<DatePicker className={classes.calendar} type="range" numberOfColumns={2} />
				</Input.Wrapper>
			</Stack>
		</Stack>
	);
};
