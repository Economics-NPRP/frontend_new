'use client';

import { useTranslations } from 'next-intl';

import { throwError, isolateMessage } from '@/helpers';
import { approveAuctionApplication, rejectAuctionApplication, executeAuctionApplication } from '@/lib/sma/auctionApplicationAction';
import { ServerData } from '@/types';
import { notifications } from '@mantine/notifications';
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';

type SMAuctionActionProps = (
  onSuccess?: () => void,
) => {
  approve: UseMutationResult<ServerData<{}>, Error, { auctionId: string; notes?: string }, unknown>;
  reject: UseMutationResult<ServerData<{}>, Error, { auctionId: string; notes?: string }, unknown>;
  execute: UseMutationResult<ServerData<{}>, Error, { auctionId: string }, unknown>;
};

export const useSMAuctionAction: SMAuctionActionProps = (onSuccess) => {
  const t = useTranslations();
  const queryClient = useQueryClient();

  const approve = useMutation({
    mutationFn: ({ auctionId, notes }: { auctionId: string; notes?: string }) =>
      throwError(approveAuctionApplication(auctionId, notes), `approveAuctionApplication:${auctionId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['listSecondaryMarketApprovals'],
      });
      notifications.show({
        color: 'green',
        title: t('lib.sma.approve.success.title'),
        message: t('lib.sma.approve.success.message'),
        position: 'bottom-center',
      });
      onSuccess?.();
    },
    onError: (error: Error) => {
      notifications.show({
        color: 'red',
        title: t('lib.sma.approve.error'),
        message: isolateMessage(error.message),
        position: 'bottom-center',
      });
    },
    retry: false,
  });

  const reject = useMutation({
    mutationFn: ({ auctionId, notes }: { auctionId: string; notes?: string }) =>
      throwError(rejectAuctionApplication(auctionId, notes), `rejectAuctionApplication:${auctionId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['listSecondaryMarketApprovals'],
      });
      notifications.show({
        color: 'green',
        title: t('lib.sma.reject.success.title'),
        message: t('lib.sma.reject.success.message'),
        position: 'bottom-center',
      });
      onSuccess?.();
    },
    onError: (error: Error) => {
      notifications.show({
        color: 'red',
        title: t('lib.sma.reject.error'),
        message: isolateMessage(error.message),
        position: 'bottom-center',
      });
    },
    retry: false,
  });

  const execute = useMutation({
    mutationFn: ({ auctionId }: { auctionId: string }) =>
      throwError(executeAuctionApplication(auctionId), `executeAuctionApplication:${auctionId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['listSecondaryMarketApprovals'],
      });
      notifications.show({
        color: 'green',
        title: t('lib.sma.execute.success.title'),
        message: t('lib.sma.execute.success.message'),
        position: 'bottom-center',
      });
      onSuccess?.();
    },
    onError: (error: Error) => {
      notifications.show({
        color: 'red',
        title: t('lib.sma.execute.error'),
        message: isolateMessage(error.message),
        position: 'bottom-center',
      });
    },
    retry: false,
  });

  return { approve, reject, execute };
};
