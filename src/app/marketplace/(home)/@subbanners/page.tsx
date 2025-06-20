import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Container, Mark, Text, UnstyledButton } from '@mantine/core';
import { IconBellRinging, IconGavel, IconTrophy } from '@tabler/icons-react';

import classes from './styles.module.css';

export default function SubBanners() {
	const t = useTranslations();

	return (
		<>
			<UnstyledButton className={classes.root} component={Link} href="">
				<Container className={classes.bg}>
					<Container className={classes.graphic} />
					<Container className={classes.graphic} />
					<Container className={classes.graphic} />
					<Container className={classes.gradient} />
				</Container>

				<IconBellRinging size={20} />
				<Text className={classes.heading}>
					{t.rich('marketplace.home.subbanner.1.heading', {
						value: Math.round(Math.random() * 1000),
						mark: (chunks) => <Mark className={classes.highlight}>{chunks}</Mark>,
					})}
				</Text>
				<Text className={classes.text}>{t('marketplace.home.subbanner.1.text')}</Text>
			</UnstyledButton>
			<UnstyledButton className={classes.root} component={Link} href="">
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
			<UnstyledButton className={classes.root} component={Link} href="">
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
						value: Math.round(Math.random() * 100),
						mark: (chunks) => <Mark className={classes.highlight}>{chunks}</Mark>,
					})}
				</Text>
				<Text className={classes.text}>{t('marketplace.home.subbanner.3.text')}</Text>
			</UnstyledButton>
		</>
	);
}
