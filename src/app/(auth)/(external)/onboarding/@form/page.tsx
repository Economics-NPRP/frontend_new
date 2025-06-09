'use client';

import { valibotResolver } from 'mantine-form-valibot-resolver';
// import { useLocale, useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReactElement, useCallback, useState } from 'react';

import { register } from '@/lib/auth/register';
import classes from '@/pages/(auth)/(external)/styles.module.css';
import {
	CreateUserPasswordSchema,
	DefaultCreateUserPassword,
	ICreateUserPassword,
} from '@/schema/models';
import { Alert, Button, Group, List, PasswordInput, Stack, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconExclamationCircle, IconKey } from '@tabler/icons-react';

export default function Form() {
	// const t = useTranslations();
	// const locale = useLocale();
	const router = useRouter();
	const searchParams = useSearchParams();
	const [formError, setFormError] = useState<Array<ReactElement>>([]);

	const form = useForm<ICreateUserPassword>({
		mode: 'uncontrolled',
		initialValues: DefaultCreateUserPassword,
		validate: valibotResolver(CreateUserPasswordSchema),
		onValuesChange: () => setFormError([]),
	});

	const handleSubmit = useCallback(
		({ password }: ICreateUserPassword) => {
			form.setSubmitting(true);
			setFormError([]);

			//	Send login request
			const registrationToken = searchParams.get('token');
			register({ registrationToken, password })
				.then((res) => {
					//	TODO: revert once backend returns cookies
					// if (res.ok) router.push('/marketplace');
					if (res.ok) router.push('/login');
					else {
						setFormError(
							(res.errors || []).map((error, index) => (
								<List.Item key={index}>{error}</List.Item>
							)),
						);
					}
					form.setSubmitting(false);
				})
				.catch((err) => {
					console.error('Error registering your account:', err);
					setFormError([
						<List.Item key={0}>
							There was an error during registration, please view the console for more
							details.
						</List.Item>,
					]);
					form.setSubmitting(false);
				});
		},
		[form, router, searchParams],
	);

	return (
		<form onSubmit={form.onSubmit(handleSubmit)}>
			<Stack className={`${classes.inputs} ${classes.section}`}>
				{formError.length > 0 && (
					<Alert
						variant="light"
						color="red"
						title="There was an error registering your account"
						icon={<IconExclamationCircle />}
					>
						<List>{formError}</List>
					</Alert>
				)}
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
				<PasswordInput
					type="password"
					label="Confirm Password"
					placeholder="Confirm password..."
					autoComplete="current-password"
					leftSection={<IconKey size={16} />}
					disabled={form.submitting}
					required
					key={form.key('confirmPassword')}
					{...form.getInputProps('confirmPassword')}
				/>
			</Stack>

			<Stack className={`${classes.action} ${classes.section}`}>
				<Button type="submit" loading={form.submitting}>
					Activate Account
				</Button>
				<Group className={classes.prompt}>
					<Text className={classes.text}>
						Activating your account will log you in and redirect you to the marketplace.
					</Text>
				</Group>
			</Stack>
		</form>
	);
}
