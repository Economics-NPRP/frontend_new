'use client';

import { ComponentProps, useCallback, useRef } from 'react';

import { ActionIcon, NumberInput, NumberInputHandlers } from '@mantine/core';
import { useInterval, useTimeout } from '@mantine/hooks';
import { IconMinus, IconPlus } from '@tabler/icons-react';

import classes from './styles.module.css';

export interface BiddingNumberInputProps extends ComponentProps<typeof NumberInput> {
	dark?: boolean;
}
export const BiddingNumberInput = ({ dark, ...props }: BiddingNumberInputProps) => {
	const ref = useRef<NumberInputHandlers>(null);

	const incrementInterval = useInterval(() => ref.current?.increment(), 50);
	const decrementInterval = useInterval(() => ref.current?.decrement(), 50);

	const handleHoldIncrement = useTimeout(() => incrementInterval.start(), 500);
	const handleHoldDecrement = useTimeout(() => decrementInterval.start(), 500);

	const handleStartIncrement = useCallback(() => {
		ref.current?.increment();
		handleHoldIncrement.start();
	}, [handleHoldIncrement]);
	const handleStartDecrement = useCallback(() => {
		ref.current?.decrement();
		handleHoldDecrement.start();
	}, [handleHoldDecrement]);

	const handleCancelIncrement = useCallback(() => {
		incrementInterval.stop();
		handleHoldIncrement.clear();
	}, [incrementInterval, handleHoldIncrement]);
	const handleCancelDecrement = useCallback(() => {
		decrementInterval.stop();
		handleHoldDecrement.clear();
	}, [decrementInterval, handleHoldDecrement]);

	return (
		<NumberInput
			classNames={{
				root: `${classes.root} ${dark ? classes.dark : ''}`,
				wrapper: classes.wrapper,
				input: classes.input,
				section: classes.section,
				error: 'hidden',
			}}
			min={1}
			thousandSeparator=" "
			thousandsGroupStyle="thousand"
			leftSection={
				<ActionIcon
					onMouseDown={handleStartDecrement}
					onMouseUp={handleCancelDecrement}
					onMouseLeave={handleCancelDecrement}
					disabled={props.disabled}
				>
					<IconMinus size={16} />
				</ActionIcon>
			}
			rightSection={
				<ActionIcon
					onMouseDown={handleStartIncrement}
					onMouseUp={handleCancelIncrement}
					onMouseLeave={handleCancelIncrement}
					disabled={props.disabled}
				>
					<IconPlus size={16} />
				</ActionIcon>
			}
			handlersRef={ref}
			{...props}
		/>
	);
};
