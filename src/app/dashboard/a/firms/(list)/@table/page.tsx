'use client';

import { useContext, useEffect } from 'react';

import { PaginatedFirmsContext } from '@/contexts';

export default function Table() {
	const paginatedFirms = useContext(PaginatedFirmsContext);
	useEffect(() => console.log('paginatedFirms', paginatedFirms), [paginatedFirms]);
	return <></>;
}
