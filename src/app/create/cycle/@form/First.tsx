import { useTranslations } from 'next-intl';

import { Input, Stack, Text, TextInput, Textarea, Title, useMatches } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { IconLabel } from '@tabler/icons-react';

import classes from './styles.module.css';

export const FirstStep = () => {
	const t = useTranslations();
	const numCalendarColumns = useMatches({ base: 1, md: 2, lg: 3 });

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
				<Textarea
					resize="vertical"
					label={t('create.cycle.first.description.label')}
					description={t('create.cycle.first.description.description')}
					placeholder={t('create.cycle.first.description.placeholder')}
					minRows={4}
					autosize
				/>
				<Input.Wrapper
					label={t('create.cycle.first.date.label')}
					description={t('create.cycle.first.date.placeholder')}
					required
				>
					<DatePicker
						className={classes.calendar}
						type="range"
						numberOfColumns={numCalendarColumns}
					/>
				</Input.Wrapper>
			</Stack>
		</Stack>
	);
};
