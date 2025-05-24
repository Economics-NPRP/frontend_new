'use client';

import { valibotResolver } from 'mantine-form-valibot-resolver';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import { login } from '@/lib/auth/login';
import classes from '@/pages/(auth)/styles.module.css';
import { DefaultLoginData, ILoginData, LoginDataSchema } from '@/schema/models';
import {
	Alert,
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
import { IconExclamationCircle, IconKey, IconMail } from '@tabler/icons-react';

export default function Form() {
	const t = useTranslations();
	const locale = useLocale();
	const router = useRouter();
	const [formError, setFormError] = useState<string | null>(null);

	const form = useForm<ILoginData>({
		mode: 'uncontrolled',
		initialValues: {
			...DefaultLoginData,
			remember: Boolean(localStorage.getItem('ets_remember_me') === 'true'),
		},
		validate: valibotResolver(LoginDataSchema),
		onValuesChange: () => setFormError(null),
	});

	const handleSubmit = useCallback(
		async (values: ILoginData) => {
			setFormError(null);

			//	Save the remember me option in localStorage
			localStorage.setItem('ets_remember_me', String(values.remember));

			//	Send login request
			login(values)
				.then((res) => {
					if (res.ok) router.push('/otp');
					else {
						setFormError('Invalid email or password');
					}
				})
				.catch((err) => {
					console.error(err);
					setFormError(err);
				});
		},
		[form, router],
	);

	return (
		<form onSubmit={form.onSubmit(handleSubmit)}>
			<Stack className={`${classes.inputs} ${classes.section}`}>
				{formError && (
					<Alert
						variant="light"
						color="red"
						title="There was an error logging in"
						icon={<IconExclamationCircle />}
					>
						{formError}
					</Alert>
				)}
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
					<Anchor className={classes.link} href="/register">
						{/* TODO: another page (/onboarding) after being invited to create password */}
						Click here
					</Anchor>
				</Group>
			</Stack>
		</form>
	);
}
