import { ReactNode, useMemo } from 'react';

import { Stack, Table, TableProps, Title } from '@mantine/core';

import classes from './styles.module.css';

export interface SummaryTableGroup {
	title: ReactNode;
	rows: Array<{
		label: ReactNode;
		value: ReactNode;
		width?: number;
	}>;
}
export interface SummaryTableProps extends TableProps {
	groups: Array<SummaryTableGroup>;
}
export const SummaryTable = ({ groups, className, ...props }: SummaryTableProps) => {
	const groupElements = useMemo(
		() =>
			groups.map(({ title, rows }, index) => (
				<Stack className={classes.group} key={index}>
					<Title order={3} className={classes.title}>
						{title}
					</Title>
					<Table
						variant="vertical"
						layout="fixed"
						withTableBorder
						className={classes.table}
						{...props}
					>
						<Table.Tbody>
							{rows.map(({ label, value, width }, index) => (
								<Table.Tr key={index}>
									<Table.Th w={width}>{label}</Table.Th>
									<Table.Td>{value}</Table.Td>
								</Table.Tr>
							))}
						</Table.Tbody>
					</Table>
				</Stack>
			)),
		[groups],
	);

	return <Stack className={`${classes.root} ${className}`}>{groupElements}</Stack>;
};
