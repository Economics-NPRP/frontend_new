'use client';

import { IPaginatedOpenAuctionResultsContext } from 'contexts/PaginatedOpenAuctionResults';
import { ISingleAuctionContext } from 'contexts/SingleAuction';
import { createFormatter, useFormatter, useTranslations } from 'next-intl';
import { useContext, useEffect, useMemo } from 'react';

import { CurrencyBadge } from '@/components/Badge';
import { CurrentUserContext } from '@/pages/globalContext';
import { IAuctionData, IUserData } from '@/schema/models';
import { IAuctionResultsData } from '@/types';
import {
	Anchor,
	Pagination,
	Table,
	TableProps,
	TableTbody,
	TableTd,
	TableTh,
	TableThead,
	TableTr,
} from '@mantine/core';
import { IconArrowNarrowDown } from '@tabler/icons-react';

export interface ResultsTableProps extends TableProps {
	paginatedOpenAuctionResults: IPaginatedOpenAuctionResultsContext;
	auction: ISingleAuctionContext;
}
export const ResultsTable = ({
	paginatedOpenAuctionResults,
	auction,
	...props
}: ResultsTableProps) => {
	const t = useTranslations();
	const format = useFormatter();
	const { currentUser } = useContext(CurrentUserContext);

	const resultsData = useMemo(() => {
		if (!paginatedOpenAuctionResults.data) return null;
		return generateResultsRows(
			paginatedOpenAuctionResults.data.results,
			auction.data,
			currentUser,
			format,
		);
	}, [paginatedOpenAuctionResults.data.results, auction.data, currentUser, format]);

	useEffect(() => paginatedOpenAuctionResults.setPage(1), [paginatedOpenAuctionResults.perPage]);

	return (
		<>
			<Table highlightOnHover {...props}>
				<TableThead>
					<TableTr>
						<TableTh>Firm</TableTh>
						<TableTh>Total Bids</TableTh>
						<TableTh className="flex items-center justify-between">
							Winning Bids (% Won)
							<IconArrowNarrowDown size={14} />
						</TableTh>
						<TableTh>Permits Reserved (% Reserved)</TableTh>
						<TableTh>Avg Price/Permit</TableTh>
						<TableTh>Final Bill</TableTh>
					</TableTr>
				</TableThead>
				<TableTbody>{resultsData}</TableTbody>
			</Table>
			{paginatedOpenAuctionResults.isSuccess && (
				<Pagination
					value={paginatedOpenAuctionResults.page}
					total={paginatedOpenAuctionResults.data.pageCount}
					siblings={2}
					boundaries={3}
					onChange={paginatedOpenAuctionResults.setPage}
				/>
			)}
		</>
	);
};

const generateResultsRows = (
	resultsData: Array<IAuctionResultsData>,
	auctionData: IAuctionData,
	currentUser: IUserData,
	format: ReturnType<typeof createFormatter>,
) =>
	resultsData.map(
		({
			firm,
			totalBidsCount,
			winningBidsCount,
			permitsReserved,
			averagePricePerPermit,
			finalBill,
		}) => (
			<TableTr
				key={`${firm.id}-${finalBill}`}
				className={firm.id === currentUser.id ? 'bg-gray-50' : ''}
			>
				<TableTd>
					<Anchor href={`/marketplace/company/${firm.id}`}>{firm.name}</Anchor>
				</TableTd>
				<TableTd>{format.number(totalBidsCount)}</TableTd>
				<TableTd>
					{format.number(winningBidsCount)} (
					{format.number((winningBidsCount / totalBidsCount) * 100, 'money')}%)
				</TableTd>
				<TableTd>
					{format.number(permitsReserved)} (
					{format.number((permitsReserved / auctionData.permits) * 100, 'money')}%)
				</TableTd>
				<TableTd>
					<CurrencyBadge />
					{format.number(averagePricePerPermit, 'money')}
				</TableTd>
				<TableTd>
					<CurrencyBadge />
					{format.number(finalBill, 'money')}
				</TableTd>
			</TableTr>
		),
	);
