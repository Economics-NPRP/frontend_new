import { TextInput } from '@mantine/core';
import { IconBuilding } from '@tabler/icons-react';

export const BasicInformation = () => {
	return (
		<TextInput
			label="Company Name"
			placeholder="Enter company name..."
			autoComplete="company"
			leftSection={<IconBuilding size={16} />}
			required
		/>
	);
};
