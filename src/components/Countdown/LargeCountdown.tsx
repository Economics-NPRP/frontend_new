'use client';

import { DateTime, Duration } from 'luxon';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

import { Digit } from '@/components/Countdown/Digit';
import { CountdownProps, CountdownUnitsArray } from '@/components/Countdown/constants';
import { calculateInterval } from '@/components/Countdown/helpers';
import classes from '@/components/Countdown/styles.module.css';
import { Group, Stack, Text } from '@mantine/core';
import { useInterval } from '@mantine/hooks';
import { IconPointFilled } from '@tabler/icons-react';

export const LargeCountdown = ({
	targetDate,
	units,
	displayOnly = false,
	className,
	...props
}: CountdownProps) => {
	const t = useTranslations();

	//	Convert the target date to a DateTime object if it is a string
	targetDate = useMemo<DateTime>(
		() => (typeof targetDate === 'string' ? DateTime.fromISO(targetDate) : targetDate),
		[targetDate],
	);

	const [displayUnits, setDisplayUnits] = useState<CountdownUnitsArray>(
		units || ['hour', 'minute', 'second'],
	);
	const [values, _setValues] = useState<[number, number, number, number, number, number]>([
		0, 0, 0, 0, 0, 0,
	]);

	const setValues = useMemo(
		() => (value?: DateTime | Duration, units?: CountdownUnitsArray) => {
			if (!value) return _setValues([0, 0, 0, 0, 0, 0]);

			_setValues(
				Array(6)
					.fill(0)
					.concat(
						units!
							.map((unit) =>
								//	Convert value to 2-digit array, taking last 2 digits, for example:
								//	12 -> [1, 2]
								//	1 -> [0, 1]
								//	2024 -> [2, 4]
								value
									.get(unit as never)
									.toString()
									.padStart(4, '0')
									.slice(2)
									.padStart(2, '0')
									.split('')
									.map(Number),
							)
							.flat(),
					)
					.slice(units!.length * 2) as [number, number, number, number, number, number],
			);
		},
		[],
	);

	const { start: startCountdown, stop: stopCountdown } = useInterval(() => {
		const interval = calculateInterval(targetDate, units);

		if (!interval.valid || displayOnly) {
			setDisplayUnits(['empty', 'empty', 'empty'] as never);
			setValues();
			return stopCountdown();
		}

		setDisplayUnits(interval.units!);
		setValues(interval.value, interval.units);
	}, 1000);

	useEffect(() => {
		if (displayOnly) setValues(targetDate, units || ['day', 'month', 'year']);
		else startCountdown();

		return stopCountdown;
	}, [targetDate, units, displayOnly]);

	return (
		<Group className={`${classes.root} ${className}`} {...props}>
			<Stack className={classes.unit}>
				<Group className={classes.value}>
					<Digit value={values[0]} />
					<Digit value={values[1]} />
				</Group>
				<Text className={classes.label}>
					{t(`components.countdown.label.long.${displayUnits[0]}`)}
				</Text>
			</Stack>

			<Stack className={classes.separator}>
				<IconPointFilled className={classes.icon} size={10} />
				<IconPointFilled className={classes.icon} size={10} />
			</Stack>

			<Stack className={classes.unit}>
				<Group className={classes.value}>
					<Digit value={values[2]} />
					<Digit value={values[3]} />
				</Group>
				<Text className={classes.label}>
					{t(`components.countdown.label.long.${displayUnits[1]}`)}
				</Text>
			</Stack>

			<Stack className={classes.separator}>
				<IconPointFilled className={classes.icon} size={10} />
				<IconPointFilled className={classes.icon} size={10} />
			</Stack>

			<Stack className={classes.unit}>
				<Group className={classes.value}>
					<Digit value={values[4]} />
					<Digit value={values[5]} />
				</Group>
				<Text className={classes.label}>
					{t(`components.countdown.label.long.${displayUnits[2]}`)}
				</Text>
			</Stack>
		</Group>
	);
};
