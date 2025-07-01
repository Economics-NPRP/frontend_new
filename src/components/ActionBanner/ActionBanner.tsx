'use client';

import { ElementType, ReactNode } from 'react';

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
};
export const ActionBanner = <C extends ElementType = 'button'>({
	icon,
	heading,
	subheading,
	index,
	className,
	...props
}: ActionBannerProps<C>) => {
	return (
		<UnstyledButton
			className={`${classes.root} ${classes[`id${index}`]} ${className}`}
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
				</Switch>
			</Container>

			{icon}
			<Text className={classes.heading}>{heading}</Text>
			<Text className={classes.text}>{subheading}</Text>
		</UnstyledButton>
	);
};
