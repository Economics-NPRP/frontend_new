'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import { SidebarLinks } from '@/pages/dashboard/_components/DashboardSidebar';
import { Button, Divider, Stack } from '@mantine/core';

import classes from './styles.module.css';

export const Links = () => {
	const t = useTranslations();
	const pathname = usePathname();

	const links = useMemo(() => {
		const dashboardType = pathname.includes('/dashboard/a') ? 'admin' : 'firm';
		const linkData = SidebarLinks[dashboardType](t);
		return linkData.map(({ id, label, icon, href, subHrefs }) =>
			href ? (
				<Button
					classNames={{
						root: `${classes.link} ${pathname === href ? classes.active : ''}`,
						inner: classes.inner,
						section: classes.section,
						label: classes.label,
					}}
					key={id}
					component={Link}
					href={href}
					variant="subtle"
					leftSection={icon}
				>
					{label}
				</Button>
			) : (
				<>
					<Divider
						key={`${id}-divider`}
						label={label}
						classNames={{
							root: classes.divider,
							label: classes.label,
						}}
					/>
					{subHrefs &&
						subHrefs.map(({ id: subId, label, href, icon }) => (
							<Button
								classNames={{
									root: `${classes.link} ${pathname === href ? classes.active : ''}`,
									inner: classes.inner,
									section: classes.section,
									label: classes.label,
								}}
								key={`${id}.${subId}`}
								component={Link}
								href={href}
								variant="subtle"
								leftSection={icon}
							>
								{label}
							</Button>
						))}
				</>
			),
		);
	}, [pathname, t]);

	return <Stack className={classes.links}>{links}</Stack>;
};
