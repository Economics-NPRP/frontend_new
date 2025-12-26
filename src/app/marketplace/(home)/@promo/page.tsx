'use client'
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { Button, Container, Mark, Stack, Text, Title, UnstyledButton } from '@mantine/core';
import { IconArrowUpRight } from '@tabler/icons-react';

import classes from './styles.module.css';
import PatternSvg from './topography.svg';
import { useQueryState } from 'nuqs';
import { useWindowScroll } from '@mantine/hooks';

export default function Promo() {
	const t = useTranslations();
	const [ownership, setOwnership] = useQueryState('ownership')
	const [_, scrollTo] = useWindowScroll()

	const handleButtonClick = () => {
		scrollTo({ y: 0 })
		setOwnership(current => current === 'private' ? 'government' : 'private')
	}

	return (
		<UnstyledButton
			onClick={handleButtonClick}
			className={classes.root}
		>
			<Stack className={classes.label}>
				<Title order={3} className={classes.title}>
					{t(ownership === 'private' ? 'marketplace.home.promo.private.title' : 'marketplace.home.promo.government.title')}
				</Title>
				<Text className={classes.description}>
					{t.rich(ownership === 'private' ? 'marketplace.home.promo.private.description' : 'marketplace.home.promo.government.description', {
						mark: (chunks) => <Mark className={classes.highlight}>{chunks}</Mark>,
					})}
				</Text>
			</Stack>
			<Button className={classes.button} rightSection={<IconArrowUpRight size={16} />}>
				{t(ownership === 'private' ? 'marketplace.home.promo.private.button.label' : 'marketplace.home.promo.government.button.label')}
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
