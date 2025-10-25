'use client'
import classes from './styles.module.css';
import { HomeAuctionCycleCard } from "@/components/AuctionCycleCard";
import { useEffect, useState } from "react";
import { DefaultAuctionCycleData } from "@/schema/models";
import { Group, Stack, Grid, Text } from "@mantine/core";
import { PieChart } from "@/components/Charts/Pie";
import { useTranslations } from "next-intl";
import { IconBuildingSkyscraper, IconUser } from "@tabler/icons-react";
import { useAdminHomeData } from 'hooks';
import { CompanyApplication } from './_components';

export default function Content() {
	const t = useTranslations()
	const [isClient, setIsClient] = useState(false);
	const { chartData, cycles, loading } = useAdminHomeData()

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
			<Grid.Col style={{ padding: 0 }} span={2}>
				<HomeAuctionCycleCard
					auctionCycleData={cycles[0] ?? DefaultAuctionCycleData}
					loading={loading[0]}
				/>
			</Grid.Col>
			{/* Auction distribution */}
			<Grid.Col className={classes.component} span={1}>
				<Stack className={classes.chartStack}>
					<Text className={classes.title}>{t('homepage.chartTitle')}</Text>
					<PieChart scale={0.9} size={220} type='auctions' className={classes.chart} chartData={chartData} />
				</Stack>
			</Grid.Col>
			{/* Audit company & admin */}
			<Grid.Col style={{ padding: 0 }} span={1}>
				<Stack className={classes.component} align="flex-start" h="100%" gap={16}>
					<Text className={classes.title}>Audits</Text>
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
			<Grid.Col style={{ padding: 0 }} span={2}>
				<Stack className={`${classes.component} ${classes.companyApplications}`}>
					<Text className={classes.title}>Recent company applications</Text>
					<Stack className={classes.applicationsList} align='flex-start' px={24} pt={20} pb={32} gap={16}>
						<CompanyApplication 
							crn="654948135136"
							companyName="The Dih Company"
							applicationDate="10/12/2025, 5:45 PM"
							sectors={['energy']}
							status="approved"
							loading={loading[1]}
						/>
						<CompanyApplication
							crn="654948135136"
							companyName="The Dih Company"
							applicationDate="10/12/2025, 5:45 PM"
							sectors={['energy']}
							status="pending"
							loading={loading[1]}
						/>
						<CompanyApplication
							crn="654948135136"
							companyName="The Dih Company"
							applicationDate="10/12/2025, 5:45 PM"
							sectors={['energy']}
							status="rejected"
							loading={loading[1]}
						/>
						<CompanyApplication
							crn="654948135136"
							companyName="The Dih Company"
							applicationDate="10/12/2025, 5:45 PM"
							sectors={['energy']}
							status="rejected"
							loading={loading[1]}
						/>
					</Stack>
				</Stack>
				
			</Grid.Col>
			{/* Latest auctions table */}
			<Grid.Col style={{ padding: 0 }} span={2}>
				<Stack h="100%" className={classes.component}>
					<Text className={classes.title}>Latest Auctions</Text>
				</Stack>
			</Grid.Col>
		</Grid>
	);
}
