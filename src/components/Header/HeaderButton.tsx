import { MouseEventHandler, useEffect, useMemo, useState } from 'react';

import { toggleUserLocale } from '@/locales';
import { ActionIcon, ActionIconProps, Tooltip, useMantineColorScheme } from '@mantine/core';

import { DynamicVariants, HeaderButtonVariantType, HeaderButtonVariants } from './constants';
import classes from './styles.module.css';

export interface HeaderButtonProps extends ActionIconProps {
	variant: HeaderButtonVariantType;
}
export const HeaderButton = ({ variant, className, ...props }: HeaderButtonProps) => {
	const { colorScheme, setColorScheme } = useMantineColorScheme();

	const [tooltip, setTooltip] = useState<string>();
	const [ariaLabel, setAriaLabel] = useState<string>();
	const [icon, setIcon] = useState<JSX.Element>();

	const onClickHandler = useMemo<MouseEventHandler<HTMLButtonElement>>(() => {
		switch (variant) {
			case 'theme':
				return (() =>
					setColorScheme(colorScheme === 'light' ? 'dark' : 'light')) as MouseEventHandler<HTMLButtonElement>;
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
				args = 'English';
				break;
		}

		if (typeof tooltip === 'function') setTooltip(tooltip(args as never));
		if (typeof ariaLabel === 'function') setAriaLabel(ariaLabel(args as never));
		if (typeof icon === 'function') setIcon(icon(args as never));
	}, [colorScheme, variant]);

	return (
		<Tooltip label={tooltip}>
			<ActionIcon
				className={`${classes.headerButton} ${className}`}
				variant="transparent"
				aria-label={ariaLabel}
				onClick={onClickHandler}
				{...props}
			>
				{icon}
			</ActionIcon>
		</Tooltip>
	);
};
