'use client';

import { ElementType, ReactNode, useLayoutEffect, useRef, useState } from 'react';

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
};
export const ActionBanner = <C extends ElementType = 'button'>({
	icon,
	heading,
	subheading,
	className,
	...props
}: ActionBannerProps<C>) => {
	const ref = useRef<HTMLButtonElement>(null);
	const [childIndex, setChildIndex] = useState(0);

	useLayoutEffect(() => {
		if (!ref.current) return;

		const parent = ref.current.parentElement;
		if (!parent) return;

		const children = Array.from(parent.children);
		setChildIndex(children.indexOf(ref.current));
	}, []);

	return (
		<UnstyledButton
			className={`${classes.root} ${className}`}
			ref={ref}
			{...(props as UnstyledButtonProps)}
		>
			<Container className={classes.bg}>
				<Switch value={childIndex}>
					<Switch.Case when={0}>
						<Container className={classes.graphic} />
						<Container className={classes.graphic} />
						<Container className={classes.graphic} />
						<Container className={classes.gradient} />
					</Switch.Case>
					<Switch.Case when={1}>
						<Container className={`${classes.graphic} bg-grid-md`} />
						<Container className={classes.gradient} />
					</Switch.Case>
					<Switch.Case when={2}>
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
