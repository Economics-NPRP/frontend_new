import { DateTime, DateTimeUnit, Duration, Interval } from 'luxon';

import { CountdownUnit, CountdownUnitsArray } from '@/components/Countdown/constants';

export const calculateInterval = (targetDate: DateTime, units?: CountdownUnitsArray) => {
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
