import Image from 'next/image';
import { ReactNode, useMemo } from 'react';

import { AuctionCategoryVariants } from '@/constants/AuctionCategory';
import classes from '@/pages/(auth)/styles.module.css';
import { Container, Stack } from '@mantine/core';

export interface AuthProps {
	children: ReactNode;
}
export default function Auth({ children }: AuthProps) {
	//	Generate random category image to show
	const bgImg = useMemo(() => {
		const imgIndex = Math.floor(Math.random() * Object.keys(AuctionCategoryVariants).length);
		return Object.entries(AuctionCategoryVariants)[imgIndex][1].image;
	}, []);

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
