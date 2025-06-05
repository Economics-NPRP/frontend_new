'use client';

import { useTranslations } from 'next-intl';

import { Digit } from '@/components/Countdown/Digit';
import { CountdownProps } from '@/components/Countdown/constants';
import classes from '@/components/Countdown/styles.module.css';
import { useCountdown } from '@/hooks';
import { Group, Stack, Text } from '@mantine/core';
import { IconPointFilled } from '@tabler/icons-react';

export const MediumCountdown = ({
	targetDate,
	units,
	displayOnly,
	className,
	...props
}: CountdownProps) => {
	const t = useTranslations();
	const { values, displayUnits, ref } = useCountdown({ targetDate, units, displayOnly });

	return (
		<Group className={`${classes.root} ${classes.medium} ${className}`} ref={ref} {...props}>
			<Stack className={classes.unit}>
				<Group className={classes.value}>
					<Digit value={values[0]} />
					<Digit value={values[1]} />
				</Group>
				<Text className={classes.label}>
					{t(`components.countdown.label.medium.${displayUnits[0]}`)}
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
					{t(`components.countdown.label.medium.${displayUnits[1]}`)}
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
					{t(`components.countdown.label.medium.${displayUnits[2]}`)}
				</Text>
			</Stack>
		</Group>
	);
};
