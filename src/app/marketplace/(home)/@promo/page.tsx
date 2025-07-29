import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

import { Button, Container, Mark, Stack, Text, Title, UnstyledButton } from '@mantine/core';
import { IconArrowUpRight } from '@tabler/icons-react';

import classes from './styles.module.css';
import PatternSvg from './topography.svg';

export default function Promo() {
	const t = useTranslations();

	return (
		<UnstyledButton
			component={Link}
			href="/marketplace/explore?ownership=private"
			className={classes.root}
		>
			<Stack className={classes.label}>
				<Title order={3} className={classes.title}>
					{t('marketplace.home.promo.title')}
				</Title>
				<Text className={classes.description}>
					{t.rich('marketplace.home.promo.description', {
						mark: (chunks) => <Mark className={classes.highlight}>{chunks}</Mark>,
					})}
				</Text>
			</Stack>
			<Button className={classes.button} rightSection={<IconArrowUpRight size={16} />}>
				{t('marketplace.home.promo.button.label')}
			</Button>

			<Container className={classes.bg}>
				<Container className={classes.image}>
					<Image
						src="/imgs/promo/privateAuctions.png"
						alt="Open notebook with pen on a dark textured surface"
						fill
					/>
				</Container>
				<PatternSvg className={classes.pattern} />
				<Container className={classes.gradient} />
			</Container>
		</UnstyledButton>
	);
}
