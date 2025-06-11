'use client';

import { Details } from '@/pages/marketplace/auction/[auctionId]/results/@details/Details';
import { Properties } from '@/pages/marketplace/auction/[auctionId]/results/@details/Properties';
import { Statistics } from '@/pages/marketplace/auction/[auctionId]/results/@details/Statistics';
import { Group } from '@mantine/core';

import classes from './styles.module.css';

export default function AuctionDetails() {
	return (
		<Group className={classes.root}>
			<Details />
			<Properties />
			<Statistics />
		</Group>
	);
}
