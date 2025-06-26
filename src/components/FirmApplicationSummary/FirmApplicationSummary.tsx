import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { CategoryBadge } from '@/components/Badge';
import { IFirmApplication } from '@/schema/models';
import { Avatar, Group, Stack, Table, TableProps } from '@mantine/core';

import classes from './styles.module.css';

export interface FirmApplicationSummaryProps extends TableProps {
	firmData: IFirmApplication;
}
export const FirmApplicationSummary = ({
	firmData,
	className,
	...props
}: FirmApplicationSummaryProps) => {
	const t = useTranslations();

	const sectors = useMemo(
		() => firmData.sectors.map((sector) => <CategoryBadge key={sector} category={sector} />),
		[firmData.sectors],
	);

	return (
		<Stack className={`${classes.root} ${className}`}>
			<Avatar
				name={firmData.companyName}
				className={classes.avatar}
				color="initials"
				size="xl"
			/>
			<Table
				variant="vertical"
				layout="fixed"
				withTableBorder
				className={classes.table}
				{...props}
			>
				<Table.Tbody>
					<Table.Tr>
						<Table.Th w={280}>
							{t('components.firmApplicationSummary.columns.name')}
						</Table.Th>
						<Table.Td>{firmData.companyName}</Table.Td>
					</Table.Tr>
					<Table.Tr>
						<Table.Th>{t('components.firmApplicationSummary.columns.crn')}</Table.Th>
						<Table.Td>{firmData.crn}</Table.Td>
					</Table.Tr>
					<Table.Tr>
						<Table.Th>{t('components.firmApplicationSummary.columns.iban')}</Table.Th>
						<Table.Td>{firmData.iban}</Table.Td>
					</Table.Tr>
					<Table.Tr>
						<Table.Th>{t('components.firmApplicationSummary.columns.sector')}</Table.Th>
						<Table.Td>
							<Group className={classes.sectors}>{sectors}</Group>
						</Table.Td>
					</Table.Tr>
					<Table.Tr>
						<Table.Th>
							{t('components.firmApplicationSummary.columns.fullName')}
						</Table.Th>
						<Table.Td>{firmData.repName}</Table.Td>
					</Table.Tr>
					<Table.Tr>
						<Table.Th>
							{t('components.firmApplicationSummary.columns.position')}
						</Table.Th>
						<Table.Td>{firmData.repPosition}</Table.Td>
					</Table.Tr>
					<Table.Tr>
						<Table.Th>{t('components.firmApplicationSummary.columns.email')}</Table.Th>
						<Table.Td>{firmData.repEmail}</Table.Td>
					</Table.Tr>
					<Table.Tr>
						<Table.Th>{t('components.firmApplicationSummary.columns.phone')}</Table.Th>
						<Table.Td>{firmData.repPhone}</Table.Td>
					</Table.Tr>
					<Table.Tr>
						<Table.Th>
							{t('components.firmApplicationSummary.columns.website')}
						</Table.Th>
						<Table.Td>{firmData.websites[0]}</Table.Td>
					</Table.Tr>
					<Table.Tr>
						<Table.Th>
							{t('components.firmApplicationSummary.columns.address')}
						</Table.Th>
						<Table.Td>{firmData.address}</Table.Td>
					</Table.Tr>
				</Table.Tbody>
			</Table>
		</Stack>
	);
};
