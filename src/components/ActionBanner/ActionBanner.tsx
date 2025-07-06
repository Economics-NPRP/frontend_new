'use client';

import { ElementType, ReactNode, useCallback } from 'react';

import { Switch } from '@/components/SwitchCase';
import {
	Container,
	PolymorphicComponentProps,
	Text,
	UnstyledButton,
	UnstyledButtonProps,
} from '@mantine/core';

import classes from './styles.module.css';

export type ActionBannerProps<C> = PolymorphicComponentProps<C, UnstyledButtonProps> & {
	icon: ReactNode;
	heading: ReactNode;
	subheading: ReactNode;
	index: number;
	disabled?: boolean;
};
export const ActionBanner = <C extends ElementType = 'button'>({
	icon,
	heading,
	subheading,
	index,
	disabled = false,
	onClick,
	className,
	...props
}: ActionBannerProps<C>) => {
	const handleOnClick = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			if (disabled) e.preventDefault();
			onClick?.(e);
		},
		[disabled, onClick],
	);

	return (
		<UnstyledButton
			className={`${classes.root} ${classes[`id${index}`]} ${disabled ? classes.disabled : ''} ${className}`}
			disabled={disabled}
			data-disabled={disabled}
			onClick={handleOnClick}
			{...(props as UnstyledButtonProps)}
		>
			<Container className={classes.bg}>
				<Switch value={index}>
					<Switch.Case when={1}>
						<Container className={classes.graphic} />
						<Container className={classes.graphic} />
						<Container className={classes.graphic} />
						<Container className={classes.gradient} />
					</Switch.Case>
					<Switch.Case when={2}>
						<Container className={`${classes.graphic} bg-grid-md`} />
						<Container className={classes.gradient} />
					</Switch.Case>
					<Switch.Case when={3}>
						<Container className={classes.graphic}>
							<svg width={'300'} height={'300'} style={{ overflow: 'visible' }}>
								<polygon
									points={'150,0 0,300 300,300'}
									fill={'none'}
									strokeWidth={'1.5'}
								/>
							</svg>
						</Container>
						<Container className={classes.graphic}>
							<svg width={'300'} height={'300'} style={{ overflow: 'visible' }}>
								<polygon
									points={'150,0 0,300 300,300'}
									fill={'none'}
									strokeWidth={'1.5'}
								/>
							</svg>
						</Container>
						<Container className={classes.gradient} />
					</Switch.Case>
					<Switch.Case when={4}>
						<Container className={`${classes.left} ${classes.graphic}`} />
						<Container className={`${classes.right} ${classes.graphic}`} />
						<Container className={`${classes.left} ${classes.corner}`} />
						<Container className={`${classes.right} ${classes.corner}`} />
						<Container className={classes.gradient} />
					</Switch.Case>
				</Switch>
			</Container>

			{icon}
			<Text className={classes.heading}>{heading}</Text>
			<Text className={classes.text}>{subheading}</Text>
		</UnstyledButton>
	);
};
