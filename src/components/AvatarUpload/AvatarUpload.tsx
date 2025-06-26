import { Avatar, AvatarProps, Container, FileButton, Text, UnstyledButton } from '@mantine/core';
import { IconPhotoHexagon, IconUpload } from '@tabler/icons-react';

import classes from './styles.module.css';

export interface AvatarUploadProps extends AvatarProps {
	accept?: string;
	onChangeFile: (file: File | null) => void;
}
export const AvatarUpload = ({ accept, onChangeFile, className, ...props }: AvatarUploadProps) => {
	return (
		<Container className={`${classes.root} ${className}`}>
			<Avatar size="xl" className={classes.avatar} {...props}>
				<IconPhotoHexagon size={48} className={classes.icon} />
			</Avatar>
			<FileButton onChange={onChangeFile} accept={accept}>
				{(props) => (
					<UnstyledButton className={classes.overlay} {...props}>
						<IconUpload size={20} className={classes.icon} />
						<Text className={classes.text}>Upload New Photo</Text>
					</UnstyledButton>
				)}
			</FileButton>
		</Container>
	);
};
