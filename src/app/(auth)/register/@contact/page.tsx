'use client';

import { useLocale, useTranslations } from 'next-intl';

import classes from '@/pages/(auth)/styles.module.css';
import { Button, Stack, TextInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconBuilding, IconMail } from '@tabler/icons-react';

export default function Contact() {
	const t = useTranslations();
	const locale = useLocale();

	const form = useForm({
		mode: 'uncontrolled',
	});

	return (
		<form onSubmit={form.onSubmit((value) => console.log(value))}>
			<Stack className={`${classes.inputs} ${classes.section}`}>
				<TextInput
					label="Company Name"
					placeholder="Enter company name..."
					autoComplete="company"
					leftSection={<IconBuilding size={16} />}
					required
					key={form.key('company')}
					{...form.getInputProps('company')}
				/>
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
				<Textarea
					label="Message"
					placeholder="Enter message..."
					minRows={3}
					key={form.key('message')}
					{...form.getInputProps('message')}
				/>
				<Button type="submit" className="mt-2">
					Send
				</Button>
			</Stack>
		</form>
	);
}
