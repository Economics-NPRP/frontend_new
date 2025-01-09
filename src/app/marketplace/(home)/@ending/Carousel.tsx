'use client';

import { EmblaCarouselType } from 'embla-carousel';
import { useLocale, useTranslations } from 'next-intl';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { getLangDir } from 'rtl-detect';

import { AuctionCard } from '@/components/AuctionCard';
import { getPaginatedAuctions } from '@/lib/auctions';
import { Carousel, CarouselSlide } from '@mantine/carousel';
import {
	ActionIcon,
	Button,
	Group,
	Loader,
	Progress,
	Select,
	Stack,
	Text,
	Title,
} from '@mantine/core';
import { useInViewport } from '@mantine/hooks';
import {
	IconArrowUpRight,
	IconChevronLeft,
	IconChevronRight,
	IconPointFilled,
} from '@tabler/icons-react';
import { useInfiniteQuery } from '@tanstack/react-query';

import { QUERY_PARAMS } from './constants';
import classes from './styles.module.css';

export interface CarouselProps {}
export const AuctionCarousel = ({}: CarouselProps) => {
	const t = useTranslations();
	const locale = useLocale();
	const direction = getLangDir(locale);
	const { ref: loaderRef, inViewport: loaderVisible } = useInViewport();

	const { data, isError, isSuccess, isFetchingNextPage, hasNextPage, fetchNextPage } =
		useInfiniteQuery({
			queryKey: ['marketplace', '@ending'],
			queryFn: ({ pageParam }) => getPaginatedAuctions({ ...QUERY_PARAMS, page: pageParam }),
			initialPageParam: 1,
			getNextPageParam: (lastPage) =>
				lastPage.page + 1 > lastPage.pageCount ? undefined : lastPage.page + 1,
		});

	useEffect(() => {
		if (isFetchingNextPage || !loaderVisible) return;
		fetchNextPage();
	}, [loaderVisible]);

	const auctions = useMemo(() => {
		if (!isSuccess) return [];

		return data.pages.map((group) => (
			<Fragment key={group.page}>
				{group.results.map((auction) => (
					<CarouselSlide key={auction.id}>
						<AuctionCard auction={auction} fluid />
					</CarouselSlide>
				))}
			</Fragment>
		));
	}, [data]);

	const [embla, setEmbla] = useState<EmblaCarouselType | null>(null);
	const [progress, setProgress] = useState<number>(0);
	const handlePrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
	const handleNext = useCallback(() => embla && embla.scrollNext(), [embla]);
	const handleScroll = useCallback(
		(index: number) =>
			embla && setProgress((((index + 1) * 4) / embla.slideNodes().length) * 100),
		[embla, data],
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
				{isError && <Text className={classes.error}>Error loading auctions</Text>}
				{isSuccess && (
					<Carousel
						classNames={{ root: classes.carousel, indicators: classes.indicator }}
						slidesToScroll={4}
						slideSize={'25%'}
						slideGap={'md'}
						align={'end'}
						withControls={false}
						getEmblaApi={setEmbla}
						onSlideChange={handleScroll}
					>
						{auctions}
						{hasNextPage && (
							<CarouselSlide className={classes.loader} ref={loaderRef}>
								<Loader color="maroon" />
								<Text className={classes.text}>Loading...</Text>
							</CarouselSlide>
						)}
					</Carousel>
				)}
			</Group>
		</>
	);
};
