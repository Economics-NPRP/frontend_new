'use client';

import { DateTime, Duration } from 'luxon';
import { useFormatter, useLocale, useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

import { CountdownProps, CountdownUnitsArray } from '@/components/Countdown/constants';
import { calculateInterval } from '@/components/Countdown/helpers';
import classes from '@/components/Countdown/styles.module.css';
import { Group, Text } from '@mantine/core';
import { useInterval } from '@mantine/hooks';

export const SmallCountdown = ({
	targetDate,
	units,
	displayOnly = false,
	className,
	...props
}: CountdownProps) => {
	const t = useTranslations();
	const format = useFormatter();
	const locale = useLocale();

	//	Convert the target date to a DateTime object if it is a string
	targetDate = useMemo<DateTime>(
		() => (typeof targetDate === 'string' ? DateTime.fromISO(targetDate) : targetDate),
		[targetDate],
	);

	const [value, _setValue] = useState<string>('Ended');
	const setValue = useMemo(
		() => (value?: DateTime | Duration, units?: CountdownUnitsArray) => {
			if (!value) return _setValue('Ended');

			_setValue(
				units!
					.reduce((acc, unit) => {
						if (unit === 'empty') return acc;

						const formattedUnit = format.number(value.get(unit as never));
						const suffix = t(`components.countdown.label.short.${unit}`);

						// if (locale === 'en') return `${acc}${formattedUnit}${suffix} `;
						// else return `${formattedUnit}${suffix} ${acc} `;
						return `${acc}${formattedUnit}${suffix} `;
					}, '')
					.trim(),
			);
		},
		[locale],
	);

	const { start: startCountdown, stop: stopCountdown } = useInterval(() => {
		const interval = calculateInterval(targetDate, units);

		if (!interval.valid || displayOnly) {
			setValue();
			return stopCountdown();
		}

		setValue(interval.value, interval.units);
	}, 1000);

	useEffect(() => {
		if (displayOnly) setValue(targetDate, units);
		else startCountdown();

		return stopCountdown;
	}, [targetDate, units, displayOnly]);

	return (
		<Group className={`${classes.root} ${className}`} {...props}>
			<Text className={classes.text}>{value}</Text>
		</Group>
	);
};
