import { PaginatedAuctionsContext } from 'contexts/PaginatedAuctions';
import { useTranslations } from 'next-intl';
import { useContext, useMemo } from 'react';

import { AuctionCard } from '@/components/AuctionCard';
import { Switch } from '@/components/SwitchCase';
import { TablePagination } from '@/components/Tables/_components/Pagination';
import { DefaultAuctionData } from '@/schema/models';
import { Container, Stack, Text } from '@mantine/core';
import { IconDatabaseOff, IconExclamationCircle } from '@tabler/icons-react';

import classes from './styles.module.css';

export const AuctionCatalogueList = () => {
	const t = useTranslations();
	const paginatedAuctions = useContext(PaginatedAuctionsContext);

	const currentState = useMemo(() => {
		if (paginatedAuctions.isFetching) return 'loading';
		if (paginatedAuctions.isError) return 'error';
		if (paginatedAuctions.isSuccess && paginatedAuctions.data.resultCount === 0) return 'empty';
	}, [
		paginatedAuctions.isFetching,
		paginatedAuctions.isError,
		paginatedAuctions.isSuccess,
		paginatedAuctions.data.resultCount,
	]);

	const pagination = useMemo(
		() =>
			paginatedAuctions.isLoading
				? null
				: paginatedAuctions.data.pageCount > 1 && (
						<TablePagination
							className={classes.pagination}
							context={paginatedAuctions}
						/>
					),
		[paginatedAuctions.isLoading, paginatedAuctions.data.pageCount],
	);

	return (
		<Container className={classes.catalogue}>
			{pagination}
			<Switch value={currentState}>
				<Switch.Loading>
					{new Array(paginatedAuctions.perPage).fill(null).map((_, index) => (
						<AuctionCard key={index} loading auction={DefaultAuctionData} />
					))}
				</Switch.Loading>
				<Switch.Error>
					<Stack className={classes.placeholder}>
						<Container className={classes.icon}>
							<IconExclamationCircle size={24} />
						</Container>
						<Text className={classes.text}>
							{t('components.auctionCatalogue.error')}
						</Text>
					</Stack>
				</Switch.Error>
				<Switch.Case when="empty">
					<Stack className={classes.placeholder}>
						<Container className={classes.icon}>
							<IconDatabaseOff size={24} />
						</Container>
						<Text className={classes.text}>
							{t('components.auctionCatalogue.empty')}
						</Text>
					</Stack>
				</Switch.Case>
				<Switch.Else>
					{paginatedAuctions.data.results.map((auction) => (
						<AuctionCard auction={auction} key={auction.id} />
					))}
				</Switch.Else>
			</Switch>
			{pagination}
		</Container>
	);
};
