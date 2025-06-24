'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { ReactElement, useCallback, useState } from 'react';

import { verifyOtp } from '@/lib/auth/verifyOtp';
import classes from '@/pages/(auth)/(internal)/styles.module.css';
import { Alert, Anchor, Button, Group, List, PinInput, Stack, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconExclamationCircle } from '@tabler/icons-react';

interface IOTPData {
	otp: string;
}

export default function Form() {
	const t = useTranslations();
	const router = useRouter();
	const [formError, setFormError] = useState<Array<ReactElement>>([]);

	const form = useForm<IOTPData>({
		mode: 'uncontrolled',
	});

	const handleSubmit = useCallback(
		(values: IOTPData) => {
			form.setSubmitting(true);
			setFormError([]);

			//	Send login request
			verifyOtp(values.otp)
				.then((res) => {
					//	TODO: change url to dashboard or marketplace depending on the user type
					if (res.ok) router.push('/marketplace');
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
					console.error('Error verifying OTP:', err);
					setFormError([<List.Item key={0}>{t('auth.otp.error.message')}</List.Item>]);
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
						title={t('auth.otp.error.title')}
						icon={<IconExclamationCircle />}
					>
						<List>{formError}</List>
					</Alert>
				)}
				<PinInput
					type="number"
					length={6}
					placeholder="0"
					disabled={form.submitting}
					oneTimeCode
					classNames={{
						root: classes.otp,
						pinInput: classes.input,
					}}
					key={form.key('otp')}
					{...form.getInputProps('otp')}
				/>
			</Stack>

			<Stack className={`${classes.action} ${classes.section}`}>
				<Button type="submit" loading={form.submitting}>
					{t('constants.actions.verify.label')}
				</Button>
				<Group className={classes.prompt}>
					{t.rich('auth.otp.actions.prompt', {
						t: (chunks) => <Text className={classes.text}>{chunks}</Text>,
						a: (chunks) => (
							//	TODO: add handler to resend OTP
							<Anchor className={classes.link}>{chunks}</Anchor>
						),
					})}
				</Group>
			</Stack>
		</form>
	);
}
