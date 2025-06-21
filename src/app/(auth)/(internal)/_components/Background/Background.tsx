import Image from 'next/image';
import { useMemo } from 'react';

import { AuctionCategoryList, AuctionCategoryVariants } from '@/constants/AuctionCategory';
import classes from '@/pages/(auth)/(internal)/styles.module.css';
import { Container } from '@mantine/core';

export const Background = () => {
	const images = useMemo(
		() =>
			AuctionCategoryList.sort(() => Math.random() - 0.5).map((category, imgIndex) => (
				<Image
					src={AuctionCategoryVariants[category]!.image}
					alt={
						'Background image showing one of the different emission sectors available in ETS'
					}
					style={{ animationDelay: `${66 - (imgIndex + 1) * 11}s` }}
					fill
				/>
			)),
		[],
	);

	return (
		<Container className={classes.bg}>
			{images}
			<Container className={classes.overlay} />
		</Container>
	);
};
