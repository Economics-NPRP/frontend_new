'use client';

import { useTranslations } from 'next-intl';

import { Digit } from '@/components/Countdown/Digit';
import { CountdownProps } from '@/components/Countdown/constants';
import classes from '@/components/Countdown/styles.module.css';
import { Switch } from '@/components/SwitchCase';
import { useCountdown } from '@/hooks';
import { Group, Skeleton, Stack, Text } from '@mantine/core';
import { IconPointFilled } from '@tabler/icons-react';

export const LargeCountdown = ({
	targetDate,
	units,
	displayOnly,
	loading = false,
	className,
	...props
}: CountdownProps) => {
	const t = useTranslations();
	const { values, displayUnits, ref } = useCountdown({ targetDate, units, displayOnly });

	return (
		<Group className={`${classes.root} ${className}`} ref={ref} {...props}>
			<Switch value={loading}>
				<Switch.True>
					<Stack className={classes.unit}>
						<Group className={classes.value}>
							<Skeleton width={32} height={52} visible data-dark />
							<Skeleton width={32} height={52} visible data-dark />
						</Group>
						<Skeleton width={48} height={16} visible />
					</Stack>

					<Stack className={classes.separator}>
						<IconPointFilled className={classes.icon} size={10} />
						<IconPointFilled className={classes.icon} size={10} />
					</Stack>

					<Stack className={classes.unit}>
						<Group className={classes.value}>
							<Skeleton width={32} height={52} visible data-dark />
							<Skeleton width={32} height={52} visible data-dark />
						</Group>
						<Skeleton width={48} height={16} visible />
					</Stack>

					<Stack className={classes.separator}>
						<IconPointFilled className={classes.icon} size={10} />
						<IconPointFilled className={classes.icon} size={10} />
					</Stack>

					<Stack className={classes.unit}>
						<Group className={classes.value}>
							<Skeleton width={32} height={52} visible data-dark />
							<Skeleton width={32} height={52} visible data-dark />
						</Group>
						<Skeleton width={48} height={16} visible />
					</Stack>
				</Switch.True>
				<Switch.False>
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
				</Switch.False>
			</Switch>
		</Group>
	);
};
