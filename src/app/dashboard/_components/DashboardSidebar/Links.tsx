'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment, useMemo } from 'react';

import { SidebarLinks } from '@/pages/dashboard/_components/DashboardSidebar';
import { Button, Divider, Stack, Tooltip } from '@mantine/core';

import classes from './styles.module.css';

export const Links = () => {
	const t = useTranslations();
	const pathname = usePathname();

	const links = useMemo(() => {
		const dashboardType = pathname.includes('/dashboard/a') ? 'admin' : 'firm';
		const linkData = SidebarLinks[dashboardType](t);
		return linkData.map(({ id, label, tooltip, icon, href, subHrefs }) =>
			href ? (
				<Tooltip label={tooltip}>
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
				</Tooltip>
			) : (
				<Fragment key={id}>
					<Divider
						label={label}
						classNames={{
							root: classes.divider,
							label: classes.label,
						}}
					/>
					{subHrefs &&
						subHrefs.map(({ id: subId, label, tooltip, href, icon }) => (
							<Tooltip label={tooltip}>
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
							</Tooltip>
						))}
				</Fragment>
			),
		);
	}, [pathname, t]);

	return <Stack className={classes.links}>{links}</Stack>;
};
