'use client';

import { valibotResolver } from 'mantine-form-valibot-resolver';
import { useTranslations } from 'next-intl';
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
	const t = useTranslations();
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
						<List.Item key={0}>{t('auth.onboarding.error.message')}</List.Item>,
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
						title={t('auth.onboarding.error.title')}
						icon={<IconExclamationCircle />}
					>
						<List>{formError}</List>
					</Alert>
				)}
				<PasswordInput
					type="password"
					label={t('auth.onboarding.form.password.label')}
					placeholder={t('auth.onboarding.form.password.placeholder')}
					autoComplete="current-password"
					leftSection={<IconKey size={16} />}
					disabled={form.submitting}
					required
					key={form.key('password')}
					{...form.getInputProps('password')}
				/>
				<PasswordInput
					type="password"
					label={t('auth.onboarding.form.confirm.label')}
					placeholder={t('auth.onboarding.form.confirm.placeholder')}
					autoComplete="current-password"
					leftSection={<IconKey size={16} />}
					disabled={form.submitting}
					required
					key={form.key('confirmPassword')}
					{...form.getInputProps('confirmPassword')}
				/>
			</Stack>

			<Stack className={`${classes.action} ${classes.section}`}>
				<Button
					type="submit"
					className={`${classes.primary} ${classes.button}`}
					loading={form.submitting}
				>
					{t('auth.onboarding.actions.cta.label')}
				</Button>
				<Group className={classes.prompt}>
					<Text className={classes.text}>{t('auth.onboarding.actions.prompt')}</Text>
				</Group>
			</Stack>
		</form>
	);
}
