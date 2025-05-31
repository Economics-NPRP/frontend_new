'use client';

import { DateTime, Duration } from 'luxon';
import { useFormatter, useLocale, useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

import { CountdownProps, CountdownUnitsArray } from '@/components/Countdown/constants';
import classes from '@/components/Countdown/styles.module.css';
import { calculateCountdownInterval } from '@/hooks';
import { Group, Text } from '@mantine/core';
import { useInViewport, useInterval } from '@mantine/hooks';

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
	const { ref, inViewport } = useInViewport();
	const [value, _setValue] = useState<string>('Ended');

	//	Convert the target date to a DateTime object if it is a string
	targetDate = useMemo<DateTime>(
		() => (typeof targetDate === 'string' ? DateTime.fromISO(targetDate) : targetDate),
		[targetDate],
	);

	const setValue = useMemo(
		() => (value?: DateTime | Duration, units?: CountdownUnitsArray) => {
			if (!inViewport) return;
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
		[locale, inViewport],
	);

	//	Main countdown logic
	const handleInterval = () => {
		const interval = calculateCountdownInterval(targetDate, units);

		if (!interval.valid || displayOnly) {
			setValue();
			return stopCountdown();
		}

		setValue(interval.value, interval.units);
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

	useEffect(() => {
		if (displayOnly) setValue(targetDate, units);
		else {
			handleInterval();
			startCountdown();
		}

		return stopCountdown;
	}, [targetDate, units, displayOnly]);

	return (
		<Group className={classes.root} {...props}>
			<Text className={`${classes.text} ${className}`} ref={ref}>
				{value}
			</Text>
		</Group>
	);
};
