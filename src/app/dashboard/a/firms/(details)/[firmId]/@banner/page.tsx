'use client';

import Image from 'next/image';
import { useContext, useMemo } from 'react';

import { Switch } from '@/components/SwitchCase';
import { SectorVariants } from '@/constants/SectorData';
import { SingleFirmContext } from '@/contexts';
import { SectorType } from '@/schema/models';
import { Avatar, Container } from '@mantine/core';
import { IconPhotoHexagon } from '@tabler/icons-react';

import classes from './styles.module.css';

export default function Banner() {
	const firm = useContext(SingleFirmContext);

	const bannerImageUrl = useMemo(() => {
		if (!firm.isSuccess) return null;

		const allImageUrls = firm.data.sectors
			.map((sector) => SectorVariants[sector.toLowerCase() as SectorType]?.image)
			.filter(Boolean);
		if (allImageUrls.length === 0) return null;

		const randomIndex = Math.floor(Math.random() * allImageUrls.length);
		return allImageUrls[randomIndex];
	}, [firm.isSuccess, firm.data.sectors]);

	return (
		<Container className={classes.root}>
			<Container className={classes.image}>
				<Switch value={bannerImageUrl === null}>
					<Switch.True>
						<Container className={classes.placeholder}>
							<IconPhotoHexagon size={48} />
						</Container>
					</Switch.True>
					<Switch.False>
						<Image src={bannerImageUrl!} alt="Banner image for the firm" fill />
					</Switch.False>
				</Switch>

				<Container className={classes.overlay} />
			</Container>
			<Container className={classes.container}>
				<Avatar
					className={classes.avatar}
					size={'xl'}
					name={firm.data.name}
					color="initials"
				/>
			</Container>
		</Container>
	);
}
