import { throwError } from '@/helpers';
import { joinAuction } from '@/lib/auctions';
import { ServerData } from '@/types';
import { notifications } from '@mantine/notifications';
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';

// Accept auctionType as an optional parameter
type JoinAuctionProps = (
	id: string,
	onSuccess?: () => void,
	auctionType?: 'open' | 'sealed'
) => UseMutationResult<ServerData<{}>, Error, void, unknown>;
export const useJoinAuction: JoinAuctionProps = (id, onSuccess, auctionType) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => throwError(joinAuction(id, auctionType)),
		onSuccess: () => {
			// Invalidate all relevant queries
			queryClient.invalidateQueries({ queryKey: ['marketplace', id] });
			queryClient.invalidateQueries({ queryKey: ['marketplace', 'paginatedAuctions'] });
			queryClient.invalidateQueries({ queryKey: ['marketplace', id, 'singleAuction'] });
			// Optionally, force a refetch
			queryClient.refetchQueries({ queryKey: ['marketplace', id, 'singleAuction'] });
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
