import { useFormatter } from 'next-intl';
import { useContext, useMemo } from 'react';

import { CurrencyBadge } from '@/components/Badge';
import { Switch } from '@/components/SwitchCase';
import { AllOpenAuctionResultsContext, SingleAuctionContext } from '@/contexts';
import { generateTrendData } from '@/helpers';
import { DonutChart, PieChartCell, Sparkline } from '@mantine/charts';
import { Divider, Group, Loader, Stack, Text } from '@mantine/core';
import { IconLeaf } from '@tabler/icons-react';

import classes from './styles.module.css';

export const Statistics = () => {
	const format = useFormatter();
	const auction = useContext(SingleAuctionContext);
	const allOpenAuctionResults = useContext(AllOpenAuctionResultsContext);

	const minBidsData = useMemo(
		() =>
			generateTrendData({
				points: 20,
				trend: 'exponential',
				noise: 0.25,
				base: 6,
				growth: 1.25,
				label: 'Minimum Winning Bid',
			}),
		[],
	);

	const permitsData = useMemo<Array<PieChartCell>>(() => {
		if (!allOpenAuctionResults || !allOpenAuctionResults.isSuccess) return [];

		return (
			allOpenAuctionResults.data.results
				.sort((a, b) => b.permitsReserved - a.permitsReserved)
				//	Take the top 7 results
				.slice(0, 7)
				//	Transform the results into the format required by the PieChart
				.map<PieChartCell>((result, index) => ({
					name: result.firm.name,
					value: result.permitsReserved,
					color: `dark.${7 - index}`,
				}))
				//	Add the remaining results as "Other Firms"
				.concat([
					{
						name: 'Other Firms',
						value: allOpenAuctionResults.data.results
							.slice(5)
							.reduce((acc, result) => acc + result.permitsReserved, 0),
						color: '#eee',
					},
				])
		);
	}, [allOpenAuctionResults]);

	return (
		<Stack className={classes.statistics}>
			<Switch value={auction.isLoading || allOpenAuctionResults.isLoading}>
				<Switch.True>
					<Loader color="gray" className={classes.loader} />
					<Text className={classes.loaderText}>Loading Auction Statistics...</Text>
				</Switch.True>
				<Switch.False>
					<Group className={`${classes.minBid} ${classes.section}`}>
						<Stack className={classes.content}>
							<Text className={classes.key}>Minimum Winning Bid</Text>
							<Group className={classes.value}>
								<CurrencyBadge />
								<Text className={classes.amount}>
									{format.number(
										minBidsData[minBidsData.length - 1]['Minimum Winning Bid'],
										'money',
									)}
								</Text>
							</Group>
						</Stack>
						<Sparkline
							w={140}
							h={80}
							color="#000000"
							data={minBidsData.map((data) => data['Minimum Winning Bid'])}
							curveType="natural"
						/>
					</Group>
					<Divider />
					<Stack className={`${classes.permits} ${classes.section}`}>
						<DonutChart
							classNames={{ label: classes.label }}
							data={permitsData}
							size={220}
							tooltipDataSource="segment"
							paddingAngle={2}
							chartLabel="Permits Reserved by Firm"
							withTooltip
						/>
						<Stack className={classes.content}>
							<Text className={classes.key}>Total Permits Offered</Text>
							<Group className={classes.value}>
								<IconLeaf size={20} />
								<Text className={classes.amount}>
									{format.number(auction.data.permits)}
								</Text>
							</Group>
						</Stack>
					</Stack>
				</Switch.False>
			</Switch>
		</Stack>
	);
};
