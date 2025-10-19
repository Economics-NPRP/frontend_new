'use client'
import { HomeAuctionCycleCard } from "@/components/AuctionCycleCard";
import { useContext, useEffect, useState } from "react";
import { PaginatedAuctionCyclesContext } from 'contexts/PaginatedAuctionCycles';
import { DefaultAuctionCycleData } from "@/schema/models";
import { Grid, Text } from "@mantine/core";
import { PieChart } from "@/components/Charts/Pie";
import { useTranslations } from "next-intl";
import { SectorVariants } from "@/constants/SectorData";
import { SectorType } from "@/schema/models";

export default function Content() {
	const [isClient, setIsClient] = useState(false);
	const { data, isLoading } = useContext(PaginatedAuctionCyclesContext);
	const t = useTranslations();
	const [chartData, setChartData] = useState([])

	useEffect(() => {
		console.log(data, isLoading)
		if (data && !isLoading) {
			const defaultChartData = [
				{
					id: 'energy',
					title: t('constants.sector.energy.title'),
					permits: 0,
					emissions: 0,
					auctions: 0,
				},
				{
					id: 'industry',
					title: t('constants.sector.industry.title'),
					permits: 0,
					emissions: 0,
					auctions: 0,
				},
				{
					id: 'transport',
					title: t('constants.sector.transport.title'),
					permits: 0,
					emissions: 0,
					auctions: 0,
				},
				{
					id: 'buildings',
					title: t('constants.sector.buildings.title'),
					permits: 0,
					emissions: 0,
					auctions: 0,
				},
				{
					id: 'waste',
					title: t('constants.sector.waste.title'),
					permits: 0,
					emissions: 0,
					auctions: 0,
				},
				{
					id: 'agriculture',
					title: t('constants.sector.agriculture.title'),
					permits: 0,
					emissions: 0,
					auctions: 0,
				},
			]
			const newChartData = (data.results || defaultChartData).map((item) => ({
				name: item.title,
				value: item['auctions'],
				color: SectorVariants[item.id as SectorType]!.color.hex!,
				icon: SectorVariants[item.id as SectorType]!.Icon,
				opacity: 0.6,
			}))
			setChartData(newChartData);
		}
	}, [data]);

	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!isClient) {
		return null;
	}

	return (
		<Grid columns={4}>
			{/* Current ongoing cycle */}
			<Grid.Col span={2}>
				<HomeAuctionCycleCard
					auctionCycleData={data.results[0] ?? DefaultAuctionCycleData}
					loading={isLoading}
				/>
			</Grid.Col>
			{/* Auction distribution */}
			<Grid.Col span={1}>
				<PieChart chartData={chartData} loading={isLoading} />
			</Grid.Col>
			{/* Audit company & admin */}
			<Grid.Col span={1}>
				<Text>Audit company</Text>
				<Text>Audit Admin</Text>
			</Grid.Col>
			{/* Recent company applications */}
			<Grid.Col span={2}>
				Recent company applications
			</Grid.Col>
			{/* Latest auctions table */}
			<Grid.Col span={2}>
				Latest Auctions
			</Grid.Col>
		</Grid>
	);
}
