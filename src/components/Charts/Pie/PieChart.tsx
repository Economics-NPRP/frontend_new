'use client';

import { useFormatter, useTranslations } from 'next-intl';
import { ForwardRefExoticComponent, RefAttributes, useMemo } from 'react';
import { Cell, Label, Pie, PieChart as PieChartComponent, Sector, Tooltip } from 'recharts';
import { PieSectorDataItem } from 'recharts/types/polar/Pie';

import { PieChartCell } from '@mantine/charts';
import { BoxProps, Container, Text, useMantineColorScheme } from '@mantine/core';
import { Icon, IconProps } from '@tabler/icons-react';

import classes from './styles.module.css';

interface PieChartProps extends BoxProps {
	chartData: Array<
		PieChartCell & {
			icon?: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;
			label?: string;
			opacity?: number;
		}
	>;
	type?: "permits" | "emissions" | "auctions";
	size?: number;
	scale?: number;
}
export const PieChart = ({ chartData, className, type, size=280, scale=1, ...props }: PieChartProps) => {
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
		<Container className={`${classes.root} ${className} bg-grid-md`} {...props}>
			<Container className={classes.gradient} />
			<PieChartComponent style={{ scale: scale }} width={size} height={size}>
				<Tooltip />
				<Pie
					data={chartData}
					dataKey="value"
					nameKey="name"
					innerRadius={size/4}
					outerRadius={(size/2)-20}
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
						const label = chartData[index].label;

						if (!Icon && !label) return null;

						if (label)
							return (
								<text
									className={classes.label}
									x={x}
									y={y}
									textAnchor="middle"
									dominantBaseline="middle"
								>
									{label}
								</text>
							);

						if (Icon)
							return (
								<Icon
									className={classes.icon}
									size={16}
									x={x}
									y={y}
									textAnchor="middle"
									dominantBaseline="middle"
								/>
							);
					}}
				>
					{chartData.map((entry, index) => (
						<Cell
							key={`cell-${index}`}
							fill={entry.color}
							opacity={entry.opacity || 1}
							className={classes.cell}
						/>
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
											className={classes.key}
											x={viewBox.cx}
											y={(viewBox.cy || 0) - 8}
										>
											{(type === "auctions" ? t(
												'dashboard.admin.cycles.details.distribution.chart.auctionsLabel',
											) : t(
												'dashboard.admin.cycles.details.distribution.chart.label',
											))}
										</Text>
										<Text
											component="tspan"
											className={classes.value}
											x={viewBox.cx}
											y={(viewBox.cy || 0) + 16}
										>
											{(type === "auctions" ? (chartData.reduce((acc, item) => acc + item.value, 0)) : format.number(Math.random(), 'index'))}
										</Text>
									</text>
								);
							}
						}}
					/>
				</Pie>
			</PieChartComponent>
		</Container>
	);
};
