import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { PasswordComplexityRegex } from '@/schema/models';
import {
	Group,
	PasswordInput as MantinePasswordInput,
	PasswordInputProps as MantinePasswordInputProps,
	Progress,
	Stack,
	Text,
} from '@mantine/core';
import { IconCheck, IconKey, IconX } from '@tabler/icons-react';

import classes from './styles.module.css';

export interface PasswordInputProps extends MantinePasswordInputProps {}
export const PasswordInput = ({
	defaultValue,
	value,
	onChange,
	className,
	...props
}: PasswordInputProps) => {
	//	eslint-disable-next-line
	defaultValue;
	const t = useTranslations();
	const [internalValue, setInternalValue] = useState<string>((value as string) || '');

	const requirements = useMemo(
		() => [
			{
				test: (p: string) => p.length >= 8,
				label: t('components.passwordInput.requirements.length.label'),
			},
			{
				test: (p: string) => /[0-9]/.test(p),
				label: t('components.passwordInput.requirements.number.label'),
			},
			{
				test: (p: string) => /[a-z]/.test(p),
				label: t('components.passwordInput.requirements.lowercase.label'),
			},
			{
				test: (p: string) => /[A-Z]/.test(p),
				label: t('components.passwordInput.requirements.uppercase.label'),
			},
			{
				test: (p: string) => /[$&+,:;=?@#|'<>.^*()%!-]/.test(p),
				label: t('components.passwordInput.requirements.symbol.label'),
			},
		],
		[t],
	);

	const requirementsText = useMemo(
		() =>
			requirements.map(({ test, label }, index) => (
				<Group
					className={`${test(internalValue) ? classes.meets : ''} ${classes.row}`}
					key={index}
				>
					{test(internalValue) ? (
						<IconCheck size={14} className={classes.icon} />
					) : (
						<IconX size={14} className={classes.icon} />
					)}
					<Text className={classes.text} children={label} />
				</Group>
			)),
		[internalValue, requirements],
	);

	const strength = useMemo(() => {
		if (!internalValue) return 0;
		if (internalValue.length < 4) return 10;

		let multiplier = internalValue.length >= 8 ? 0 : 1;
		requirements.forEach(({ test }) => {
			if (!test(internalValue)) multiplier += 1;
		});
		return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
	}, [internalValue, requirements]);

	const strengthColor = useMemo(() => {
		switch (true) {
			case strength < 30:
				return 'red';
			case strength < 50:
				return 'orange';
			case strength < 70:
				return 'yellow';
			default:
				return 'green';
		}
	}, [strength]);

	const handleChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = event.currentTarget.value;
			setInternalValue(newValue);
			if (onChange) onChange(event);
		},
		[onChange],
	);

	useEffect(() => {
		if (value !== undefined) setInternalValue(value as string);
	}, [value]);

	return (
		<Stack className={`${classes.root} ${className}`}>
			<MantinePasswordInput
				className={classes.input}
				type="password"
				autoComplete="current-password"
				leftSection={<IconKey size={16} />}
				value={internalValue}
				onChange={handleChange}
				pattern={PasswordComplexityRegex.source}
				minLength={8}
				{...props}
			/>
			<Group className={classes.strength}>
				<Progress
					color={strengthColor}
					value={strength < 10 ? 0 : 100}
					className={classes.progress}
				/>
				<Progress
					color={strengthColor}
					value={strength < 30 ? 0 : 100}
					className={classes.progress}
				/>
				<Progress
					color={strengthColor}
					value={strength < 50 ? 0 : 100}
					className={classes.progress}
				/>
				<Progress
					color={strengthColor}
					value={strength < 70 ? 0 : 100}
					className={classes.progress}
				/>
			</Group>
			<Stack className={classes.requirements}>{requirementsText}</Stack>
		</Stack>
	);
};
