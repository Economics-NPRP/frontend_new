'use client';

import { useFormatter, useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { BaseBadge, CurrencyBadge } from '@/components/Badge';
import { Switch } from '@/components/SwitchCase';
import { Group, Progress, Stack, StackProps, Text } from '@mantine/core';
import { IconSlash, IconTriangleFilled } from '@tabler/icons-react';

import classes from './styles.module.css';

export interface KpiCardProps extends StackProps {
	title: string;
	current: number;
	target: number;
	targetType: 'exceeds' | 'meets';
	valueType: 'currency' | 'percentage' | 'integer' | 'double' | 'index';
	unit?: string;
	gradeDeviations?: {
		a: number;
		b: number;
		c: number;
		d: number;
	};
}
export const KpiCard = ({
	title,
	current,
	target,
	targetType,
	valueType,
	unit,
	gradeDeviations = {
		a: 10,
		b: 50,
		c: 100,
		d: 150,
	},
	className,
	...props
}: KpiCardProps) => {
	const t = useTranslations();
	const format = useFormatter();

	const percent = useMemo(() => Math.round((current / target) * 100), [current, target]);

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
					deviation: (
						<>
							<CurrencyBadge />
							<Text className={classes.amount}>
								{format.number(current - target, 'money')}
							</Text>
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
					deviation: (
						<Text className={classes.amount}>
							{t('constants.quantities.percent.default', {
								value: Math.abs(current - target),
							})}
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
					deviation: (
						<Text className={classes.amount}>
							{format.number(Math.round(current - target))}
						</Text>
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
					deviation: (
						<Text className={classes.amount}>
							{format.number(current - target, 'money')}
						</Text>
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
					deviation: (
						<Text className={classes.amount}>
							{format.number(current - target, 'index')}
						</Text>
					),
				};
		}
	}, [valueType, current, target, format, t]);

	const gradeBadge = useMemo(() => {
		if (targetType !== 'meets') return null;

		const deviation = Math.abs(current - target);

		if (deviation <= gradeDeviations.a)
			return (
				<BaseBadge className={classes.badge} color={'green'}>
					A
				</BaseBadge>
			);
		if (deviation <= gradeDeviations.b)
			return (
				<BaseBadge className={classes.badge} color={'yellow'}>
					B
				</BaseBadge>
			);
		if (deviation <= gradeDeviations.c)
			return (
				<BaseBadge className={classes.badge} color={'orange'}>
					C
				</BaseBadge>
			);
		if (deviation <= gradeDeviations.d)
			return (
				<BaseBadge className={classes.badge} color={'red'}>
					D
				</BaseBadge>
			);
		return (
			<BaseBadge className={classes.badge} color={'maroon'}>
				!!!
			</BaseBadge>
		);
	}, [targetType, current, target, gradeDeviations]);

	const markerPosition = useMemo(() => {
		if (targetType !== 'meets') return null;

		return Math.min(Math.max(50 + ((current - target) / gradeDeviations.d) * 50, 0), 100);
	}, [targetType, current, target, gradeDeviations]);

	return (
		<Stack className={`${classes.root} ${className}`} {...props}>
			<Group className={classes.header}>
				<Text className={classes.title}>{title}</Text>
				<Switch value={targetType}>
					<Switch.Case when="exceeds">
						<BaseBadge className={`${classes.badge} ${classes.white}`}>
							{t('constants.quantities.percent.integer', {
								value: percent,
							})}
						</BaseBadge>
					</Switch.Case>
					<Switch.Case when="meets">{gradeBadge}</Switch.Case>
				</Switch>
			</Group>
			<Switch value={targetType}>
				<Switch.Case when="exceeds">
					<Progress
						size={'md'}
						value={percent}
						classNames={{
							root: classes.progress,
							section: `${classes.section} ${classes.white}`,
						}}
					/>
				</Switch.Case>
				<Switch.Case when="meets">
					<Progress.Root size={'md'} className={classes.progress}>
						<Progress.Section
							value={
								((gradeDeviations.d - gradeDeviations.c) / gradeDeviations.d) * 50
							}
							className={`${classes.section} ${classes.red}`}
						/>
						<Progress.Section
							value={
								((gradeDeviations.c - gradeDeviations.b) / gradeDeviations.d) * 50
							}
							className={`${classes.section} ${classes.orange}`}
						/>
						<Progress.Section
							value={
								((gradeDeviations.b - gradeDeviations.a) / gradeDeviations.d) * 50
							}
							className={`${classes.section} ${classes.yellow}`}
						/>
						<Progress.Section
							value={(gradeDeviations.a / gradeDeviations.d) * 100}
							className={`${classes.section} ${classes.green}`}
						/>
						<Progress.Section
							value={
								((gradeDeviations.b - gradeDeviations.a) / gradeDeviations.d) * 50
							}
							className={`${classes.section} ${classes.yellow}`}
						/>
						<Progress.Section
							value={
								((gradeDeviations.c - gradeDeviations.b) / gradeDeviations.d) * 50
							}
							className={`${classes.section} ${classes.orange}`}
						/>
						<Progress.Section
							value={
								((gradeDeviations.d - gradeDeviations.c) / gradeDeviations.d) * 50
							}
							className={`${classes.section} ${classes.red}`}
						/>
						<IconTriangleFilled
							size={12}
							className={classes.marker}
							style={{
								left: `${markerPosition}%`,
							}}
						/>
					</Progress.Root>
				</Switch.Case>
			</Switch>
			<Group className={classes.footer}>
				<Stack className={classes.value}>
					<Text className={classes.label}>{t('components.kpiCard.current')}</Text>
					<Group className={classes.row}>
						{amount.current}
						{unit && <Text className={classes.unit}>{unit}</Text>}
					</Group>
				</Stack>
				<IconSlash size={20} className={classes.icon} />
				<Stack className={classes.value}>
					<Text className={classes.label}>{t('components.kpiCard.target')}</Text>
					<Group className={classes.row}>
						{amount.target}
						{unit && <Text className={classes.unit}>{unit}</Text>}
					</Group>
				</Stack>
				<IconSlash size={20} className={classes.icon} />
				<Stack className={classes.value}>
					<Text className={classes.label}>{t('components.kpiCard.deviation')}</Text>
					<Group className={classes.row}>
						{amount.deviation}
						{unit && <Text className={classes.unit}>{unit}</Text>}
					</Group>
				</Stack>
			</Group>
		</Stack>
	);
};
