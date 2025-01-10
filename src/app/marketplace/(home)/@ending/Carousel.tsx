'use client';

import { EmblaCarouselType } from 'embla-carousel';
import { useLocale, useTranslations } from 'next-intl';
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import {
	IconArrowUpRight,
	IconChevronLeft,
	IconChevronRight,
	IconPointFilled,
} from '@tabler/icons-react';
import { useInfiniteQuery } from '@tanstack/react-query';

import { QUERY_PARAMS } from './constants';
import classes from './styles.module.css';

const TWEEN_FACTOR_BASE = 0.75;

export interface CarouselProps {}
export const AuctionCarousel = ({}: CarouselProps) => {
	const t = useTranslations();
	const locale = useLocale();
	const direction = getLangDir(locale);

	const { data, isError, isSuccess, isFetchingNextPage, hasNextPage, fetchNextPage } =
		useInfiniteQuery({
			queryKey: ['marketplace', '@ending'],
			queryFn: ({ pageParam }) => getPaginatedAuctions({ ...QUERY_PARAMS, page: pageParam }),
			initialPageParam: 1,
			getNextPageParam: (lastPage) =>
				lastPage.page + 1 > lastPage.pageCount ? undefined : lastPage.page + 1,
		});

	const [embla, setEmbla] = useState<EmblaCarouselType | null>(null);
	const [progress, setProgress] = useState<number>(0);
	const tweenFactor = useRef(0);

	const handlePrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
	const handleNext = useCallback(() => embla && embla.scrollNext(), [embla]);
	const handleUpdateProgress = useCallback(
		(embla: EmblaCarouselType) =>
			setProgress(Math.min(Math.max(embla.scrollProgress(), 0), 1) * 100),
		[embla, data],
	);

	//	Infinite scroll when end is reached
	const handleInfiniteScroll = useCallback(
		(embla: EmblaCarouselType) => {
			if (isFetchingNextPage || !hasNextPage) return;

			const loaderIndex = embla.slideNodes().length - 1;
			const loaderInView = embla.slidesInView().includes(loaderIndex);
			if (loaderInView) fetchNextPage();
		},
		[isFetchingNextPage, hasNextPage],
	);

	const setTweenFactor = useCallback((embla: EmblaCarouselType) => {
		tweenFactor.current = TWEEN_FACTOR_BASE * embla.scrollSnapList().length;
	}, []);
	const handleTweenOpacity = useCallback((embla: EmblaCarouselType) => {
		const engine = embla.internalEngine();
		const scrollProgress = embla.scrollProgress();

		embla.scrollSnapList().forEach((scrollSnap, snapIndex) => {
			const diffToTarget = scrollSnap - scrollProgress;
			const slidesInSnap = engine.slideRegistry[snapIndex];

			slidesInSnap.forEach((slideIndex) => {
				const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current);
				const opacity = Math.min(Math.max(tweenValue, 0.2), 1).toString();
				const scale = Math.min(Math.max(tweenValue * 0.5 + 0.75, 0.9), 1).toString();

				const element = embla.slideNodes()[slideIndex];
				const isLoader = element.classList.contains(classes.loader);
				const isVisible = embla.slidesInView().includes(slideIndex);

				if (isLoader && !isVisible) element.style.opacity = '0';
				else {
					embla.slideNodes()[slideIndex].style.opacity = opacity;
					embla.slideNodes()[slideIndex].style.transform = `scale(${scale})`;
				}
			});
		});
	}, []);

	//	Switch between LTR and RTL when the locale changes
	useEffect(() => embla?.reInit({ direction }), [direction]);
	useEffect(() => {
		if (!embla) return;

		setTweenFactor(embla);
		handleTweenOpacity(embla);
		const handleResize = () => embla.reInit();
		window.addEventListener('resize', handleResize);
		embla
			.on('reInit', setTweenFactor)
			.on('reInit', handleUpdateProgress)
			.on('reInit', handleTweenOpacity)
			.on('settle', handleInfiniteScroll)
			.on('scroll', handleUpdateProgress)
			.on('scroll', handleTweenOpacity)
			.on('slidesChanged', handleUpdateProgress)
			.on('slideFocus', handleTweenOpacity)
			.on('destroy', () => window.removeEventListener('resize', handleResize));
	}, [embla]);

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
						classNames={{
							root: classes.carousel,
							viewport: classes.viewport,
							indicators: classes.indicator,
						}}
						slidesToScroll={4}
						slideSize={'25%'}
						slideGap={'md'}
						align={'end'}
						withControls={false}
						getEmblaApi={setEmbla}
					>
						{auctions}
						{hasNextPage && (
							<CarouselSlide className={classes.loader}>
								<Loader color="maroon" />
							</CarouselSlide>
						)}
					</Carousel>
				)}
			</Group>
		</>
	);
};
