'use client';

import { useLocale, useTranslations } from 'next-intl';

import {
	Anchor,
	Button,
	Checkbox,
	Group,
	PasswordInput,
	Stack,
	Text,
	TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconKey, IconMail } from '@tabler/icons-react';

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
				<PasswordInput
					type="password"
					label="Password"
					placeholder="Enter password..."
					autoComplete="current-password"
					leftSection={<IconKey size={16} />}
					required
					key={form.key('password')}
					{...form.getInputProps('password')}
				/>
				<Group className={classes.row}>
					<Checkbox
						label="Remember me"
						key={form.key('remember')}
						{...form.getInputProps('remember', { type: 'checkbox' })}
					/>
					<Anchor className={classes.link} href="/forgot">
						Forgot password?
					</Anchor>
				</Group>
			</Stack>

			<Stack className={`${classes.action} ${classes.section}`}>
				<Button type="submit">Login</Button>
				<Group className={classes.prompt}>
					<Text className={classes.text}>Don't have an account? </Text>
					<Anchor className={classes.link} href="/contact">
						Contact us
					</Anchor>
				</Group>
			</Stack>
		</form>
	);
}
