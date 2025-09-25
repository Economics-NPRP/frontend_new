'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

import { throwError } from '@/helpers';
import { createAuction } from '@/lib/auctions';
import { ICreateAuctionOutput } from '@/schema/models';
import { ServerData } from '@/types';
import { notifications } from '@mantine/notifications';
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';

type CreateAuctionProps = (options?: {
	onSettled?: () => void;
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}) => UseMutationResult<ServerData<{}>, Error, ICreateAuctionOutput, unknown>;
export const useCreateAuction: CreateAuctionProps = ({ onSettled, onSuccess, onError } = {}) => {
	const t = useTranslations();
	const searchParams = useSearchParams();
	const queryClient = useQueryClient();

	const cycleId = useMemo(() => searchParams.get('cycleId'), [searchParams]);

	return useMutation({
		mutationFn: (formData) => throwError(createAuction(formData), `createAuction:${cycleId}`),
		onSettled,
		onSuccess: () => {
			if (cycleId)
				queryClient.invalidateQueries({
					queryKey: ['dashboard', 'admin', cycleId as string, 'paginatedAuctionsInCycle'],
				});
			queryClient.invalidateQueries({
				queryKey: ['marketplace', 'paginatedAuctions'],
			});
			notifications.show({
				color: 'green',
				title: t('lib.auctions.create.success.title'),
				message: t('lib.auctions.create.success.message'),
				position: 'bottom-center',
			});
			onSuccess?.();
		},
		onError: (error: Error) => {
			let message = error.message;
			// Pattern 1 (new): Backend composite message listing both or one violation
			// Example: "Auction start 2025-09-25T21:00:00+00:00 is before cycle start 2025-09-26T16:20:42+00:00; auction end 2025-09-28T21:00:00+00:00 is after cycle end 2025-09-29T21:00:00+00:00"
			const startBeforeRegex = /auction start\s+(\S+)\s+is before cycle start\s+(\S+)/i;
			const endAfterRegex = /auction end\s+(\S+)\s+is after cycle end\s+(\S+)/i;
			const startBefore = message.match(startBeforeRegex);
			const endAfter = message.match(endAfterRegex);

			// Pattern 2 (legacy): "Auction schedule (start=..., end=...) lies outside cycle window (start=..., end=...)."
			const legacyRegex =
				/Auction schedule \(start=([^,]+), end=([^\)]+)\) lies outside cycle window \(start=([^,]+), end=([^\)]+)\)\./;
			const legacyMatch = message.match(legacyRegex);

			if (startBefore || endAfter || legacyMatch) {
				let parts: string[] = [];
				if (startBefore) {
					const [, aStart, cStart] = startBefore;
					parts.push(
						t('lib.auctions.create.outOfCycleBounds', {
							auctionStart: aStart,
							auctionEnd: '-',
							cycleStart: cStart,
							cycleEnd: '-',
						}),
					);
				}
				if (endAfter) {
					const [, aEnd, cEnd] = endAfter;
					parts.push(
						t('lib.auctions.create.outOfCycleBounds', {
							auctionStart: '-',
							auctionEnd: aEnd,
							cycleStart: '-',
							cycleEnd: cEnd,
						}),
					);
				}
				if (!startBefore && !endAfter && legacyMatch) {
					const [, aStart, aEnd, cStart, cEnd] = legacyMatch;
					parts = [
						t('lib.auctions.create.outOfCycleBounds', {
							auctionStart: aStart,
							auctionEnd: aEnd,
							cycleStart: cStart,
							cycleEnd: cEnd,
						}),
					];
				}
				message = parts.join('\n');
			}
			console.error('Error creating a new auction:', message);
			notifications.show({
				color: 'red',
				title: t('lib.auctions.create.error'),
				message,
				position: 'bottom-center',
			});
			onError?.(new Error(message));
		},
		retry: false,
	});
};
