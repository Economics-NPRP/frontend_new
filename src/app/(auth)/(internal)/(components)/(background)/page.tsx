import Image from 'next/image';
import { useMemo } from 'react';

import { AuctionCategoryVariants } from '@/constants/AuctionCategory';
import classes from '@/pages/(auth)/styles.module.css';
import { Container } from '@mantine/core';

export default function Background() {
	//	Generate random category image to show
	const bgImg = useMemo(() => {
		const imgIndex = Math.floor(Math.random() * Object.keys(AuctionCategoryVariants).length);
		return Object.entries(AuctionCategoryVariants)[imgIndex][1].image;
	}, []);

	return (
		<Container className={classes.bg}>
			<Image
				src={bgImg}
				alt={
					'Background image showing one of the different emission sectors available in ETS'
				}
				fill
			/>
			<Container className={classes.overlay} />
		</Container>
	);
}
