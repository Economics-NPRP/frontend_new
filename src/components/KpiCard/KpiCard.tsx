'use client';

import { useFormatter, useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { BaseBadge, CurrencyBadge, SectorBadge } from '@/components/Badge';
import { Switch } from '@/components/SwitchCase';
import { SectorType } from '@/schema/models';
import { Group, Progress, Stack, StackProps, Text, Tooltip } from '@mantine/core';
import { IconSlash, IconTriangleFilled } from '@tabler/icons-react';

import classes from './styles.module.css';

export interface KpiCardProps extends StackProps {
	title: string;
	current: number;
	target: number;
	targetType: 'exceeds' | 'meets';
	valueType: 'currency' | 'percentage' | 'integer' | 'double' | 'index';
	sector?: 'all' | SectorType;
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
	sector = 'all',
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
		let formatter: (a: number) => string = (a) => a.toString();

		switch (valueType) {
			case 'currency':
				formatter = (a) => format.number(a, 'money');
				break;
			case 'percentage':
				formatter = (a) => t('constants.quantities.percent.default', { value: a });
				break;
			case 'integer':
				formatter = (a) => format.number(Math.round(a));
				break;
			case 'double':
				formatter = (a) => format.number(a, 'money');
				break;
			case 'index':
				formatter = (a) => format.number(a, 'index');
				break;
		}

		return {
			current: (
				<>
					{valueType === 'currency' && <CurrencyBadge />}
					<Text className={classes.amount}>{formatter(current)}</Text>
				</>
			),
			target: (
				<>
					{valueType === 'currency' && <CurrencyBadge />}
					<Text className={classes.amount}>{formatter(target)}</Text>
				</>
			),
			deviation: (
				<>
					{valueType === 'currency' && <CurrencyBadge />}
					<Text className={classes.amount}>{formatter(current - target)}</Text>
				</>
			),
			ltD: `(!!!) <= ${formatter(target - gradeDeviations.c)} ${unit}`,
			ltC: `(C) <= ${formatter(target - gradeDeviations.b)} ${unit}`,
			ltB: `(B) <= ${formatter(target - gradeDeviations.a)} ${unit}`,
			A: `${formatter(target - gradeDeviations.a)} ${unit} > (A) > ${formatter(target + gradeDeviations.a)} ${unit}`,
			gtB: `(B) >= ${formatter(target + gradeDeviations.a)} ${unit}`,
			gtC: `(C) >= ${formatter(target + gradeDeviations.b)} ${unit}`,
			gtD: `(!!!) >= ${formatter(target + gradeDeviations.c)} ${unit}`,
		};
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
				<Group className={classes.label}>
					<Text className={classes.title}>{title}</Text>
					{sector !== 'all' && <SectorBadge sector={sector} />}
				</Group>
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
						<Tooltip label={amount.ltD}>
							<Progress.Section
								value={
									((gradeDeviations.d - gradeDeviations.c) / gradeDeviations.d) *
									50
								}
								className={`${classes.section} ${classes.red}`}
							/>
						</Tooltip>
						<Tooltip label={amount.ltC}>
							<Progress.Section
								value={
									((gradeDeviations.c - gradeDeviations.b) / gradeDeviations.d) *
									50
								}
								className={`${classes.section} ${classes.orange}`}
							/>
						</Tooltip>
						<Tooltip label={amount.ltB}>
							<Progress.Section
								value={
									((gradeDeviations.b - gradeDeviations.a) / gradeDeviations.d) *
									50
								}
								className={`${classes.section} ${classes.yellow}`}
							/>
						</Tooltip>
						<Tooltip label={amount.A}>
							<Progress.Section
								value={(gradeDeviations.a / gradeDeviations.d) * 100}
								className={`${classes.section} ${classes.green}`}
							/>
						</Tooltip>
						<Tooltip label={amount.gtB}>
							<Progress.Section
								value={
									((gradeDeviations.b - gradeDeviations.a) / gradeDeviations.d) *
									50
								}
								className={`${classes.section} ${classes.yellow}`}
							/>
						</Tooltip>
						<Tooltip label={amount.gtC}>
							<Progress.Section
								value={
									((gradeDeviations.c - gradeDeviations.b) / gradeDeviations.d) *
									50
								}
								className={`${classes.section} ${classes.orange}`}
							/>
						</Tooltip>
						<Tooltip label={amount.gtD}>
							<Progress.Section
								value={
									((gradeDeviations.d - gradeDeviations.c) / gradeDeviations.d) *
									50
								}
								className={`${classes.section} ${classes.red}`}
							/>
						</Tooltip>
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
