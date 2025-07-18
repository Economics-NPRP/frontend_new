import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useMemo } from 'react';

import { ActionIcon, Anchor, BoxProps, Divider, Group, Stack, Text } from '@mantine/core';
import { IconBox, IconBrandLinkedinFilled, IconBrandX } from '@tabler/icons-react';

import classes from './styles.module.css';

export interface FooterProps extends BoxProps {}
export const Footer = ({ className, ...props }: FooterProps) => {
	const t = useTranslations();

	const copyrightYear = useMemo(
		() =>
			DateTime.now().diff(DateTime.fromObject({ year: 2025 })).years > 0
				? `2025 - ${DateTime.now().year}`
				: '2025',
		[],
	);

	return (
		<Stack className={`${classes.root} ${className}`} {...props}>
			<Group className={classes.content}>
				<Stack className={classes.main}>
					<Group className={classes.logo}>
						<IconBox size={20} className={classes.icon} />
						<Text className={classes.title}>ETS</Text>
					</Group>
					<Text className={classes.slogan}>{t('components.footer.slogan')}</Text>
				</Stack>
				<Stack className={`${classes.wide} ${classes.column}`}>
					<Text className={classes.title}>{t('constants.actions.contactUs.label')}</Text>
					<Group className={classes.row}>
						<Text className={classes.text}>
							{t('components.footer.contact.phone.text')}
						</Text>
						<Anchor className={classes.link} component={Link} href="tel:+97444001234">
							{t('components.footer.contact.phone.link')}
						</Anchor>
					</Group>
					<Group className={classes.row}>
						<Text className={classes.text}>
							{t('components.footer.contact.email.text')}
						</Text>
						<Anchor className={classes.link} component={Link} href="mailto:help@ets.qa">
							{t('components.footer.contact.email.link')}
						</Anchor>
					</Group>
					<Text className={classes.text}>{t('components.footer.contact.address')}</Text>
				</Stack>
				<Stack className={classes.column}>
					<Text className={classes.title}>{t('components.footer.pages.title')}</Text>
					<Anchor className={classes.link} component={Link} href="/login">
						{t('components.footer.pages.auth')}
					</Anchor>
					<Anchor className={classes.link} component={Link} href="/marketplace">
						{t('components.footer.pages.marketplace')}
					</Anchor>
					<Anchor className={classes.link} component={Link} href="/dashboard">
						{t('components.footer.pages.dashboard')}
					</Anchor>
				</Stack>
				<Stack className={classes.column}>
					<Text className={classes.title}>{t('components.footer.legal.title')}</Text>
					<Anchor className={classes.link} component={Link} href="/tos">
						{t('components.footer.legal.auth')}
					</Anchor>
					<Anchor className={classes.link} component={Link} href="/privacy">
						{t('components.footer.legal.privacy')}
					</Anchor>
				</Stack>
			</Group>
			<Divider className={classes.divider} />
			<Group className={classes.footer}>
				<Text className={classes.copyright}>
					{t('components.footer.copyright', { year: copyrightYear })}
				</Text>
				{/* TODO: add proper social links once available */}
				<Group className={classes.socials}>
					<ActionIcon
						className={classes.button}
						variant="subtle"
						component={Link}
						href="https://ecodesign.global/"
						target="_blank"
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 688 520"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M204.954 0C304.344 78.1891 321.554 222.175 243.394 321.602L87.4304 520C-11.9599 441.811 -29.17 297.825 48.9905 198.398L204.954 0Z"
								fill="currentColor"
							/>
							<path
								d="M688 171.892C588.61 93.7028 444.676 110.919 366.516 210.346L210.553 408.744C309.943 486.933 453.876 469.717 532.037 370.29L688 171.892Z"
								fill="currentColor"
							/>
						</svg>
					</ActionIcon>
					<ActionIcon
						className={classes.button}
						variant="subtle"
						component={Link}
						href="https://www.linkedin.com/"
						target="_blank"
					>
						<IconBrandLinkedinFilled size={16} />
					</ActionIcon>
					<ActionIcon
						className={classes.button}
						variant="subtle"
						component={Link}
						href="https://x.com/"
						target="_blank"
					>
						<IconBrandX size={16} />
					</ActionIcon>
				</Group>
			</Group>
		</Stack>
	);
};
