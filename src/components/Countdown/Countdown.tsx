'use client';

import { DateTime, DateTimeUnit, Duration, Interval } from 'luxon';
import { useTranslations } from 'next-intl';
import { ComponentProps, useEffect, useMemo, useState } from 'react';

import { Group, Stack, Text } from '@mantine/core';
import { useInterval } from '@mantine/hooks';
import { IconPointFilled } from '@tabler/icons-react';

import { Digit } from './Digit';
import classes from './styles.module.css';

export interface CountdownProps extends ComponentProps<'div'> {
	targetDate: DateTime | string;
	units?: [DateTimeUnit, DateTimeUnit, DateTimeUnit];
	displayOnly?: boolean;
}
export const Countdown = ({
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

	const [displayUnits, setDisplayUnits] = useState<[DateTimeUnit, DateTimeUnit, DateTimeUnit]>(
		units || ['hour', 'minute', 'second'],
	);
	const [values, setValues] = useState<[number, number, number, number, number, number]>([
		0, 0, 0, 0, 0, 0,
	]);

	const displayValues = useMemo(
		() => (value: DateTime | Duration, units: [DateTimeUnit, DateTimeUnit, DateTimeUnit]) => {
			if (!value) return [0, 0, 0, 0, 0, 0];

			setValues(
				Array(6)
					.fill(0)
					.concat(
						units
							.map((unit) =>
								//	Convert value to 2-digit array, taking last 2 digits, for example:
								//	12 -> [1, 2]
								//	1 -> [0, 1]
								//	2024 -> [2, 4]
								value
									.get(unit as Exclude<DateTimeUnit, 'week'>)
									.toString()
									.padStart(4, '0')
									.slice(2)
									.padStart(2, '0')
									.split('')
									.map(Number),
							)
							.flat(),
					)
					.slice(units.length * 2) as [number, number, number, number, number, number],
			);
		},
		[],
	);

	const { start: startCountdown, stop: stopCountdown } = useInterval(() => {
		const interval = Interval.fromDateTimes(DateTime.now(), targetDate);
		if (!interval.isValid || displayOnly) {
			setValues([0, 0, 0, 0, 0, 0]);
			setDisplayUnits(['empty', 'empty', 'empty'] as never);
			return stopCountdown();
		}

		//	Scale the interval to the desired units (e.g., changes milliseconds to days, hours, minutes)
		let scaledDistance: Duration;
		if (units) scaledDistance = interval.toDuration(units);
		else scaledDistance = interval.toDuration('milliseconds').rescale();

		//	Reset milliseconds to 0 and add 1 second to round up the time
		scaledDistance = scaledDistance.set({ milliseconds: 0 }).plus({ seconds: 1 }).rescale();

		//	Set all units to 0 to fix the issue when only 1 or 2 units are non-zero
		//	For e.g., 1 day doesnt show hours and minutes
		const offset = Duration.fromObject({
			years: 0,
			quarters: 0,
			months: 0,
			weeks: 0,
			days: 0,
			hours: 0,
			minutes: 0,
			seconds: 0,
		});
		scaledDistance = offset.plus(scaledDistance);

		units = Object.keys(scaledDistance.toObject())
			.reduce((acc, unit) => {
				if (unit === 'milliseconds') return acc;

				const value = scaledDistance.get(unit as DateTimeUnit);
				if (value === 0 && acc.length === 0) return acc;

				acc.push(unit as DateTimeUnit);
				return acc;
			}, [] as DateTimeUnit[])
			.slice(0, 3) as [DateTimeUnit, DateTimeUnit, DateTimeUnit];

		setDisplayUnits(
			Array(3)
				.fill('empty')
				.concat(units)
				.slice(units.length, 3 + units.length) as [
				DateTimeUnit,
				DateTimeUnit,
				DateTimeUnit,
			],
		);

		displayValues(scaledDistance, units);
	}, 1000);

	useEffect(() => {
		if (displayOnly) displayValues(targetDate, units || ['day', 'month', 'year']);
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
