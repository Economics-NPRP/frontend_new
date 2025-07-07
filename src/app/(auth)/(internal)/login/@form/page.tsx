'use client';

import { valibotResolver } from 'mantine-form-valibot-resolver';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactElement, useCallback, useEffect, useState } from 'react';

import { login } from '@/lib/auth/login';
import classes from '@/pages/(auth)/(internal)/styles.module.css';
import { DefaultLoginData, ILoginData, LoginDataSchema } from '@/schema/models';
import {
	Alert,
	Anchor,
	Button,
	Checkbox,
	Group,
	List,
	PasswordInput,
	Stack,
	Text,
	TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconExclamationCircle, IconKey, IconMail } from '@tabler/icons-react';

export default function Form() {
	const t = useTranslations();
	const router = useRouter();
	const [formError, setFormError] = useState<Array<ReactElement>>([]);

	const form = useForm<ILoginData>({
		mode: 'uncontrolled',
		initialValues: DefaultLoginData,
		validate: valibotResolver(LoginDataSchema),
		onValuesChange: () => setFormError([]),
	});

	//	When the page loads, check if the remember me option is set in localStorage
	useEffect(() => {
		const rememberMe = localStorage.getItem('ets_remember_me');
		if (rememberMe) form.setFieldValue('remember', rememberMe === 'true');
	});

	const handleSubmit = useCallback(
		(values: ILoginData) => {
			form.setSubmitting(true);
			setFormError([]);

			//	Save the remember me option in localStorage
			localStorage.setItem('ets_remember_me', String(values.remember));

			//	Send login request
			login(values)
				.then((res) => {
					if (res.ok) {
						if (process.env.NODE_ENV === 'development') router.push('/marketplace');
						else router.push('/otp');
					} else {
						const errorMessage = (res.errors || ['Unknown error']).join(', ');
						console.error('Error logging in:', errorMessage);
						setFormError(
							(res.errors || []).map((error, index) => (
								<List.Item key={index}>{error}</List.Item>
							)),
						);
					}
					form.setSubmitting(false);
				})
				.catch((err) => {
					console.error('Error logging in:', err);
					setFormError([<List.Item key={0}>{t('auth.login.error.message')}</List.Item>]);
					form.setSubmitting(false);
				});
		},
		[form, router],
	);

	return (
		<form onSubmit={form.onSubmit(handleSubmit)}>
			<Stack className={`${classes.inputs} ${classes.section}`}>
				{formError.length > 0 && (
					<Alert
						variant="light"
						color="red"
						title={t('auth.login.error.title')}
						icon={<IconExclamationCircle />}
					>
						<List>{formError}</List>
					</Alert>
				)}
				<TextInput
					type="email"
					label={t('auth.login.form.email.label')}
					placeholder={t('auth.login.form.email.placeholder')}
					autoComplete="email"
					leftSection={<IconMail size={16} />}
					disabled={form.submitting}
					required
					key={form.key('email')}
					{...form.getInputProps('email')}
				/>
				<PasswordInput
					type="password"
					label={t('auth.login.form.password.label')}
					placeholder={t('auth.login.form.password.placeholder')}
					autoComplete="current-password"
					leftSection={<IconKey size={16} />}
					disabled={form.submitting}
					required
					key={form.key('password')}
					{...form.getInputProps('password')}
				/>
				<Group className={classes.row}>
					<Checkbox
						label={t('auth.login.form.checkbox.label')}
						key={form.key('remember')}
						{...form.getInputProps('remember', { type: 'checkbox' })}
					/>
					<Anchor component={Link} className={classes.link} href="/forgot">
						{t('auth.login.form.forgot.label')}
					</Anchor>
				</Group>
			</Stack>

			<Stack className={`${classes.action} ${classes.section}`}>
				<Button type="submit" loading={form.submitting}>
					{t('auth.login.actions.cta.label')}
				</Button>
				<Group className={classes.prompt}>
					{t.rich('auth.login.actions.prompt', {
						t: (chunks) => <Text className={classes.text}>{chunks}</Text>,
						a: (chunks) => (
							<Anchor component={Link} className={classes.link} href="/register">
								{chunks}
							</Anchor>
						),
					})}
				</Group>
			</Stack>
		</form>
	);
}
