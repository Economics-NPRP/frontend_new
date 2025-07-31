'use client';

import { useLocale, useTranslations } from 'next-intl';
import { MouseEventHandler, useContext, useEffect, useMemo, useState } from 'react';

import { MyUserProfileContext } from '@/contexts';
import { toggleUserLocale } from '@/locales';
import { ActionIcon, ActionIconProps, Tooltip, useMantineColorScheme } from '@mantine/core';

import { DynamicVariants, HeaderButtonVariantType, HeaderButtonVariants } from './constants';
import classes from './styles.module.css';

export interface HeaderButtonProps extends ActionIconProps {
	variant: HeaderButtonVariantType;
}
export const HeaderButton = ({ variant, className, ...props }: HeaderButtonProps) => {
	const t = useTranslations();
	const locale = useLocale();
	const { colorScheme, setColorScheme } = useMantineColorScheme();

	const currentUser = useContext(MyUserProfileContext);

	const [tooltip, setTooltip] = useState<string>();
	const [ariaLabel, setAriaLabel] = useState<string>();
	const [icon, setIcon] = useState<JSX.Element>();

	const onClickHandler = useMemo<MouseEventHandler<HTMLButtonElement>>(() => {
		switch (variant) {
			case 'theme':
				return (() =>
					setColorScheme(
						colorScheme === 'light' ? 'dark' : 'light',
					)) as MouseEventHandler<HTMLButtonElement>;
			case 'language':
				return toggleUserLocale;
			default:
				return () => {};
		}
	}, [variant, colorScheme]);

	useEffect(() => {
		const { tooltip, ariaLabel, icon } = HeaderButtonVariants[variant]!;
		setTooltip(tooltip as string);
		setAriaLabel(ariaLabel as string);
		setIcon(icon as JSX.Element);

		if (!DynamicVariants.includes(variant)) return;
		let args: unknown;
		switch (variant) {
			case 'theme':
				args = colorScheme;
				break;
			case 'language':
				args = locale;
				break;
			case 'user':
				args = currentUser.data;
				break;
		}

		if (typeof tooltip === 'function') setTooltip(tooltip(args as never));
		if (typeof ariaLabel === 'function') setAriaLabel(ariaLabel(args as never));
		if (typeof icon === 'function') setIcon(icon(args as never));
	}, [locale, colorScheme, currentUser, variant]);

	return (
		<Tooltip label={tooltip && t(tooltip as never)}>
			<ActionIcon
				className={`${classes.headerButton} ${className}`}
				variant="transparent"
				aria-label={ariaLabel && t(ariaLabel as never)}
				onClick={onClickHandler}
				{...props}
			>
				{icon}
			</ActionIcon>
		</Tooltip>
	);
};
