'use client';

import { useLocale, useTranslations } from 'next-intl';

import classes from '@/pages/(auth)/(external)/styles.module.css';
import { Button, Group, PasswordInput, Stack, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconKey } from '@tabler/icons-react';

export default function Form() {
	const t = useTranslations();
	const locale = useLocale();

	const form = useForm({
		mode: 'uncontrolled',
	});

	return (
		<form onSubmit={form.onSubmit((value) => console.log(value))}>
			<Stack className={`${classes.inputs} ${classes.section}`}>
				<PasswordInput
					type="password"
					label="Password"
					placeholder="Enter password..."
					autoComplete="current-password"
					leftSection={<IconKey size={16} />}
					disabled={form.submitting}
					required
					key={form.key('password')}
					{...form.getInputProps('password')}
				/>
			</Stack>

			<Stack className={`${classes.action} ${classes.section}`}>
				<Button type="submit">Activate Account</Button>
				<Group className={classes.prompt}>
					<Text className={classes.text}>
						Activating your account will log you in and redirect you to the marketplace.
					</Text>
				</Group>
			</Stack>
		</form>
	);
}
