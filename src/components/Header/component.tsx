'use client';

import { ActionIcon, ActionIconProps, Center, Flex, Group, Tooltip, useComputedColorScheme } from '@mantine/core';
import classes from './styles.module.css';
import { DynamicVariants, HeaderButtonVariants, type HeaderButtonVariantType } from './constants';
import { useEffect, useState } from 'react';

export interface HeaderButtonProps extends ActionIconProps {
	variant: HeaderButtonVariantType;
}
export const HeaderButton = ({ variant, className, ...props }: HeaderButtonProps) => {
	const computedColorScheme = useComputedColorScheme('light');

	const [tooltip, setTooltip] = useState<string>();
	const [ariaLabel, setAriaLabel] = useState<string>();
	const [icon, setIcon] = useState<JSX.Element>();

	useEffect(() => {
		const { tooltip, ariaLabel, icon } = HeaderButtonVariants[variant]!;
		setTooltip(tooltip as string);
		setAriaLabel(ariaLabel as string);
		setIcon(icon as JSX.Element);

		if (!DynamicVariants.includes(variant)) return;
		let args: unknown;
		switch (variant) {
			case 'theme':
				args = computedColorScheme;
				break;
			case 'language':
				args = 'English';
				break;
		}

		if (typeof tooltip === 'function') setTooltip(tooltip(args as never));
		if (typeof ariaLabel === 'function') setAriaLabel(ariaLabel(args as never));
		if (typeof icon === 'function') setIcon(icon(args as never));
	}, [computedColorScheme, variant]);

	return (
		<Tooltip label={tooltip}>
			<ActionIcon
				className={`${classes.headerButton} ${className}`}
				variant="transparent"
				aria-label={ariaLabel}
				{...props}
			>
				{icon}
			</ActionIcon>
		</Tooltip>
	);
};

export const Header = () => {
	return (
		<Center component="header" className={classes.root}>
			<Group className={classes.container}>
				<Flex className={classes.left}>1</Flex>
				<Flex className={classes.search}>2</Flex>
				<Flex className={classes.right}>
					<HeaderButton variant="search" className={classes.search} />
					<HeaderButton variant="notifications" />
					<HeaderButton variant="accessibility" />
					<HeaderButton variant="language" />
					<HeaderButton variant="theme" />
					<HeaderButton variant="user" />
				</Flex>
			</Group>
		</Center>
	);
};
