'use client';

import { useFormatter, useTranslations } from 'next-intl';
import { ForwardRefExoticComponent, RefAttributes, useMemo } from 'react';
import { Cell, Label, Pie, PieChart, Sector, Tooltip } from 'recharts';
import { PieSectorDataItem } from 'recharts/types/polar/Pie';

import { PieChartCell } from '@mantine/charts';
import { Container, Text, useMantineColorScheme } from '@mantine/core';
import { Icon, IconProps } from '@tabler/icons-react';

import classes from './styles.module.css';

interface ChartProps {
	chartData: Array<
		PieChartCell & { icon: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>> }
	>;
}
export const Chart = ({ chartData }: ChartProps) => {
	const t = useTranslations();
	const format = useFormatter();
	const { colorScheme } = useMantineColorScheme();

	const biggestIndex = useMemo(() => {
		return (
			chartData.findIndex(
				(item) => item.value === Math.max(...chartData.map((d) => d.value)),
			) || 0
		);
	}, [chartData]);

	return (
		<Container className={`${classes.chart} bg-grid-md`}>
			<Container className={classes.gradient} />
			<PieChart width={280} height={280}>
				<Tooltip />
				<Pie
					data={chartData}
					dataKey="value"
					nameKey="name"
					innerRadius={70}
					outerRadius={120}
					strokeWidth={5}
					stroke={colorScheme === 'light' ? '#ffffff' : '#1a1b1e'}
					activeIndex={biggestIndex}
					activeShape={({ outerRadius = 0, className, ...props }: PieSectorDataItem) => (
						<g>
							<Sector
								{...props}
								className={`${className} ${classes.active}`}
								outerRadius={outerRadius + 10}
							/>
							<Sector
								{...props}
								className={`${className} ${classes.active}`}
								outerRadius={outerRadius + 20}
								innerRadius={outerRadius + 10}
							/>
						</g>
					)}
					labelLine={false}
					label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
						if (percent < 0.05) return null;

						const RADIAN = Math.PI / 180;
						const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
						const x = cx + radius * Math.cos(-midAngle * RADIAN);
						const y = cy + radius * Math.sin(-midAngle * RADIAN);
						const Icon = chartData[index].icon;

						return (
							<Icon
								className={classes.icon}
								size={16}
								x={x}
								y={y}
								textAnchor={x > cx ? 'start' : 'end'}
								dominantBaseline="central"
							/>
						);
					}}
				>
					{chartData.map((entry, index) => (
						<Cell key={`cell-${index}`} fill={entry.color} className={classes.cell} />
					))}
					<Label
						content={({ viewBox }) => {
							if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
								return (
									<text
										className={classes.label}
										x={viewBox.cx}
										y={viewBox.cy}
										textAnchor="middle"
										dominantBaseline="middle"
									>
										<Text
											component="tspan"
											className={`${classes.key} x`}
											x={viewBox.cx}
											y={(viewBox.cy || 0) - 8}
										>
											{t(
												'dashboard.admin.cycles.details.distribution.chart.label',
											)}
										</Text>
										<Text
											component="tspan"
											className={classes.value}
											x={viewBox.cx}
											y={(viewBox.cy || 0) + 16}
										>
											{format.number(Math.random(), 'index')}
										</Text>
									</text>
								);
							}
						}}
					/>
				</Pie>
			</PieChart>
		</Container>
	);
};
