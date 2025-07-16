'use client';

import { RefObject, useCallback } from 'react';

import classes from '@/components/Tables/styles.module.css';
import { OffsetPaginatedContextState } from '@/types';
import { Pagination, PaginationProps, useMatches } from '@mantine/core';

export interface TablePaginationProps extends Omit<PaginationProps, 'value' | 'total'> {
	context: OffsetPaginatedContextState<any>;
	tableContainerRef?: RefObject<HTMLTableElement | HTMLDivElement>;
}
export const TablePagination = ({
	context,
	tableContainerRef,
	className,
	onChange,
	...props
}: TablePaginationProps) => {
	const siblings = useMatches({ base: 0, sm: 1, md: 2 });
	const boundaries = useMatches({ base: 1, md: 2, lg: 3 });

	const handleChangePage = useCallback(
		(newPage: number) => {
			if (tableContainerRef && tableContainerRef.current)
				tableContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
			context.setPage(newPage);
			onChange?.(newPage);
		},
		[context, tableContainerRef],
	);

	return (
		<Pagination
			className={`${classes.pagination} ${className}`}
			value={context.page}
			total={context.data.pageCount}
			siblings={siblings}
			boundaries={boundaries}
			onChange={handleChangePage}
			{...props}
		/>
	);
};
