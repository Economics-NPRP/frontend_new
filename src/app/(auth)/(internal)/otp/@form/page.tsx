'use client';

import { valibotResolver } from 'mantine-form-valibot-resolver';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { ReactElement, useCallback, useEffect, useState } from 'react';

import { useAuth } from '@/hooks';
import classes from '@/pages/(auth)/(internal)/styles.module.css';
import { DefaultOTPData, IOTPData, OTPDataSchema } from '@/schema/models';
import { Alert, Button, Group, List, PinInput, Stack, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useInterval } from '@mantine/hooks';
import { IconExclamationCircle } from '@tabler/icons-react';

export default function Form() {
	const t = useTranslations();
	const router = useRouter();
	const [resent, setResent] = useState(false);
	const [formError, setFormError] = useState<Array<ReactElement>>([]);

	const { verifyOtp, resendOtp } = useAuth({
		onVerifyOtpSettled: () => form.setSubmitting(false),
		onVerifyOtpError: () =>
			setFormError([<List.Item key={0}>{t('lib.auth.resendOtp.error')}</List.Item>]),

		onResendOtpSettled: () => form.setSubmitting(false),
		onResendOtpSuccess: () => {
			setResent(true);
			setSeconds(60);
			interval.start();
		},
		onResendOtpError: () =>
			setFormError([<List.Item key={0}>{t('lib.auth.resendOtp.error')}</List.Item>]),
	});

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
		initialValues: DefaultOTPData,
		validate: valibotResolver(OTPDataSchema),
		onValuesChange: () => setFormError([]),
	});

	const handleSubmit = useCallback(
		(values: IOTPData) => {
			form.setSubmitting(true);
			setFormError([]);
			verifyOtp.mutate(values);
		},
		[form, router, verifyOtp],
	);

	const handleResend = useCallback(() => resendOtp.mutate(), [resendOtp]);

	return (
		<form onSubmit={form.onSubmit(handleSubmit)}>
			<Stack className={`${classes.inputs} ${classes.section}`}>
				{formError.length > 0 && (
					<Alert
						variant="light"
						color="red"
						title={t('auth.otp.error.title')}
						icon={<IconExclamationCircle />}
						withCloseButton
						onClose={() => setFormError([])}
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
