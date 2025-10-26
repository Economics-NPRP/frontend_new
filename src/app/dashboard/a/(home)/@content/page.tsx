'use client'
import classes from './styles.module.css';
import { HomeAuctionCycleCard } from "@/components/AuctionCycleCard";
import { useEffect, useState } from "react";
import { DefaultAuctionCycleData } from "@/schema/models";
import { Group, Stack, Grid, Text, Anchor } from "@mantine/core";
import { PieChart } from "@/components/Charts/Pie";
import { useTranslations } from "next-intl";
import { IconBuildingSkyscraper, IconUser } from "@tabler/icons-react";
import { useAdminHomeData } from 'hooks';
import { CompanyApplication, LatestAuctionsTable } from './_components';

export default function Content() {
	const t = useTranslations()
	const [isClient, setIsClient] = useState(false);
	const { chartData, cycles, loading, auctions, firmApplications } = useAdminHomeData()

	// Something that ai suggested so nextjs doesnt scream about hydration mismatch
	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!isClient) {
		return null;
	}

	return (
		<Grid gutter="md" className={classes.root} columns={4}>
			{/* Current ongoing cycle */}
			<Grid.Col span={2}>
				<HomeAuctionCycleCard
					auctionCycleData={cycles[0] ?? DefaultAuctionCycleData}
					loading={loading[0]}
				/>
			</Grid.Col>
			{/* Auction distribution */}
			<Grid.Col span={1}>
				<Stack className={classes.component}>
					<Text className={classes.title}>{t('homepage.chartTitle')}</Text>
					<PieChart scale={0.9} size={220} type='auctions' className={classes.chart} chartData={chartData} />
				</Stack>
			</Grid.Col>
			{/* Audit company & admin */}
			<Grid.Col span={1}>
				<Stack className={classes.auditContainer}>
					<Anchor style={{ textDecoration: 'none' }} href='/dashboard/a/firms' className={`${classes.audit} ${classes.company}`}>
						<Stack className={classes.auditContent} gap={0}>
							<Text className={classes.text}>Audit Company</Text>
							<Text className={classes.description}>decription about the economic state of the world</Text>
						</Stack>
						<IconBuildingSkyscraper className={classes.icon} size={96} />
					</Anchor>
					<Anchor style={{ textDecoration: 'none' }} href='/dashboard/a/admins' className={`${classes.audit} ${classes.admin}`}>
						<Stack className={classes.auditContent} gap={0}>
							<Text className={classes.text}>Audit Admin</Text>
							<Text className={classes.description}>decription about the economic state of the world</Text>
						</Stack>
						<IconUser className={classes.icon} size={96} />
					</Anchor>
				</Stack>
			</Grid.Col>
			{/* Recent company applications */}
			<Grid.Col span={2}>
				<Stack className={`${classes.component} ${classes.companyApplications}`}>
					<Text className={classes.title}>Recent company applications</Text>
					<Stack className={classes.applicationsList} align='flex-start' px={24} pt={20} pb={32} gap={16}>
						{firmApplications && firmApplications.length > 0 ? firmApplications.map((application, index) => (
							<CompanyApplication
								key={'application-'+index}
								crn={application.crn}
								companyName={application.companyName}
								applicationDate={application.applicationDate}
								sectors={application.sectors}
								status={application.status}
								loading={loading[1]}
							/>
						)) : (
								<CompanyApplication
									key={'loading-application'}
									crn={''}
									companyName={''}
									applicationDate={''}
									sectors={[]}
									status={'pending'}
									loading={loading[1]}
								/>
						)}
					</Stack>
				</Stack>

			</Grid.Col>
			{/* Latest auctions table */}
			<Grid.Col span={2}>
				<Stack h="100%" className={classes.component}>
					<Text className={classes.title}>Latest Auctions</Text>
					<Stack>
						<LatestAuctionsTable
							records={auctions || null}
							loading={loading[2]}
						/>
					</Stack>
				</Stack>
			</Grid.Col>
		</Grid>
	);
}
