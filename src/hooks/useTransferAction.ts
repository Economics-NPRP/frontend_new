'use client';

import { useTranslations } from 'next-intl';

import { throwError, isolateMessage } from '@/helpers';
import { acceptPermits, rejectPermits } from '@/lib/bids/open';
import { ServerData } from '@/types';
import { notifications } from '@mantine/notifications';
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';

type TransferActionProps = (
  emissionId: number,
  auctionId: string,
  onSuccess?: () => void,
) => {
  accept: UseMutationResult<ServerData<{}>, Error, { firmId: string; quantity: number; notes: string }, unknown>;
  reject: UseMutationResult<ServerData<{}>, Error, { firmId: string; quantity: number; notes: string }, unknown>;
};

export const useTransferAction: TransferActionProps = (emissionId, auctionId, onSuccess) => {
  const t = useTranslations();
  const queryClient = useQueryClient();

  const accept = useMutation({
    mutationFn: ({ firmId, quantity, notes }: { firmId: string; quantity: number; notes: string }) =>
      throwError(acceptPermits(emissionId, auctionId, firmId, quantity, notes), `acceptPermits:${firmId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['marketplace', auctionId, 'paginatedWinningBids'],
      });
      notifications.show({
        color: 'green',
        title: t('lib.permits.accept.success.title'),
        message: t('lib.permits.accept.success.message'),
        position: 'bottom-center',
      });
      onSuccess?.();
    },
    onError: (error: Error) => {
      notifications.show({
        color: 'red',
        title: t('lib.permits.accept.error'),
        message: isolateMessage(error.message),
        position: 'bottom-center',
      });
    },
    retry: false,
  });

  const reject = useMutation({
    mutationFn: ({ firmId, quantity, notes }: { firmId: string; quantity: number; notes: string }) =>
      throwError(rejectPermits(emissionId, auctionId, firmId, quantity, notes), `rejectPermits:${firmId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['marketplace', auctionId, 'paginatedWinningBids'],
      });
      notifications.show({
        color: 'green',
        title: t('lib.permits.reject.success.title'),
        message: t('lib.permits.reject.success.message'),
        position: 'bottom-center',
      });
      onSuccess?.();
    },
    onError: (error: Error) => {
      notifications.show({
        color: 'red',
        title: t('lib.permits.reject.error'),
        message: isolateMessage(error.message),
        position: 'bottom-center',
      });
    },
    retry: false,
  });

  return { accept, reject };
};
