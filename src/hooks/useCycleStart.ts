'use client';

import { useTranslations } from 'next-intl';

import { throwError, isolateMessage } from '@/helpers';
import { startCycle } from '@/lib/cycles';
import { ServerData } from '@/types';
import { notifications } from '@mantine/notifications';
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';

type CycleStartProps = (
  id: string,
  onSuccess?: () => void,
) => UseMutationResult<ServerData<{}>, Error, void, unknown>;
export const useCycleStart: CycleStartProps = (id, onSuccess) => {
  const t = useTranslations();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => throwError(startCycle(id), `startCycle:${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dashboard', 'admin', id, 'singleCycle'],
      });
      queryClient.invalidateQueries({
        queryKey: ['dashboard', 'admin', 'paginatedAuctionCycles'],
      });
      notifications.show({
        color: 'green',
        title: t('lib.cycles.start.success.title'),
        message: t('lib.cycles.start.success.message'),
        position: 'bottom-center',
      });
      onSuccess?.();
    },
    onError: (error: Error) => {
      notifications.show({
        color: 'red',
        title: t('lib.cycles.start.error'),
        message: isolateMessage(error.message),
        position: 'bottom-center',
      });
    },
    retry: false,
  });
};
