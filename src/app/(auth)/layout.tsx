import Image from 'next/image';
import { ReactNode } from 'react';

import { AuctionCategoryVariants } from '@/constants/AuctionCategory';
import { Container, Stack } from '@mantine/core';

import classes from './styles.module.css';

export interface AuthProps {
	children: ReactNode;
}
export default function Auth({ children }: AuthProps) {
	//	Generate random category image to show
	const imgIndex = Math.floor(Math.random() * Object.keys(AuctionCategoryVariants).length);
	const bgImg = Object.entries(AuctionCategoryVariants)[imgIndex][1].image;

	return (
		<Stack className={classes.root}>
			<Container className={classes.bg}>
				<Image src={bgImg} alt={'Image of a power plant'} fill />
				<Container className={classes.overlay} />
			</Container>
			<Stack className={classes.panel}>{children}</Stack>
		</Stack>
	);
}
