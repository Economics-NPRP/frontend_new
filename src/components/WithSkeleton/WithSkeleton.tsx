import { Switch } from '@/components/SwitchCase';
import { Skeleton, SkeletonProps } from '@mantine/core';

export const WithSkeleton = ({ visible, children, ...props }: SkeletonProps) => {
	return (
		<Switch value={visible}>
			<Switch.True>
				<Skeleton {...props} visible />
			</Switch.True>
			<Switch.False>{children}</Switch.False>
		</Switch>
	);
};
