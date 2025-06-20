import { useFormatter, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useContext, useMemo } from 'react';

import { CurrencyBadge } from '@/components/Badge';
import { Switch } from '@/components/SwitchCase';
import { MyOpenAuctionResultsContext, SingleAuctionContext } from '@/contexts';
import { useAuctionAvailability } from '@/hooks';
import {
	ActionIcon,
	Button,
	Container,
	Divider,
	Group,
	Loader,
	Skeleton,
	Stack,
	Text,
	Title,
	Tooltip,
	useMatches,
} from '@mantine/core';
import {
	IconArrowUpRight,
	IconCoins,
	IconInfoCircle,
	IconLeaf,
	IconLicense,
} from '@tabler/icons-react';

import classes from './styles.module.css';

export const Winnings = () => {
	const t = useTranslations();
	const format = useFormatter();
	const showButtonText = useMatches({
		xs: true,
		sm: false,
		md: true,
		xl: false,
	});
	const auction = useContext(SingleAuctionContext);
	const myOpenAuctionResults = useContext(MyOpenAuctionResultsContext);

	const { areResultsAvailable } = useAuctionAvailability();

	const currentState = useMemo(() => {
		if (myOpenAuctionResults.isLoading || auction.isLoading) return 'loading';
		if (!areResultsAvailable) return 'unavailable';
		return 'available';
	}, [myOpenAuctionResults.isLoading, auction.isLoading, areResultsAvailable]);

	return (
		<Stack className={`${classes.winnings} ${classes.section}`}>
			<Divider
				label={
					<Group className={classes.row}>
						<Text className={classes.label}>
							{t('marketplace.auction.details.details.winnings.title')}
						</Text>
						<Tooltip
							position="top"
							label={t('marketplace.auction.details.details.winnings.info')}
						>
							<IconInfoCircle size={14} className={classes.info} />
						</Tooltip>
					</Group>
				}
				classNames={{
					root: classes.divider,
					label: classes.label,
				}}
			/>

			<Switch value={currentState}>
				<Switch.Loading>
					<Group className={classes.row}>
						<Stack className={classes.cell}>
							<Container className={classes.icon}>
								<IconLicense size={16} />
							</Container>
							<Text className={classes.key}>
								{t('marketplace.auction.details.details.winnings.permits')}
							</Text>
							<Skeleton width={100} height={28} visible data-dark />
						</Stack>
						<Stack className={classes.cell}>
							<Container className={classes.icon}>
								<IconLeaf size={16} />
							</Container>
							<Text className={classes.key}>
								{t('marketplace.auction.details.details.winnings.emissions')}
							</Text>
							<Skeleton width={120} height={28} visible data-dark />
						</Stack>
						<Stack className={classes.cell}>
							<Container className={classes.icon}>
								<IconCoins size={16} />
							</Container>
							<Text className={classes.key}>
								{t('marketplace.auction.details.details.winnings.bill')}
							</Text>
							<Skeleton width={160} height={28} visible data-dark />
						</Stack>
						<Stack className={classes.cell}>
							<Loader color="gray" className={classes.loader} />
						</Stack>
					</Group>
				</Switch.Loading>
				<Switch.Case when="unavailable">
					<Stack className={classes.alert}>
						<Title order={3} className={classes.title}>
							{auction.data.type === 'sealed'
								? t(
										'marketplace.auction.details.details.winnings.alert.sealed.title',
									)
								: t(
										'marketplace.auction.details.details.winnings.alert.else.title',
									)}
						</Title>
						<Text className={classes.description}>
							{auction.data.type === 'sealed'
								? t(
										'marketplace.auction.details.details.winnings.alert.sealed.description',
									)
								: t(
										'marketplace.auction.details.details.winnings.alert.else.description',
									)}
						</Text>
					</Stack>
				</Switch.Case>
				<Switch.Case when="available">
					<Group className={classes.row}>
						<Stack className={classes.cell}>
							<Container className={classes.icon}>
								<IconLicense size={16} />
							</Container>
							<Text className={classes.key}>
								{t('marketplace.auction.details.details.winnings.permits')}
							</Text>
							<Group className={classes.row}>
								<Text className={classes.value}>
									{format.number(
										Math.round(myOpenAuctionResults.data.permitsReserved),
									)}
								</Text>
								<Text className={classes.unit}>{t('constants.permits.unit')}</Text>
							</Group>
						</Stack>
						<Stack className={classes.cell}>
							<Container className={classes.icon}>
								<IconLeaf size={16} />
							</Container>
							<Text className={classes.key}>
								{t('marketplace.auction.details.details.winnings.emissions')}
							</Text>
							<Group className={classes.row}>
								<Text className={classes.value}>
									{format.number(
										// TODO: Replace with actual emissions calculation
										Math.round(
											myOpenAuctionResults.data.permitsReserved * 1000,
										),
									)}
								</Text>
								<Text className={classes.unit}>
									{t('constants.emissions.unit')}
								</Text>
							</Group>
						</Stack>
						<Stack className={classes.cell}>
							<Container className={classes.icon}>
								<IconCoins size={16} />
							</Container>
							<Text className={classes.key}>
								{t('marketplace.auction.details.details.winnings.bill')}
							</Text>
							<Group className={classes.row}>
								<CurrencyBadge className={classes.badge} />
								<Text className={classes.value}>
									{format.number(
										Math.round(myOpenAuctionResults.data.finalBill),
										'money',
									)}
								</Text>
							</Group>
						</Stack>
						<Tooltip
							label={t('marketplace.auction.details.details.winnings.cta.tooltip')}
						>
							<Switch value={showButtonText}>
								<Switch.True>
									<Button
										className={classes.cell}
										component={Link}
										href={`/marketplace/auction/${auction.data.id}/results`}
										rightSection={<IconArrowUpRight size={24} />}
									>
										{t(
											'marketplace.auction.details.details.winnings.cta.label',
										)}
									</Button>
								</Switch.True>
								<Switch.False>
									<ActionIcon
										className={classes.cell}
										component={Link}
										href={`/marketplace/auction/${auction.data.id}/results`}
									>
										<IconArrowUpRight size={24} />
									</ActionIcon>
								</Switch.False>
							</Switch>
						</Tooltip>
					</Group>
				</Switch.Case>
			</Switch>
		</Stack>
	);
};
