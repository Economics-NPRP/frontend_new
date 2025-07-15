'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import { SidebarLinks } from '@/pages/dashboard/_components/DashboardSidebar';
import { Accordion, Button } from '@mantine/core';

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
				<Accordion.Item value={id} key={id} className={classes.item}>
					<Accordion.Control
						classNames={{
							// control: `${classes.link} ${subHrefs?.map(({ href }) => href).includes(pathname) ? classes.active : ''}`,
							control: classes.link,
							chevron: classes.chevron,
							icon: classes.icon,
							label: classes.label,
						}}
						variant="subtle"
						icon={icon}
					>
						{label}
					</Accordion.Control>
					<Accordion.Panel
						classNames={{ panel: classes.panel, content: classes.content }}
					>
						{subHrefs &&
							subHrefs.map(({ id, label, href }) => (
								<Button
									classNames={{
										root: `${classes.sublink} ${pathname === href ? classes.active : ''}`,
										inner: classes.inner,
										section: classes.section,
										label: classes.label,
									}}
									component={Link}
									href={href}
									variant="subtle"
									key={id}
								>
									{label}
								</Button>
							))}
					</Accordion.Panel>
				</Accordion.Item>
			),
		);
	}, [pathname, t]);

	return (
		<Accordion className={classes.links} variant="filled" multiple>
			{links}
		</Accordion>
	);
};
