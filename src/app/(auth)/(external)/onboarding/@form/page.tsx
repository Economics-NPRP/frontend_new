'use client';

import { valibotResolver } from 'mantine-form-valibot-resolver';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { ReactElement, useCallback, useState } from 'react';

import { PasswordInput } from '@/components/PasswordInput';
import { useAuth } from '@/hooks';
import classes from '@/pages/(auth)/(external)/styles.module.css';
import {
	CreateUserPasswordSchema,
	DefaultCreateUserPassword,
	ICreateUserPassword,
} from '@/schema/models';
import {
	Alert,
	Button,
	Group,
	List,
	PasswordInput as MantinePasswordInput,
	Stack,
	Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconExclamationCircle, IconKey } from '@tabler/icons-react';

export default function Form() {
	const t = useTranslations();
	const router = useRouter();
	const [formError, setFormError] = useState<Array<ReactElement>>([]);

	const { register } = useAuth({
		onRegisterSettled: () => form.setSubmitting(false),
		onRegisterSuccess: () => router.push('/marketplace'),
		onRegisterError: () =>
			setFormError([<List.Item key={0}>{t('auth.register.error.message')}</List.Item>]),
	});

	const form = useForm<ICreateUserPassword>({
		mode: 'uncontrolled',
		initialValues: DefaultCreateUserPassword,
		validate: valibotResolver(CreateUserPasswordSchema),
		onValuesChange: () => setFormError([]),
	});

	const handleSubmit = useCallback(
		(values: ICreateUserPassword) => {
			form.setSubmitting(true);
			setFormError([]);
			register.mutate(values);
		},
		[form, router, register],
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
						withCloseButton
						onClose={() => setFormError([])}
					>
						<List>{formError}</List>
					</Alert>
				)}
				<PasswordInput
					label={t('auth.onboarding.form.password.label')}
					placeholder={t('auth.onboarding.form.password.placeholder')}
					disabled={form.submitting}
					required
					key={form.key('password')}
					{...form.getInputProps('password')}
				/>
				<MantinePasswordInput
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
