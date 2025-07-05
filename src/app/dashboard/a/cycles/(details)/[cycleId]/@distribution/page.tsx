'use client';

import { useFormatter, useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { Cell, Label, Pie, PieChart, Sector, Tooltip } from 'recharts';
import { PieSectorDataItem } from 'recharts/types/polar/Pie';

import { AuctionCategoryVariants } from '@/constants/AuctionCategory';
import { Container, Group, Select, Stack, Text, Title, useMantineColorScheme } from '@mantine/core';

import classes from './styles.module.css';

export default function Distribution() {
	const t = useTranslations();
	const format = useFormatter();
	const { colorScheme } = useMantineColorScheme();
	const [type, setType] = useState<'permits' | 'emissions' | 'auctions'>('permits');

	const chartData = useMemo(() => {
		return [
			{
				name: t('constants.auctionCategory.energy.title'),
				value: Math.round(Math.random() * 1000),
				color: AuctionCategoryVariants.energy!.color.hex!,
				icon: AuctionCategoryVariants.energy!.Icon,
			},
			{
				name: t('constants.auctionCategory.industry.title'),
				value: Math.round(Math.random() * 1000),
				color: AuctionCategoryVariants.industry!.color.hex!,
				icon: AuctionCategoryVariants.industry!.Icon,
			},
			{
				name: t('constants.auctionCategory.transport.title'),
				value: Math.round(Math.random() * 1000),
				color: AuctionCategoryVariants.transport!.color.hex!,
				icon: AuctionCategoryVariants.transport!.Icon,
			},
			{
				name: t('constants.auctionCategory.buildings.title'),
				value: Math.round(Math.random() * 1000),
				color: AuctionCategoryVariants.buildings!.color.hex!,
				icon: AuctionCategoryVariants.buildings!.Icon,
			},
			{
				name: t('constants.auctionCategory.waste.title'),
				value: Math.round(Math.random() * 1000),
				color: AuctionCategoryVariants.waste!.color.hex!,
				icon: AuctionCategoryVariants.waste!.Icon,
			},
			{
				name: t('constants.auctionCategory.agriculture.title'),
				value: Math.round(Math.random() * 1000),
				color: AuctionCategoryVariants.agriculture!.color.hex!,
				icon: AuctionCategoryVariants.agriculture!.Icon,
			},
		];
	}, [t]);

	const biggestIndex = useMemo(() => {
		return (
			chartData.findIndex(
				(item) => item.value === Math.max(...chartData.map((d) => d.value)),
			) || 0
		);
	}, [chartData]);

	return (
		<Stack className={classes.root}>
			<Group className={classes.header}>
				<Stack className={classes.label}>
					<Title order={2} className={classes.title}>
						{t('dashboard.admin.cycles.details.distribution.title')}
					</Title>
					<Text className={classes.subtitle}>
						{t('dashboard.admin.cycles.details.distribution.subtitle')}
					</Text>
				</Stack>
				<Select
					className={classes.dropdown}
					w={120}
					value={type}
					onChange={(value) => setType(value as 'permits' | 'emissions' | 'auctions')}
					data={[
						{
							value: 'permits',
							label: t('constants.permits.key'),
						},
						{
							value: 'emissions',
							label: t('constants.emissions.key'),
						},
						{
							value: 'auctions',
							label: t('constants.auctions.key'),
						},
					]}
					allowDeselect={false}
				/>
			</Group>
			<Container className={classes.chart}>
				<PieChart width={280} height={280}>
					<Tooltip />
					<Pie
						data={chartData}
						dataKey="value"
						nameKey="name"
						innerRadius={70}
						outerRadius={120}
						strokeWidth={5}
						stroke={colorScheme === 'light' ? '#ffffff' : '#25262b'}
						activeIndex={biggestIndex}
						activeShape={({
							outerRadius = 0,
							className,
							...props
						}: PieSectorDataItem) => (
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
							console.log(percent);
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
							<Cell
								key={`cell-${index}`}
								fill={entry.color}
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
		</Stack>
	);
}
