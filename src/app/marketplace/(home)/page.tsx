import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';

import { Countdown } from '@/components/Countdown';
import { ColorSchemesSwitcher } from '@/components/color-schemes-switcher';
import {
	ActionIcon,
	Button,
	ButtonGroup,
	Container,
	Mark,
	Text,
	Title,
	Tooltip,
	UnstyledButton,
} from '@mantine/core';
import {
	IconArrowUpRight,
	IconBellRinging,
	IconCalendarSearch,
	IconGavel,
	IconTrophy,
} from '@tabler/icons-react';

import classes from './styles.module.css';

export default function Home() {
	const t = useTranslations();

	return (
		<Container className={classes.root}>
			<Container className={`${classes.banner} bg-stagger-md md:bg-stagger-lg`}>
				<Container className={classes.bg}>
					<Container className={classes.gradient} />
					<Container className={classes.gradient} />
				</Container>

				<Text className={classes.subheading}>{t('marketplace.home.banner.subtitle')}</Text>
				<Title className={classes.heading} order={1}>
					{t('marketplace.home.banner.title')}
				</Title>

				<Countdown
					className={classes.countdown}
					targetDate={DateTime.fromObject({ year: 2024, month: 12, day: 31 }).toISO()!}
				/>

				<ButtonGroup className={classes.actions}>
					<Tooltip label={t('marketplace.home.banner.actions.calendar.tooltip')}>
						<ActionIcon className={classes.secondary} variant="outline">
							<IconCalendarSearch size={16} />
						</ActionIcon>
					</Tooltip>
					<Tooltip label={t('marketplace.home.banner.actions.explore.tooltip')}>
						<Button
							className={classes.primary}
							rightSection={<IconArrowUpRight size={16} />}
						>
							{t('marketplace.home.banner.actions.explore.text')}
						</Button>
					</Tooltip>
				</ButtonGroup>
			</Container>

			<UnstyledButton className={classes.subbanner} component="a" href="">
				<Container className={classes.bg}>
					<Container className={classes.graphic} />
					<Container className={classes.graphic} />
					<Container className={classes.graphic} />
					<Container className={classes.gradient} />
				</Container>

				<IconBellRinging size={20} />
				<Text className={classes.heading}>
					{t.rich('marketplace.home.subbanner.1.heading', {
						value: 54,
						mark: (chunks) => <Mark className={classes.highlight}>{chunks}</Mark>,
					})}
				</Text>
				<Text className={classes.text}>{t('marketplace.home.subbanner.1.text')}</Text>
			</UnstyledButton>
			<UnstyledButton className={classes.subbanner} component="a" href="">
				<Container className={classes.bg}>
					<Container className={`${classes.graphic} bg-grid-md`} />
					<Container className={classes.gradient} />
				</Container>

				<IconGavel size={20} />
				<Text className={classes.heading}>
					{t.rich('marketplace.home.subbanner.2.heading', {
						mark: (chunks) => <Mark className={classes.highlight}>{chunks}</Mark>,
					})}
				</Text>
				<Text className={classes.text}>{t('marketplace.home.subbanner.2.text')}</Text>
			</UnstyledButton>
			<UnstyledButton className={classes.subbanner} component="a" href="">
				<Container className={classes.bg}>
					<Container className={classes.graphic}>
						<svg width={'300'} height={'300'} style={{ overflow: 'visible' }}>
							<polygon
								points={'150,0 0,300 300,300'}
								fill={'none'}
								strokeWidth={'1.5'}
							/>
						</svg>
					</Container>
					<Container className={classes.graphic}>
						<svg width={'300'} height={'300'} style={{ overflow: 'visible' }}>
							<polygon
								points={'150,0 0,300 300,300'}
								fill={'none'}
								strokeWidth={'1.5'}
							/>
						</svg>
					</Container>
					<Container className={classes.gradient} />
				</Container>

				<IconTrophy size={20} />
				<Text className={classes.heading}>
					{t.rich('marketplace.home.subbanner.3.heading', {
						value: 3,
						mark: (chunks) => <Mark className={classes.highlight}>{chunks}</Mark>,
					})}
				</Text>
				<Text className={classes.text}>{t('marketplace.home.subbanner.3.text')}</Text>
			</UnstyledButton>

			<Title className="mt-20 text-center">
				Welcome to{' '}
				<Text
					inherit
					variant="gradient"
					component="span"
					gradient={{ from: 'pink', to: 'yellow' }}
				>
					Mantine
				</Text>{' '}
				+
				<Text
					inherit
					variant="gradient"
					component="span"
					gradient={{ from: 'blue', to: 'green' }}
				>
					TailwindCSS
				</Text>
			</Title>
			<Text
				className="mx-auto mt-xl max-w-[500px] text-center dark:text-gray-300"
				ta="center"
				maw={580}
				mx="auto"
				mt="xl"
			>
				This starter Next.js project includes a minimal setup for Mantine with TailwindCSS.
				To get started edit page.tsx file.
			</Text>

			<div className="mt-10 flex justify-center">
				<ColorSchemesSwitcher />
			</div>
		</Container>
	);
}
