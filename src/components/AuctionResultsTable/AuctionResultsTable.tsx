'use client';

import { IPaginatedOpenAuctionResultsContext } from 'contexts/PaginatedOpenAuctionResults';
import { ISingleAuctionContext } from 'contexts/SingleAuction';
import { createFormatter, useFormatter } from 'next-intl';
import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';

import { CurrencyBadge } from '@/components/Badge';
import { Switch } from '@/components/SwitchCase';
import { MyUserContext } from '@/contexts';
import { IAuctionData, IUserData } from '@/schema/models';
import { IAuctionResultsData } from '@/types';
import {
	Anchor,
	Container,
	Divider,
	Group,
	Loader,
	Pagination,
	Select,
	Stack,
	Table,
	TableProps,
	Text,
	Title,
	Tooltip,
} from '@mantine/core';
import { IconArrowNarrowDown, IconDatabaseOff, IconUserHexagon } from '@tabler/icons-react';

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
	const tableContainerRef = useRef<HTMLDivElement>(null);
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

	//	Reset page when perPage changes
	useEffect(() => paginatedOpenAuctionResults.setPage(1), [paginatedOpenAuctionResults.perPage]);

	const handleChangePage = useCallback(
		(newPage: number) => {
			tableContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
			paginatedOpenAuctionResults.setPage(newPage);
		},
		[paginatedOpenAuctionResults],
	);

	const currentState = useMemo(() => {
		if (paginatedOpenAuctionResults.isLoading || auction.isLoading) return 'loading';
		if (!paginatedOpenAuctionResults || paginatedOpenAuctionResults.data.results.length === 0)
			return 'empty';
		return 'ok';
	}, [paginatedOpenAuctionResults, auction]);

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
								<IconUserHexagon size={16} />
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
			<Container className={classes.table} ref={tableContainerRef}>
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
				<Switch value={currentState}>
					<Switch.Loading>
						<Stack className={classes.placeholder}>
							<Loader color="gray" />
						</Stack>
					</Switch.Loading>
					<Switch.Case when="empty">
						<Stack className={classes.placeholder}>
							<Container className={classes.icon}>
								<IconDatabaseOff size={24} />
							</Container>
							<Text className={classes.text}>No bids found</Text>
						</Stack>
					</Switch.Case>
				</Switch>
			</Container>
			{paginatedOpenAuctionResults.isSuccess && (
				<Pagination
					className={classes.pagination}
					value={paginatedOpenAuctionResults.page}
					total={paginatedOpenAuctionResults.data.pageCount}
					siblings={2}
					boundaries={3}
					onChange={handleChangePage}
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
				className={`${firm.id === currentUser.id ? classes.mine : ''}`}
			>
				<Table.Td className={classes.firm}>
					<Anchor href={`/marketplace/company/${firm.id}`}>{firm.name}</Anchor>
					<Group className={classes.badges}>
						{firm.id === currentUser.id && (
							<Tooltip label="This is your result" position="top">
								<IconUserHexagon size={14} className={classes.mine} />
							</Tooltip>
						)}
					</Group>
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
					<CurrencyBadge className="mr-1" />
					{format.number(averagePricePerPermit, 'money')}
				</Table.Td>
				<Table.Td>
					<CurrencyBadge className="mr-1" />
					{format.number(finalBill, 'money')}
				</Table.Td>
			</Table.Tr>
		),
	);
