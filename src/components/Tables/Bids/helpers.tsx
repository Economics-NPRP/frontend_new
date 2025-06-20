import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';

import { BidsTableRow } from '@/components/Tables/Bids/Row';
import { BidsFilter } from '@/components/Tables/Bids/types';
import {
	IAllWinningBidsContext,
	IMyOpenAuctionResultsContext,
	IMyPaginatedBidsContext,
	IMyUserProfileContext,
	IPaginatedBidsContext,
	IPaginatedWinningBidsContext,
} from '@/contexts';
import { Group, Text } from '@mantine/core';
import { IconHexagonLetterC, IconHexagonLetterW, IconUserHexagon } from '@tabler/icons-react';

import classes from '../styles.module.css';

interface GenerateBidsRowsParams {
	bids: IPaginatedBidsContext;
	allWinningBids?: IAllWinningBidsContext;
	paginatedWinningBids?: IPaginatedWinningBidsContext;
	myPaginatedBids?: IMyPaginatedBidsContext;
	myOpenAuctionResults?: IMyOpenAuctionResultsContext;
	bidsFilter: BidsFilter;
	myUser: IMyUserProfileContext;
}
export const generateBidsRows = ({
	bids,
	allWinningBids,
	paginatedWinningBids,
	myPaginatedBids,
	myOpenAuctionResults,
	bidsFilter,
	myUser,
}: GenerateBidsRowsParams): Array<ReactElement> => {
	const contributingBidIds =
		myOpenAuctionResults?.data.contributingLosingBids.map(({ id }) => id) || [];
	const winningBidIds = allWinningBids?.data.results.map(({ id }) => id) || [];
	switch (bidsFilter) {
		case 'all':
			return bids.data.results.map((bid) => {
				const { id, bidder } = bid;

				return (
					<BidsTableRow
						bid={bid}
						key={id}
						isMine={bidder.id === myUser.data.id}
						isWinning={winningBidIds.includes(id)}
						isContributing={contributingBidIds.includes(id)}
					/>
				);
			});
		case 'winning':
			if (!paginatedWinningBids) return [];
			return paginatedWinningBids.data.results.map((bid) => {
				const { id, bidder } = bid;

				return (
					<BidsTableRow
						bid={bid}
						key={id}
						isMine={bidder.id === myUser.data.id}
						isWinning={false}
						isContributing={false}
					/>
				);
			});
		case 'mine':
			if (!myPaginatedBids) return [];
			return myPaginatedBids.data.results.map((bid) => {
				const { id } = bid;

				return (
					<BidsTableRow
						bid={bid}
						key={id}
						isMine={false}
						isWinning={winningBidIds.includes(id)}
						isContributing={contributingBidIds.includes(id)}
					/>
				);
			});
		case 'contributing':
			if (!myOpenAuctionResults) return [];
			return myOpenAuctionResults.data.contributingLosingBids.map((bid) => {
				const { id, bidder } = bid;

				return (
					<BidsTableRow
						bid={bid}
						key={id}
						isMine={bidder.id === myUser.data.id}
						isWinning={false}
						isContributing={false}
					/>
				);
			});
		default:
			return [];
	}
};

export const generateLegend = (
	t: ReturnType<typeof useTranslations>,
	bidsFilter: BidsFilter,
	showContributingBids?: boolean,
) => {
	switch (bidsFilter) {
		case 'all':
			return (
				<>
					<Group className={classes.cell}>
						<IconUserHexagon size={16} className={`${classes.icon} ${classes.mine}`} />
						<Text className={classes.value}>
							{/* @ts-expect-error - cant get typing from locale file */}
							{t('components.bidsTable.legend.mine.label')}
						</Text>
					</Group>
					{showContributingBids && (
						<Group className={classes.cell}>
							<IconHexagonLetterC
								size={16}
								className={`${classes.icon} ${classes.contributing}`}
							/>
							<Text className={classes.value}>
								{/* @ts-expect-error - cant get typing from locale file */}
								{t('components.bidsTable.legend.contributing.label')}
							</Text>
						</Group>
					)}
					<Group className={classes.cell}>
						<IconHexagonLetterW
							size={16}
							className={`${classes.icon} ${classes.winning}`}
						/>
						<Text className={classes.value}>
							{/* @ts-expect-error - cant get typing from locale file */}
							{t('components.bidsTable.legend.winning.label')}
						</Text>
					</Group>
				</>
			);
		case 'winning':
			return (
				<Group className={classes.cell}>
					<IconUserHexagon size={16} className={`${classes.icon} ${classes.mine}`} />
					<Text className={classes.value}>
						{/* @ts-expect-error - cant get typing from locale file */}
						{t('components.bidsTable.legend.mine.label')}
					</Text>
				</Group>
			);
		case 'mine':
			return (
				<>
					{showContributingBids && (
						<Group className={classes.cell}>
							<IconHexagonLetterC
								size={16}
								className={`${classes.icon} ${classes.contributing}`}
							/>
							<Text className={classes.value}>
								{/* @ts-expect-error - cant get typing from locale file */}
								{t('components.bidsTable.legend.contributing.label')}
							</Text>
						</Group>
					)}
					<Group className={classes.cell}>
						<IconHexagonLetterW
							size={16}
							className={`${classes.icon} ${classes.winning}`}
						/>
						<Text className={classes.value}>
							{/* @ts-expect-error - cant get typing from locale file */}
							{t('components.bidsTable.legend.winning.label')}
						</Text>
					</Group>
				</>
			);
		case 'contributing':
			return (
				<Group className={classes.cell}>
					<IconUserHexagon size={16} className={`${classes.icon} ${classes.mine}`} />
					<Text className={classes.value}>
						{/* @ts-expect-error - cant get typing from locale file */}
						{t('components.bidsTable.legend.mine.label')}
					</Text>
				</Group>
			);
		default:
			return null;
	}
};
