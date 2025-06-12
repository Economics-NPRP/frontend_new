'use client';

import { IPaginatedOpenAuctionResultsContext } from 'contexts/PaginatedOpenAuctionResults';
import { ISingleAuctionContext } from 'contexts/SingleAuction';
import { createFormatter, useFormatter } from 'next-intl';
import { useContext, useEffect, useMemo } from 'react';

import { CurrencyBadge } from '@/components/Badge';
import { MyUserContext } from '@/contexts';
import { IAuctionData, IUserData } from '@/schema/models';
import { IAuctionResultsData } from '@/types';
import {
	Anchor,
	Container,
	Divider,
	Group,
	Pagination,
	Select,
	Stack,
	Table,
	TableProps,
	Text,
	Title,
} from '@mantine/core';
import { IconArrowNarrowDown } from '@tabler/icons-react';

import classes from './styles.module.css';

export interface ResultsTableProps extends TableProps {
	paginatedOpenAuctionResults: IPaginatedOpenAuctionResultsContext;
	auction: ISingleAuctionContext;
}
export const ResultsTable = ({
	paginatedOpenAuctionResults,
	auction,
	className,
	...props
}: ResultsTableProps) => {
	// const t = useTranslations();
	const format = useFormatter();
	const myUser = useContext(MyUserContext);

	const resultsData = useMemo(() => {
		if (!paginatedOpenAuctionResults.data) return null;
		return generateResultsRows(
			paginatedOpenAuctionResults.data.results,
			auction.data,
			myUser.data,
			format,
		);
	}, [paginatedOpenAuctionResults.data.results, auction.data, myUser.data, format]);

	useEffect(() => paginatedOpenAuctionResults.setPage(1), [paginatedOpenAuctionResults.perPage]);

	return (
		<Stack className={`${classes.root} ${className}`}>
			<Stack className={classes.header}>
				<Group className={classes.row}>
					<Group className={classes.label}>
						<Title order={2} className={classes.title}>
							Results Table
						</Title>
						<Text className={classes.subtitle}>
							Showing{' '}
							{Math.min(
								paginatedOpenAuctionResults.perPage,
								paginatedOpenAuctionResults.data.totalCount,
							)}{' '}
							of {paginatedOpenAuctionResults.data.totalCount} results
						</Text>
					</Group>
					<Group className={classes.settings}>
						<Group className={classes.legend}>
							<Group className={classes.cell}>
								<Container className={`${classes.key} ${classes.mine}`} />
								<Text className={classes.value}>Your Results</Text>
							</Group>
						</Group>
						<Divider orientation="vertical" className={classes.divider} />
						<Text className={classes.label}>Per page:</Text>
						<Select
							className={classes.dropdown}
							w={80}
							value={paginatedOpenAuctionResults.perPage.toString()}
							data={['10', '20', '50', '100']}
							onChange={(value) =>
								paginatedOpenAuctionResults.setPerPage(Number(value))
							}
							allowDeselect={false}
						/>
					</Group>
				</Group>
			</Stack>
			<Table highlightOnHover {...props}>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Firm</Table.Th>
						<Table.Th>Total Bids</Table.Th>
						<Table.Th className="flex items-center justify-between">
							Winning Bids (% Won)
							<IconArrowNarrowDown size={14} />
						</Table.Th>
						<Table.Th>Permits Reserved (% Reserved)</Table.Th>
						<Table.Th>Avg Price/Permit</Table.Th>
						<Table.Th>Final Bill</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>{resultsData}</Table.Tbody>
			</Table>
			{paginatedOpenAuctionResults.isSuccess && (
				<Pagination
					className={classes.pagination}
					value={paginatedOpenAuctionResults.page}
					total={paginatedOpenAuctionResults.data.pageCount}
					siblings={2}
					boundaries={3}
					onChange={paginatedOpenAuctionResults.setPage}
				/>
			)}
		</Stack>
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
			<Table.Tr
				key={`${firm.id}-${finalBill}`}
				className={firm.id === currentUser.id ? 'bg-gray-50' : ''}
			>
				<Table.Td>
					<Anchor href={`/marketplace/company/${firm.id}`}>{firm.name}</Anchor>
				</Table.Td>
				<Table.Td>{format.number(totalBidsCount)}</Table.Td>
				<Table.Td>
					{format.number(winningBidsCount)} (
					{format.number((winningBidsCount / totalBidsCount) * 100, 'money')}%)
				</Table.Td>
				<Table.Td>
					{format.number(permitsReserved)} (
					{format.number((permitsReserved / auctionData.permits) * 100, 'money')}%)
				</Table.Td>
				<Table.Td>
					<CurrencyBadge />
					{format.number(averagePricePerPermit, 'money')}
				</Table.Td>
				<Table.Td>
					<CurrencyBadge />
					{format.number(finalBill, 'money')}
				</Table.Td>
			</Table.Tr>
		),
	);
