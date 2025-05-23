'use client';

import { useLocale, useTranslations } from 'next-intl';

import { Button, Group, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconMail } from '@tabler/icons-react';

import classes from '../../styles.module.css';

export default function Form() {
	const t = useTranslations();
	const locale = useLocale();

	const form = useForm({
		mode: 'uncontrolled',
	});

	return (
		<form onSubmit={form.onSubmit((value) => console.log(value))}>
			<Stack className={`${classes.inputs} ${classes.section}`}>
				<TextInput
					type="email"
					label="Email Address"
					placeholder="Enter email address..."
					autoComplete="email"
					leftSection={<IconMail size={16} />}
					required
					key={form.key('email')}
					{...form.getInputProps('email')}
				/>
			</Stack>

			<Stack className={`${classes.action} ${classes.section}`}>
				<Button type="submit">Send Email</Button>
				<Group className={classes.prompt}>
					<Text className={classes.text}>
						Please note the email may take a few minutes to arrive.
					</Text>
				</Group>
			</Stack>
		</form>
	);
}
