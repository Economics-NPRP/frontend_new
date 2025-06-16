import { Switch } from '@/components/SwitchCase';
import { Skeleton, SkeletonProps } from '@mantine/core';

export interface WithSkeletonProps extends SkeletonProps {
	loading: boolean;
}
export const WithSkeleton = ({ loading, children, ...props }: WithSkeletonProps) => {
	return (
		<Switch value={loading}>
			<Switch.True>
				<Skeleton {...props} visible />
			</Switch.True>
			<Switch.False>{children}</Switch.False>
		</Switch>
	);
};
