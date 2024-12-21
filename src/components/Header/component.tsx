'use client';

import {
	ActionIcon,
	ActionIconProps,
	Button,
	Center,
	Flex,
	Group,
	Tooltip,
	useMantineColorScheme,
} from '@mantine/core';
import classes from './styles.module.css';
import { DynamicVariants, HeaderButtonVariants, type HeaderButtonVariantType } from './constants';
import { MouseEventHandler, useEffect, useMemo, useState } from 'react';
import { IconArrowUpLeft, IconBox } from '@tabler/icons-react';

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

export const Header = () => {
	return (
		<Center component="header" className={classes.root}>
			<Group className={classes.container}>
				<Flex className={classes.left}>
					<Button
						component="a"
						href="/dashboard"
						className={classes.dashboardButton}
						variant="light"
						size="xs"
						leftSection={<IconArrowUpLeft size={14} />}
					>
						Return to Dashboard
					</Button>
					<Tooltip label="Return to Marketplace Home">
						<Button
							component="a"
							href="/"
							aria-label="Home button"
							classNames={{ root: `${classes.logo} ${classes.headerButton}`, label: classes.label }}
							variant="transparent"
							size="xs"
							leftSection={<IconBox size={20} />}
						>
							ETS
						</Button>
					</Tooltip>
					<HeaderButton variant="notifications" />
				</Flex>
				<Flex className={classes.search}></Flex>
				<Flex className={classes.right}>
					<HeaderButton className={classes.search} variant="search" />
					<HeaderButton variant="accessibility" />
					<HeaderButton variant="language" />
					<HeaderButton variant="theme" />
					<HeaderButton className={classes.user} variant="user" />
				</Flex>
			</Group>
		</Center>
	);
};
