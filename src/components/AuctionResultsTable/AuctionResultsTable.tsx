'use client';

import { createFormatter, useFormatter, useTranslations } from 'next-intl';
import { useContext, useMemo } from 'react';

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

export interface ResultsTableProps extends TableProps {
	tableData: Array<IAuctionResultsData>;
	auctionData: IAuctionData;
	paginationType: 'offset' | 'keyset';
	page?: number;
	pageCount?: number;
	setPage?: (page: number) => void;
}
export const ResultsTable = ({
	tableData,
	auctionData,
	paginationType,
	page,
	pageCount,
	setPage,
	...props
}: ResultsTableProps) => {
	const t = useTranslations();
	const format = useFormatter();
	const { currentUser } = useContext(CurrentUserContext);

	const resultsData = useMemo(() => {
		if (!tableData) return null;
		return generateResultsRows(tableData, auctionData, currentUser, format);
	}, [tableData, auctionData, currentUser, format]);

	return (
		<>
			<Table highlightOnHover {...props}>
				<TableThead>
					<TableTr>
						<TableTh>Firm</TableTh>
						<TableTh>Total Bids</TableTh>
						<TableTh>Winning Bids (% Won)</TableTh>
						<TableTh>Permits Reserved (% Reserved)</TableTh>
						<TableTh>Avg Price/Permit</TableTh>
						<TableTh>Final Bill</TableTh>
					</TableTr>
				</TableThead>
				<TableTbody>{resultsData}</TableTbody>
			</Table>
			{paginationType === 'offset' && page && pageCount && pageCount > 1 && setPage && (
				<Pagination
					value={page}
					total={pageCount}
					siblings={2}
					boundaries={3}
					onChange={setPage}
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
