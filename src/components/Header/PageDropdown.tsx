import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import { Button, Menu, MenuDropdown, MenuItem, MenuLabel, MenuTarget } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';

import classes from './styles.module.css';

export interface PageDropdownProps {
	pageMatcher: (pathname: string) => string | null;
	pages: Array<{
		key: string;
		label: string;
		href: string;
		icon: React.ReactNode;
	}>;
}
export const PageDropdown = ({ pageMatcher, pages }: PageDropdownProps) => {
	const pathname = usePathname();

	const currentPage = useMemo(
		() => pages.find((page) => page.key === pageMatcher(pathname)) || pages[0],
		[pathname, pages],
	);

	const dropdownButton = useMemo(
		() => (
			<Button
				classNames={{
					root: `${classes.pages} ${classes.headerButton}`,
					label: classes.label,
				}}
				variant="transparent"
				size="xs"
				hiddenFrom="md"
				rightSection={<IconChevronDown size={14} />}
			>
				{currentPage.label}
			</Button>
		),
		[currentPage],
	);

	const pagesList = useMemo(
		() =>
			pages.map(({ key, label, href, icon }) => (
				<MenuItem
					key={key}
					component={Link}
					href={href}
					className={`${key === currentPage.key ? classes.active : ''} ${classes.item}`}
					leftSection={icon}
				>
					{label}
				</MenuItem>
			)),
		[pages],
	);

	return (
		<Menu width={320} offset={4} position="bottom-end">
			<MenuTarget>{dropdownButton}</MenuTarget>

			<MenuDropdown className={classes.userDropdown}>
				<MenuLabel>Admin Dashboard Pages</MenuLabel>
				{pagesList}
			</MenuDropdown>
		</Menu>
	);
};
