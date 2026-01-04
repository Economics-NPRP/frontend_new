'use client';
import { useTranslations } from 'next-intl';

import { throwError, isolateMessage } from '@/helpers';
import { approveTransfer } from '@/lib/sma';
import { ServerData } from '@/types';
import { notifications } from '@mantine/notifications';
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';

type TransferActionProps = (
  onSuccess?: () => void,
) => {
  transferAction: UseMutationResult<ServerData<{}>, Error, { requestId: string; decision: "approve" | "reject"; notes: string }, unknown>;
};

export const useTransferApproval: TransferActionProps = (onSuccess) => {
  const t = useTranslations();
  const queryClient = useQueryClient();

  const transferAction = useMutation({
    mutationFn: ({ requestId, decision, notes }: { requestId: string; decision: "approve" | "reject"; notes: string }) =>
      throwError(approveTransfer(requestId, decision, notes), `acceptPermitTransfer:${requestId}`),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['marketplace', 'paginatedWinningBids'],
      });
      notifications.show({
        color: 'green',
        title: t('lib.transfer.accept.success.title', {
          decision: edit(variables.decision, "present"),
        }),
        message: t('lib.transfer.accept.success.message', {
          decision: edit(variables.decision, "past"),
        }),
        position: 'bottom-center',
      });
      onSuccess?.();
    },
    onError: (error: Error, variables) => {
      notifications.show({
        color: 'red',
        title: t('lib.transfer.accept.error', {
          decision: edit(variables.decision, "continuous"),
        }),
        message: isolateMessage(error.message),
        position: 'bottom-center',
      });
    },
    retry: false,
  });

  return { transferAction };
};

function edit(decision: "approve" | "reject", tense: "present" | "past" | "continuous"): string {
  if (tense === "past") {
    return decision === "approve" ? "Approved" : "Rejected";
  } else if (tense === "continuous") {
    return decision === "approve" ? "Approving" : "Rejecting";
  } else {
    return decision === "approve" ? "Approve" : "Reject";
  }
}