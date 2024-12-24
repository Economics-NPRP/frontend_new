'use client';

import { useTranslations } from 'next-intl';
import { CSSProperties, ComponentPropsWithRef, useMemo } from 'react';

import { Center } from '@mantine/core';

import classes from './styles.module.css';

export interface DigitProps extends ComponentPropsWithRef<'div'> {
	value: number;
}
export const Digit = ({ value, className, ...props }: DigitProps) => {
	const t = useTranslations();

	const style = useMemo<CSSProperties>(() => ({ '--value': value || 0 }), [value]);

	return (
		<Center className={`${classes.cell} ${className}`} {...props}>
			<p
				className={classes.digit}
				data-content={t('components.countdown.value')}
				style={style}
			></p>
		</Center>
	);
};
