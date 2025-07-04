'use client';

import { useFormatter, useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { BaseBadge, CurrencyBadge } from '@/components/Badge';
import { Switch } from '@/components/SwitchCase';
import { Group, Progress, Stack, StackProps, Text } from '@mantine/core';
import { IconSlash } from '@tabler/icons-react';

import classes from './styles.module.css';

export interface KpiCardProps extends StackProps {
	title: string;
	current: number;
	target: number;
	targetType: 'exceeds' | 'meets';
	valueType: 'currency' | 'percentage' | 'integer' | 'double' | 'index';
	unit?: string;
}
export const KpiCard = ({
	title,
	current,
	target,
	targetType,
	valueType,
	unit,
	className,
	...props
}: KpiCardProps) => {
	const t = useTranslations();
	const format = useFormatter();

	const percent = useMemo(() => (current / target) * 100, [current, target]);

	const amount = useMemo(() => {
		switch (valueType) {
			case 'currency':
				return {
					current: (
						<>
							<CurrencyBadge />
							<Text className={classes.amount}>
								{format.number(current, 'money')}
							</Text>
						</>
					),
					target: (
						<>
							<CurrencyBadge />
							<Text className={classes.amount}>{format.number(target, 'money')}</Text>
						</>
					),
				};
			case 'percentage':
				return {
					current: (
						<Text className={classes.amount}>
							{t('constants.quantities.percent.default', { value: current })}
						</Text>
					),
					target: (
						<Text className={classes.amount}>
							{t('constants.quantities.percent.default', { value: target })}
						</Text>
					),
				};
			case 'integer':
				return {
					current: (
						<Text className={classes.amount}>{format.number(Math.round(current))}</Text>
					),
					target: (
						<Text className={classes.amount}>{format.number(Math.round(target))}</Text>
					),
				};
			case 'double':
				return {
					current: (
						<Text className={classes.amount}>{format.number(current, 'money')}</Text>
					),
					target: (
						<Text className={classes.amount}>{format.number(target, 'money')}</Text>
					),
				};
			case 'index':
				return {
					current: (
						<Text className={classes.amount}>{format.number(current, 'index')}</Text>
					),
					target: (
						<Text className={classes.amount}>{format.number(target, 'index')}</Text>
					),
				};
		}
	}, [valueType, current, target, format, t]);

	return (
		<Stack className={`${classes.root} ${className}`} {...props}>
			<Group className={classes.header}>
				<Text className={classes.title}>{title}</Text>
				<BaseBadge className={classes.badge}>
					{t('constants.quantities.percent.default', {
						value: percent,
					})}
				</BaseBadge>
			</Group>
			<Switch value={targetType}>
				<Switch.Case when="exceeds">
					<Progress
						size={'md'}
						value={percent}
						classNames={{ root: classes.progress, section: classes.section }}
					/>
				</Switch.Case>
			</Switch>
			<Group className={classes.footer}>
				<Stack className={classes.value}>
					<Text className={classes.label}>Current</Text>
					<Group className={classes.row}>
						{amount.current}
						{unit && <Text className={classes.unit}>{unit}</Text>}
					</Group>
				</Stack>
				<IconSlash size={20} className={classes.icon} />
				<Stack className={classes.value}>
					<Text className={classes.label}>Target</Text>
					<Group className={classes.row}>
						{amount.target}
						{unit && <Text className={classes.unit}>{unit}</Text>}
					</Group>
				</Stack>
			</Group>
		</Stack>
	);
};
