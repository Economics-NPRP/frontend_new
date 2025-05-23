'use client';

import { useLocale, useTranslations } from 'next-intl';

import classes from '@/pages/(auth)/styles.module.css';
import { Anchor, Button, Group, PinInput, Stack, Text } from '@mantine/core';
import { useForm } from '@mantine/form';

export default function Form() {
	const t = useTranslations();
	const locale = useLocale();

	const form = useForm({
		mode: 'uncontrolled',
	});

	return (
		<form onSubmit={form.onSubmit((value) => console.log(value))}>
			<Stack className={`${classes.inputs} ${classes.section}`}>
				<PinInput
					type="number"
					length={6}
					placeholder="0"
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
				<Button type="submit">Verify</Button>
				<Group className={classes.prompt}>
					<Text className={classes.text}>Didn't receive your code? </Text>
					<Anchor className={classes.link} href="/contact">
						Resend
					</Anchor>
				</Group>
			</Stack>
		</form>
	);
}
