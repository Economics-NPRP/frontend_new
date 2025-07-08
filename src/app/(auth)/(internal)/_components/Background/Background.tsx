import Image from 'next/image';
import { useMemo } from 'react';

import { SectorList, SectorVariants } from '@/constants/SectorData';
import classes from '@/pages/(auth)/(internal)/styles.module.css';
import { Container } from '@mantine/core';

export const Background = () => {
	const images = useMemo(
		() =>
			[...SectorList]
				.sort(() => Math.random() - 0.5)
				.map((sector, imgIndex) => (
					<Image
						key={sector}
						src={SectorVariants[sector]!.image}
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
