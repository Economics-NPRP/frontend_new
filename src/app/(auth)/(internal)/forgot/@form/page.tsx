'use client';

import { useTranslations } from 'next-intl';

import classes from '@/pages/(auth)/(internal)/styles.module.css';
import { Button, Group, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconMail } from '@tabler/icons-react';

export default function Form() {
	const t = useTranslations();

	const form = useForm({
		mode: 'uncontrolled',
	});

	return (
		<form onSubmit={form.onSubmit((value) => console.log(value))}>
			<Stack className={`${classes.inputs} ${classes.section}`}>
				<TextInput
					type="email"
					label={t('auth.forgot.form.email.label')}
					placeholder={t('auth.forgot.form.email.placeholder')}
					autoComplete="email"
					leftSection={<IconMail size={16} />}
					required
					key={form.key('email')}
					{...form.getInputProps('email')}
				/>
			</Stack>

			<Stack className={`${classes.action} ${classes.section}`}>
				<Button type="submit">{t('auth.forgot.actions.cta.label')}</Button>
				<Group className={classes.prompt}>
					<Text className={classes.text}>{t('auth.forgot.actions.prompt')}</Text>
				</Group>
			</Stack>
		</form>
	);
}
