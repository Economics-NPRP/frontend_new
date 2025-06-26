'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { ReactElement, useCallback, useEffect, useState } from 'react';

import { resendOtp } from '@/lib/auth/resendOtp';
import { verifyOtp } from '@/lib/auth/verifyOtp';
import classes from '@/pages/(auth)/(internal)/styles.module.css';
import { Alert, Button, Group, List, PinInput, Stack, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useInterval } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconExclamationCircle } from '@tabler/icons-react';

interface IOTPData {
	otp: string;
}

export default function Form() {
	const t = useTranslations();
	const router = useRouter();
	const [resent, setResent] = useState(false);
	const [formError, setFormError] = useState<Array<ReactElement>>([]);

	const [seconds, setSeconds] = useState(60);
	const interval = useInterval(() => setSeconds((s) => s - 1), 1000, { autoInvoke: true });

	useEffect(() => {
		if (seconds <= 0) {
			interval.stop();
			setResent(false);
		}
	}, [seconds, interval]);

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

	const handleResend = useCallback(() => {
		//	Send resend request
		resendOtp()
			.then(() => {
				notifications.show({
					color: 'green',
					title: t('auth.otp.notifications.resend.success.title'),
					message: t('auth.otp.notifications.resend.success.message'),
					position: 'bottom-center',
				});
				setResent(true);
				setSeconds(60);
				interval.start();
			})
			.catch((err) => {
				console.error('Error resending OTP:', err);
				notifications.show({
					color: 'red',
					title: t('auth.otp.notifications.resend.error.title'),
					message: err.message,
					position: 'bottom-center',
				});
			});
	}, [form, router]);

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
							<Button
								onClick={handleResend}
								className={classes.link}
								disabled={resent}
							>
								{resent ? t('auth.otp.actions.resent', { value: seconds }) : chunks}
							</Button>
						),
					})}
				</Group>
			</Stack>
		</form>
	);
}
