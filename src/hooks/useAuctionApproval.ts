'use client';

import { useTranslations } from 'next-intl';

import { throwError } from '@/helpers';
import { approveAuctionApplication, rejectAuctionApplication, executeAuctionApplication } from '@/lib/sma';
import { ServerData } from '@/types';
import { notifications } from '@mantine/notifications';
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';

type AuctionApprovalProps = (
  auctionId: string,
  options?: {
    onApproveSettled?: () => void;
    onApproveError?: (error: Error) => void;
    onApproveSuccess?: () => void;

    onRejectSettled?: () => void;
    onRejectError?: (error: Error) => void;
    onRejectSuccess?: () => void;
  },
) => {
  approve: UseMutationResult<ServerData<{}>, Error, string, unknown>;
  reject: UseMutationResult<ServerData<{}>, Error, string, unknown>;
  execute: UseMutationResult<ServerData<{}>, Error, void, unknown>;
};
export const useAuctionApproval: AuctionApprovalProps = (
  auctionId,
  {
    onApproveSettled,
    onApproveError,
    onApproveSuccess,
    onRejectSettled,
    onRejectError,
    onRejectSuccess,
  } = {},
) => {
  const t = useTranslations();
  const queryClient = useQueryClient();

  const approve = useMutation({
    mutationFn: (notes: string) => throwError(approveAuctionApplication(auctionId, notes), `approveApplication:${auctionId}`),
    onSettled: onApproveSettled,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dashboard', 'admin', 'paginatedFirmApplications'],
      });
      notifications.show({
        color: 'green',
        title: t('lib.users.firms.applications.approve.success.title'),
        message: t('lib.users.firms.applications.approve.success.message'),
        position: 'bottom-center',
      });
      onApproveSuccess?.();
    },
    onError: (error: Error) => {
      notifications.show({
        color: 'red',
        title: t('lib.users.firms.applications.approve.error'),
        message: error.message,
        position: 'bottom-center',
      });
      onApproveError?.(error);
    },
    retry: false,
  });

  const reject = useMutation({
    mutationFn: (notes: string) =>
      throwError(rejectAuctionApplication(auctionId, notes), `rejectApplication:${auctionId}`),
    onSettled: onRejectSettled,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dashboard', 'admin', 'paginatedFirmApplications'],
      });
      notifications.show({
        color: 'green',
        title: t('lib.users.firms.applications.reject.success.title'),
        message: t('lib.users.firms.applications.reject.success.message'),
        position: 'bottom-center',
      });
      onRejectSuccess?.();
    },
    onError: (error: Error) => {
      notifications.show({
        color: 'red',
        title: t('lib.users.firms.applications.reject.error'),
        message: error.message,
        position: 'bottom-center',
      });
      onRejectError?.(error);
    },
    retry: false,
  });

  const execute = useMutation({
    mutationFn: () =>
      throwError(executeAuctionApplication(auctionId), `executeApplication:${auctionId}`),
    onSettled: onRejectSettled,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dashboard', 'admin', 'paginatedFirmApplications'],
      });
      notifications.show({
        color: 'green',
        title: t('lib.users.firms.applications.reject.success.title'),
        message: t('lib.users.firms.applications.reject.success.message'),
        position: 'bottom-center',
      });
      onRejectSuccess?.();
    },
    onError: (error: Error) => {
      notifications.show({
        color: 'red',
        title: t('lib.users.firms.applications.reject.error'),
        message: error.message,
        position: 'bottom-center',
      });
      onRejectError?.(error);
    },
    retry: false,
  });

  return { approve, reject, execute };
};
