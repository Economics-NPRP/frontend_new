'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import classes from '@/pages/(auth)/(internal)/styles.module.css';
import { Button, Group, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

export default function Contact() {
	const t = useTranslations();
	const locale = useLocale();
	const router = useRouter();

	const form = useForm<{ code: string }>({
		mode: 'uncontrolled',
	});

	const handleSubmit = useCallback(
		({ code }: { code: string }) => {
			form.setSubmitting(true);

			//	Go to onboarding page with the registration code
			router.push(`/onboarding?token=${code}`);
			form.setSubmitting(false);
		},
		[form, router],
	);

	return (
		<form onSubmit={form.onSubmit(handleSubmit)}>
			<Stack className={`${classes.inputs} ${classes.section}`}>
				<TextInput
					label="Registration Code"
					placeholder="Enter registration code..."
					required
					key={form.key('code')}
					{...form.getInputProps('code')}
				/>
				<Button type="submit" className="mt-2" loading={form.submitting}>
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
