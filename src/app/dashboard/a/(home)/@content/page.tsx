'use client'
import classes from './styles.module.css';
import { HomeAuctionCycleCard } from "@/components/AuctionCycleCard";
import { useContext, useEffect, useState, useCallback, ForwardRefExoticComponent, RefAttributes } from "react";
import { PaginatedAuctionCyclesContext } from 'contexts/PaginatedAuctionCycles';
import { DefaultAuctionCycleData, IAuctionData } from "@/schema/models";
import { Group, Stack, Grid, Text } from "@mantine/core";
import { PieChart } from "@/components/Charts/Pie";
import { useTranslations } from "next-intl";
import { SectorVariants } from "@/constants/SectorData";
import { SectorType } from "@/schema/models";
import { buildChartData } from "@/lib/homepages/buildChartData";
import { Icon, IconProps, IconBuildingSkyscraper, IconUser } from "@tabler/icons-react";
import { useAdminHomeData } from 'hooks';

export default function Content() {
	const t = useTranslations()
	const [isClient, setIsClient] = useState(false);
	const { chartData, data, isLoading } = useAdminHomeData()

	// Something that ai suggested so nextjs doesnt scream about hydration mismatch
	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!isClient) {
		return null;
	}

	return (
		<Grid className={classes.root} columns={4}>
			{/* Current ongoing cycle */}
			<Grid.Col span={2}>
				<HomeAuctionCycleCard
					auctionCycleData={data.results[0] ?? DefaultAuctionCycleData}
					loading={isLoading}
				/>
			</Grid.Col>
			{/* Auction distribution */}
			<Grid.Col className={classes.chartContainer} span={1}>
				<Stack className={classes.chartStack}>
					<Text className={classes.chartTitle}>{t('homepage.chartTitle')}</Text>
					<PieChart scale={0.9} size={220} type='auctions' className={classes.chart} chartData={chartData} />
				</Stack>
			</Grid.Col>
			{/* Audit company & admin */}
			<Grid.Col span={1}>
				<Stack>
					<Group>
						<Text className={classes.auditCompany}>Audit Company</Text>
						<IconBuildingSkyscraper size={20} />
					</Group>
					<Group>
						<Text className={classes.auditAdmin}>Audit Admin</Text>
						<IconUser size={20} />
					</Group>
				</Stack>
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
