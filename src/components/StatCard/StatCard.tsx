'use client';

import { useFormatter, useTranslations } from 'next-intl';
import { ReactNode, useMemo } from 'react';

import { CurrencyBadge, TrendBadge } from '@/components/Badge';
import { WithSkeleton } from '@/components/WithSkeleton';
import { BoxComponentProps, Container, Group, Stack, Text, Tooltip } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

import classes from './styles.module.css';

export interface StatCardProps extends BoxComponentProps {
	tooltip?: string;
	icon?: ReactNode;
	title: ReactNode;
	type: 'currency' | 'percentage' | 'integer' | 'double' | 'index';
	value: number;
	unit?: string;
	diff?: number;
	negateDiff?: boolean;
	comparison?: 'day' | 'month' | 'year';
	loading?: boolean;
}
export const StatCard = ({
	tooltip,
	icon,
	title,
	type,
	value,
	unit,
	diff,
	negateDiff,
	comparison,
	loading = false,
	className,
	...props
}: StatCardProps) => {
	const t = useTranslations();
	const format = useFormatter();

	const adjustedDiff = useMemo(
		() => (diff !== undefined ? (negateDiff ? -diff : diff) : undefined),
		[diff, negateDiff],
	);

	const amount = useMemo(() => {
		switch (type) {
			case 'currency':
				return (
					<>
						<CurrencyBadge />
						<Text className={classes.amount}>{format.number(value, 'money')}</Text>
					</>
				);
			case 'percentage':
				return (
					<Text className={classes.amount}>
						{t('constants.quantities.percent.default', { value })}
					</Text>
				);
			case 'integer':
				return <Text className={classes.amount}>{format.number(Math.round(value))}</Text>;
			case 'double':
				return <Text className={classes.amount}>{format.number(value, 'money')}</Text>;
			case 'index':
				return <Text className={classes.amount}>{format.number(value, 'index')}</Text>;
		}
	}, [type, value, format, t]);

	return (
		<Stack
			className={`${classes.root} ${adjustedDiff !== undefined && (adjustedDiff > 0 ? classes.positive : classes.negative)} ${className}`}
			{...props}
		>
			<Group className={classes.row}>
				<Text className={classes.title}>{title}</Text>
				{tooltip && (
					<Tooltip label={tooltip} disabled={!tooltip}>
						<IconInfoCircle className={classes.icon} size={16} />
					</Tooltip>
				)}
			</Group>
			<Group className={classes.row}>
				<Group className={classes.value}>
					<WithSkeleton loading={loading} width={120} height={30}>
						{amount}
						{unit && <Text className={classes.unit}>{unit}</Text>}
					</WithSkeleton>
				</Group>
				{diff && (
					<TrendBadge
						diff={diff}
						className={classes.diff}
						negate={negateDiff}
						loading={loading}
					/>
				)}
			</Group>
			<Text className={classes.comparison}>
				{t('components.statCard.comparison', { comparison })}
			</Text>
			{icon && <Container className={classes.icon}>{icon}</Container>}
		</Stack>
	);
};
