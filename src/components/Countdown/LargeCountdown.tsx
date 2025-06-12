'use client';

import { useTranslations } from 'next-intl';

import { Digit } from '@/components/Countdown/Digit';
import { CountdownProps } from '@/components/Countdown/constants';
import classes from '@/components/Countdown/styles.module.css';
import { useCountdown } from '@/hooks';
import { Group, Skeleton, Stack, Text } from '@mantine/core';
import { IconPointFilled } from '@tabler/icons-react';

export const LargeCountdown = ({
	targetDate,
	units,
	displayOnly,
	loading,
	className,
	...props
}: CountdownProps) => {
	const t = useTranslations();
	const { values, displayUnits, ref } = useCountdown({ targetDate, units, displayOnly });

	return (
		<Group className={`${classes.root} ${className}`} ref={ref} {...props}>
			<Stack className={classes.unit}>
				<Group className={classes.value}>
					{loading && (
						<>
							<Skeleton width={32} height={52} visible data-dark />
							<Skeleton width={32} height={52} visible data-dark />
						</>
					)}
					{!loading && (
						<>
							<Digit value={values[0]} />
							<Digit value={values[1]} />
						</>
					)}
				</Group>
				{loading && <Skeleton width={48} height={16} visible />}
				{!loading && (
					<Text className={classes.label}>
						{t(`components.countdown.label.long.${displayUnits[0]}`)}
					</Text>
				)}
			</Stack>

			<Stack className={classes.separator}>
				<IconPointFilled className={classes.icon} size={10} />
				<IconPointFilled className={classes.icon} size={10} />
			</Stack>

			<Stack className={classes.unit}>
				<Group className={classes.value}>
					{loading && (
						<>
							<Skeleton width={32} height={52} visible data-dark />
							<Skeleton width={32} height={52} visible data-dark />
						</>
					)}
					{!loading && (
						<>
							<Digit value={values[2]} />
							<Digit value={values[3]} />
						</>
					)}
				</Group>
				{loading && <Skeleton width={48} height={16} visible />}
				{!loading && (
					<Text className={classes.label}>
						{t(`components.countdown.label.long.${displayUnits[1]}`)}
					</Text>
				)}
			</Stack>

			<Stack className={classes.separator}>
				<IconPointFilled className={classes.icon} size={10} />
				<IconPointFilled className={classes.icon} size={10} />
			</Stack>

			<Stack className={classes.unit}>
				<Group className={classes.value}>
					{loading && (
						<>
							<Skeleton width={32} height={52} visible data-dark />
							<Skeleton width={32} height={52} visible data-dark />
						</>
					)}
					{!loading && (
						<>
							<Digit value={values[4]} />
							<Digit value={values[5]} />
						</>
					)}
				</Group>
				{loading && <Skeleton width={48} height={16} visible />}
				{!loading && (
					<Text className={classes.label}>
						{t(`components.countdown.label.long.${displayUnits[2]}`)}
					</Text>
				)}
			</Stack>
		</Group>
	);
};
