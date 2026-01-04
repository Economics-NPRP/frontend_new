'use client';
import { useTranslations } from 'next-intl';

import { throwError, isolateMessage } from '@/helpers';
import { acceptPermitTransfer } from '@/lib/bids/open';
import { ServerData } from '@/types';
import { notifications } from '@mantine/notifications';
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';

type TransferActionProps = (
  emissionId: number,
  onSuccess?: () => void,
) => {
  accept: UseMutationResult<ServerData<{}>, Error, { firmId: string; quantity: number; notes: string }, unknown>;
};

export const useTransferAction: TransferActionProps = (emissionId, onSuccess) => {
  const t = useTranslations();
  const queryClient = useQueryClient();

  const accept = useMutation({
    mutationFn: ({ firmId, quantity, notes }: { firmId: string; quantity: number; notes: string }) =>
      throwError(acceptPermitTransfer(emissionId, firmId, quantity, notes), `acceptPermitTransfer:${firmId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['marketplace', 'paginatedWinningBids'],
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

  return { accept };
};
