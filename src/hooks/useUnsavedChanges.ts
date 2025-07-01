'use client';

import { useCallback } from 'react';

import { useWindowEvent } from '@mantine/hooks';

export const useUnsavedChanges = (isDirty: boolean) => {
	const handler = useCallback(
		(e: BeforeUnloadEvent) => {
			if (!isDirty) return;
			e.preventDefault();
			e.returnValue = '';
		},
		[isDirty],
	);

	useWindowEvent('beforeunload', handler);
};
