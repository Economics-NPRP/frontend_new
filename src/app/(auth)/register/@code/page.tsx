'use client';

import { useLocale, useTranslations } from 'next-intl';

import classes from '@/pages/(auth)/styles.module.css';
import { Button, Group, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

export default function Contact() {
	const t = useTranslations();
	const locale = useLocale();

	const form = useForm({
		mode: 'uncontrolled',
	});

	return (
		<form onSubmit={form.onSubmit((value) => console.log(value))}>
			<Stack className={`${classes.inputs} ${classes.section}`}>
				<TextInput
					label="Registration Code"
					placeholder="Enter registration code..."
					required
					key={form.key('code')}
					{...form.getInputProps('code')}
				/>
				<Button type="submit" className="mt-2">
					Submit Code
				</Button>
				<Group className={classes.prompt}>
					<Text className={classes.text}>
						Continuing will create an account using the code provided. If you do not
						have a code, please contact us.
					</Text>
				</Group>
			</Stack>
		</form>
	);
}
