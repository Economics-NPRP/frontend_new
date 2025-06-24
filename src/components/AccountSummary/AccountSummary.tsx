import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { CategoryBadge } from '@/components/Badge';
import { ICreateFirm } from '@/schema/models';
import { Avatar, Group, Stack, Table, TableProps } from '@mantine/core';

import classes from './styles.module.css';

export interface AccountSummaryProps extends TableProps {
	firmData: ICreateFirm;
}
export const AccountSummary = ({ firmData, className, ...props }: AccountSummaryProps) => {
	const t = useTranslations();

	const sectors = useMemo(
		() => firmData.sectors.map((sector) => <CategoryBadge key={sector} category={sector} />),
		[firmData.sectors],
	);

	return (
		<Stack className={`${classes.root} ${className}`}>
			<Avatar name={firmData.name} className={classes.avatar} color="initials" size="xl" />
			<Table
				variant="vertical"
				layout="fixed"
				withTableBorder
				className={classes.table}
				{...props}
			>
				<Table.Tbody>
					<Table.Tr>
						<Table.Th w={280}>{t('components.accountSummary.columns.name')}</Table.Th>
						<Table.Td>{firmData.name}</Table.Td>
					</Table.Tr>
					<Table.Tr>
						<Table.Th>{t('components.accountSummary.columns.crn')}</Table.Th>
						<Table.Td>1234567890</Table.Td>
					</Table.Tr>
					<Table.Tr>
						<Table.Th>{t('components.accountSummary.columns.iban')}</Table.Th>
						<Table.Td>1234567890</Table.Td>
					</Table.Tr>
					<Table.Tr>
						<Table.Th>{t('components.accountSummary.columns.sector')}</Table.Th>
						<Table.Td>
							<Group className={classes.sectors}>{sectors}</Group>
						</Table.Td>
					</Table.Tr>
					<Table.Tr>
						<Table.Th>{t('components.accountSummary.columns.fullName')}</Table.Th>
						<Table.Td>John Doe</Table.Td>
					</Table.Tr>
					<Table.Tr>
						<Table.Th>{t('components.accountSummary.columns.position')}</Table.Th>
						<Table.Td>Manager</Table.Td>
					</Table.Tr>
					<Table.Tr>
						<Table.Th>{t('components.accountSummary.columns.email')}</Table.Th>
						<Table.Td>{firmData.email}</Table.Td>
					</Table.Tr>
					<Table.Tr>
						<Table.Th>{t('components.accountSummary.columns.phone')}</Table.Th>
						<Table.Td>{firmData.phone}</Table.Td>
					</Table.Tr>
					<Table.Tr>
						<Table.Th>{t('components.accountSummary.columns.website')}</Table.Th>
						<Table.Td>testwebsite.com</Table.Td>
					</Table.Tr>
					<Table.Tr>
						<Table.Th>{t('components.accountSummary.columns.address')}</Table.Th>
						<Table.Td>Street 123, Doha, Qatar</Table.Td>
					</Table.Tr>
				</Table.Tbody>
			</Table>
		</Stack>
	);
};
