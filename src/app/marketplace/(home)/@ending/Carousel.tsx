'use client';

import { EmblaCarouselType } from 'embla-carousel';
import { useLocale, useTranslations } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';
import { getLangDir } from 'rtl-detect';

import { AuctionCard } from '@/components/AuctionCard';
import { IAuctionData } from '@/schema/models';
import { Carousel, CarouselSlide } from '@mantine/carousel';
import { ActionIcon, Button, Group, Progress, Select, Stack, Text, Title } from '@mantine/core';
import {
	IconArrowUpRight,
	IconChevronLeft,
	IconChevronRight,
	IconPointFilled,
} from '@tabler/icons-react';

import classes from './styles.module.css';

export interface CarouselProps {
	results: Array<IAuctionData>;
}
export const AuctionCarousel = ({ results }: CarouselProps) => {
	const t = useTranslations();
	const locale = useLocale();
	const direction = getLangDir(locale);

	const [embla, setEmbla] = useState<EmblaCarouselType | null>(null);
	const [progress, setProgress] = useState<number>(1);
	const handlePrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
	const handleNext = useCallback(() => embla && embla.scrollNext(), [embla]);
	const handleScroll = useCallback(
		(index: number) => setProgress((((index + 1) * 4) / results.length) * 100),
		[results],
	);

	//	Switch between LTR and RTL when the locale changes
	useEffect(() => embla?.reInit({ direction }), [embla, direction]);

	return (
		<>
			<Stack className={classes.header}>
				<Group className={classes.top}>
					<Group className={classes.left}>
						<Stack className={classes.label}>
							<Title className={classes.heading}>
								{t('marketplace.home.ending.heading')}
							</Title>
							<Text className={classes.subheading}>
								{t('marketplace.home.ending.subheading')}
							</Text>
						</Stack>
						<Group className={classes.dots}>
							<IconPointFilled size={12} />
							<IconPointFilled size={12} />
							<IconPointFilled size={12} />
							<IconPointFilled size={12} />
							<IconPointFilled size={12} />
						</Group>
					</Group>
					<Group className={classes.right}>
						<Select
							className={classes.dropdown}
							placeholder={t('marketplace.home.ending.filter.prompt')}
							data={[
								t('constants.auctionCategory.energy.title'),
								t('constants.auctionCategory.industry.title'),
								t('constants.auctionCategory.transport.title'),
								t('constants.auctionCategory.buildings.title'),
								t('constants.auctionCategory.agriculture.title'),
								t('constants.auctionCategory.waste.title'),
							]}
						/>
						<ActionIcon
							className={`${classes.action} ${classes.square}`}
							onClick={handlePrev}
						>
							<IconChevronLeft size={20} />
						</ActionIcon>
						<ActionIcon
							className={`${classes.action} ${classes.square}`}
							onClick={handleNext}
						>
							<IconChevronRight size={20} />
						</ActionIcon>
						<Button
							className={classes.action}
							component="a"
							href="/marketplace/search"
							rightSection={<IconArrowUpRight size={16} />}
						>
							View All
						</Button>
					</Group>
				</Group>
				<Progress
					classNames={{ root: classes.progress, section: classes.bar }}
					value={progress}
				/>
			</Stack>
			<Group className={classes.content}>
				<Carousel
					classNames={{ root: classes.carousel, indicators: classes.indicator }}
					slidesToScroll={4}
					slideSize={'25%'}
					slideGap={'md'}
					align={'start'}
					withControls={false}
					getEmblaApi={setEmbla}
					onSlideChange={handleScroll}
				>
					{results.map((auction) => (
						<CarouselSlide key={auction.id}>
							<AuctionCard auction={auction} fluid />
						</CarouselSlide>
					))}
				</Carousel>
			</Group>
		</>
	);
};
