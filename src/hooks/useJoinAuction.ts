import { throwError } from '@/helpers';
import { joinAuction } from '@/lib/auctions';
import { ServerData } from '@/types';
import { notifications } from '@mantine/notifications';
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';

type JoinAuctionProps = (
	id: string,
	onSuccess?: () => void,
) => UseMutationResult<ServerData<{}>, Error, void, unknown>;
export const useJoinAuction: JoinAuctionProps = (id, onSuccess) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => throwError(joinAuction(id)),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['marketplace', id],
			});
			queryClient.invalidateQueries({
				queryKey: ['marketplace', 'paginatedAuctions'],
			});
			onSuccess?.();
		},
		onError: (error: Error) => {
			notifications.show({
				color: 'red',
				title: 'There was a problem joining the auction',
				message: error.message,
				position: 'bottom-center',
			});
		},
		retry: false,
	});
};
