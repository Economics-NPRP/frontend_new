import { DateTime, DateTimeUnit, Duration, Interval } from 'luxon';
import { useEffect, useMemo, useState } from 'react';

import {
	CountdownProps,
	CountdownUnit,
	CountdownUnitsArray,
} from '@/components/Countdown/constants';
import { useInViewport, useInterval } from '@mantine/hooks';

export const calculateCountdownInterval = (targetDate: DateTime, units?: CountdownUnitsArray) => {
	const interval = Interval.fromDateTimes(DateTime.now(), targetDate);
	if (!interval.isValid) return { valid: false, value: undefined, units: undefined };

	//	Scale the interval to the desired units (e.g., changes milliseconds to days, hours, minutes)
	let duration: Duration;
	if (units) duration = interval.toDuration(units as DateTimeUnit[]);
	else duration = interval.toDuration('milliseconds').rescale();

	//	Reset milliseconds to 0 and add 1 second to round up the time
	duration = duration.set({ milliseconds: 0 }).plus({ seconds: 1 }).rescale();

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
	duration = offset.plus(duration);

	//	Take from the first non-zero unit onwards but filter out milliseconds
	//	For e.g., 0 weeks 1 day 2 hours 3 minutes 4 seconds -> [day, hour, minute]
	units = Object.keys(duration.toObject())
		.reduce((acc, unit) => {
			if (unit === 'milliseconds') return acc;

			const value = duration.get(unit as DateTimeUnit);
			if (value === 0 && acc.length === 0) return acc;

			acc.push(unit as CountdownUnit);
			return acc;
		}, [] as Array<CountdownUnit>)
		.slice(0, 3) as CountdownUnitsArray;

	//	Add empty units to the start of the array to make it 3 units long
	//	For e.g., if we only have [minute, seconds] -> [empty, minute, seconds]
	units = Array(3)
		.fill('empty')
		.concat(units)
		.slice(units.length, 3 + units.length) as CountdownUnitsArray;

	return { valid: true, value: duration, units };
};

interface UseCountdownProps extends Pick<CountdownProps, 'targetDate' | 'units' | 'displayOnly'> {}
export const useCountdown = ({ targetDate, units, displayOnly }: UseCountdownProps) => {
	const { ref, inViewport } = useInViewport();

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
			if (!inViewport) return;
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
								unit !== 'empty'
									? value
											.get(unit as never)
											.toString()
											.padStart(4, '0')
											.slice(2)
											.padStart(2, '0')
											.split('')
											.map(Number)
									: [0, 0],
							)
							.flat(),
					)
					.slice(units!.length * 2) as [number, number, number, number, number, number],
			);
		},
		[inViewport],
	);

	//	Main countdown logic
	const handleInterval = () => {
		const interval = calculateCountdownInterval(targetDate, units);

		if (!interval.valid || displayOnly) {
			setDisplayUnits(['empty', 'empty', 'empty'] as never);
			setValues();
			return stopCountdown();
		}

		setDisplayUnits(interval.units!);
		setValues(interval.value, interval.units);
	};
	const { start: startCountdown, stop: stopCountdown } = useInterval(handleInterval, 1000);

	//	Only render the value if the component is in the viewport
	useEffect(() => {
		if (displayOnly) return;
		if (!inViewport) stopCountdown();
		else {
			handleInterval();
			startCountdown();
		}
	}, [inViewport, displayOnly]);

	//	Start the countdown on mount, and when props change
	useEffect(() => {
		if (displayOnly) setValues(targetDate, units || ['day', 'month', 'year']);
		else {
			handleInterval();
			startCountdown();
		}

		return stopCountdown;
	}, [targetDate, units, displayOnly]);

	return {
		values,
		displayUnits,
		ref,
	};
};
