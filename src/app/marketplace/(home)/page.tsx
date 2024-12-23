import { useTranslations } from 'next-intl';

import { ColorSchemesSwitcher } from '@/components/color-schemes-switcher';
import { ActionIcon, Button, ButtonGroup, Container, Text, Title, Tooltip } from '@mantine/core';
import { IconArrowUpRight, IconCalendarSearch } from '@tabler/icons-react';

import classes from './styles.module.css';

export default function Home() {
	const t = useTranslations();

	return (
		<>
			<Container className={`${classes.banner} bg-stagger-lg`}>
				<Container className={classes.bg}>
					<Container className={classes.gradient} />
					<Container className={classes.gradient} />
				</Container>

				<Text className={classes.subheading}>{t('marketplace.home.banner.subtitle')}</Text>
				<Title className={classes.heading} order={1}>
					{t('marketplace.home.banner.title')}
				</Title>
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
		</>
	);
}
