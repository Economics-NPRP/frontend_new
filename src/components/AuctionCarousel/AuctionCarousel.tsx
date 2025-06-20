'use client';

import { EmblaCarouselType } from 'embla-carousel';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getLangDir } from 'rtl-detect';

import { AuctionCard } from '@/components/AuctionCard';
import { Switch } from '@/components/SwitchCase';
import { IAuctionData } from '@/schema/models';
import { SortedOffsetPaginatedInfiniteContextState } from '@/types';
import { Carousel, CarouselSlide } from '@mantine/carousel';
import {
	ActionIcon,
	Button,
	Container,
	Group,
	Loader,
	Progress,
	Select,
	Stack,
	Text,
	Title,
	useMatches,
} from '@mantine/core';
import {
	IconArrowUpRight,
	IconChevronLeft,
	IconChevronRight,
	IconDatabaseOff,
	IconExclamationCircle,
	IconPointFilled,
} from '@tabler/icons-react';

import classes from './styles.module.css';

const TWEEN_FACTOR_BASE = 0.75;

export interface AuctionCarouselProps {
	infinitePaginatedAuctions: SortedOffsetPaginatedInfiniteContextState<IAuctionData>;
}
export const AuctionCarousel = ({ infinitePaginatedAuctions }: AuctionCarouselProps) => {
	const t = useTranslations();
	const locale = useLocale();
	const direction = getLangDir(locale);
	const containerRef = useRef<HTMLDivElement>(null);

	const draggable = useMatches({ base: true, md: false });
	const cardsPerScreen = useMatches({
		base: 1,
		sm: 2,
		md: 3,
		xl: 4,
	});

	const [embla, setEmbla] = useState<EmblaCarouselType | null>(null);
	const [progress, setProgress] = useState<number>(0);
	const tweenFactor = useRef(0);

	const handlePrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
	const handleNext = useCallback(() => embla && embla.scrollNext(), [embla]);
	const handleUpdateProgress = useCallback(
		(embla: EmblaCarouselType) =>
			setProgress(Math.min(Math.max(embla.scrollProgress(), 0), 1) * 100),
		[embla, infinitePaginatedAuctions.data],
	);

	//	Infinite scroll when end is reached
	const handleInfiniteScroll = useCallback(
		(embla: EmblaCarouselType) => {
			if (
				infinitePaginatedAuctions.isFetchingNextPage ||
				!infinitePaginatedAuctions.hasNextPage
			)
				return;

			const loaderIndex = embla.slideNodes().length - 1;
			const loaderInView = embla.slidesInView().includes(loaderIndex);
			if (loaderInView) infinitePaginatedAuctions.fetchNextPage();
		},
		[infinitePaginatedAuctions.isFetchingNextPage, infinitePaginatedAuctions.hasNextPage],
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

	const handleSetPointerEvents = useCallback(
		(embla: EmblaCarouselType) => {
			embla.slideNodes().forEach((element) => {
				if (!containerRef) return;

				const rect = element.getBoundingClientRect();
				const parentRect = containerRef.current!.getBoundingClientRect();
				const isVisible = rect.x < parentRect.right + 16 && rect.x >= parentRect.left - 16;

				if (isVisible) {
					element.style.pointerEvents = 'auto';
					element.inert = false;
				} else {
					element.style.pointerEvents = 'none';
					element.inert = true;
				}
			});
		},
		[containerRef],
	);

	const handleResize = useCallback(
		() => embla?.reInit({ direction, watchDrag: draggable }),
		[embla, direction, draggable],
	);

	//	Switch between LTR and RTL when the locale changes
	useEffect(handleResize, [direction, draggable]);
	useEffect(() => {
		if (!embla) return;

		setTweenFactor(embla);
		handleTweenOpacity(embla);
		handleResize();
		handleSetPointerEvents(embla);
		window.addEventListener('resize', handleResize);
		embla
			.on('reInit', setTweenFactor)
			.on('reInit', handleUpdateProgress)
			.on('reInit', handleTweenOpacity)
			.on('reInit', handleSetPointerEvents)
			.on('scroll', handleUpdateProgress)
			.on('scroll', handleTweenOpacity)
			.on('scroll', handleInfiniteScroll)
			.on('scroll', handleSetPointerEvents)
			.on('slidesChanged', handleUpdateProgress)
			.on('slideFocus', handleTweenOpacity)
			.on('destroy', () => window.removeEventListener('resize', handleResize));
	}, [
		embla,
		handleResize,
		handleTweenOpacity,
		handleUpdateProgress,
		handleInfiniteScroll,
		setTweenFactor,
		handleSetPointerEvents,
	]);

	const auctions = useMemo(() => {
		if (!infinitePaginatedAuctions.isSuccess) return [];

		return infinitePaginatedAuctions.data.pages.map((group) => (
			<Fragment key={group.page}>
				{group.results.map((auction) => (
					<CarouselSlide key={auction.id}>
						<AuctionCard auction={auction} />
					</CarouselSlide>
				))}
			</Fragment>
		));
	}, [infinitePaginatedAuctions.data]);

	const currentState = useMemo(() => {
		if (infinitePaginatedAuctions.isLoading) return 'loading';
		if (infinitePaginatedAuctions.isError) return 'error';
		if (
			infinitePaginatedAuctions.isSuccess &&
			infinitePaginatedAuctions.data.pages.length === 0
		)
			return 'empty';
	}, [infinitePaginatedAuctions.isLoading, infinitePaginatedAuctions.isError]);

	return (
		<Stack className={classes.root}>
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
						<Group className={classes.dots} visibleFrom="sm">
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
							component={Link}
							href="/marketplace/search"
							rightSection={<IconArrowUpRight size={16} />}
						>
							{t('constants.view.all.label')}
						</Button>
					</Group>
				</Group>
				<Progress
					classNames={{ root: classes.progress, section: classes.bar }}
					value={progress}
				/>
			</Stack>
			<Group className={classes.content}>
				<Switch value={currentState}>
					<Switch.Loading>
						<Stack className={classes.placeholder}>
							<Loader color="gray" />
							<Text className={classes.text}>{t('constants.loading.auctions')}</Text>
						</Stack>
					</Switch.Loading>
					<Switch.Error>
						<Stack className={classes.placeholder}>
							<Container className={classes.icon}>
								<IconExclamationCircle size={24} />
							</Container>
							<Text className={classes.text}>
								{t('components.auctionCarousel.error')}
							</Text>
						</Stack>
					</Switch.Error>
					<Switch.Case when="empty">
						<Stack className={classes.placeholder}>
							<Container className={classes.icon}>
								<IconDatabaseOff size={24} />
							</Container>
							<Text className={classes.text}>
								{t('components.auctionCarousel.empty')}
							</Text>
						</Stack>
					</Switch.Case>
					<Switch.Else>
						<Carousel
							classNames={{
								root: classes.carousel,
								viewport: classes.viewport,
								indicators: classes.indicator,
							}}
							slidesToScroll={cardsPerScreen}
							slideSize={`${100 / cardsPerScreen}%`}
							slideGap={'md'}
							align={'end'}
							withControls={false}
							getEmblaApi={setEmbla}
							ref={containerRef}
						>
							{auctions}
							{infinitePaginatedAuctions.hasNextPage && (
								<CarouselSlide className={classes.loader}>
									<Loader color="gray" />
								</CarouselSlide>
							)}
						</Carousel>
					</Switch.Else>
				</Switch>
			</Group>
		</Stack>
	);
};
