'use client';

import { useState } from 'react';

import { AvatarUpload } from '@/components/AvatarUpload';
import { CategoryBadge } from '@/components/Badge';
import { AuctionCategoryList } from '@/constants/AuctionCategory';
import classes from '@/pages/(auth)/(external)/styles.module.css';
import { AuctionCategory } from '@/types';
import { Button, Group, Input, MultiSelect, Stepper, TextInput } from '@mantine/core';
import {
	IconArrowNarrowRight,
	IconBuilding,
	IconCertificate,
	IconChartPie,
} from '@tabler/icons-react';

export default function Form() {
	const [activeStep, setActiveStep] = useState(0);

	return (
		<>
			<Stepper
				active={activeStep}
				onStepClick={setActiveStep}
				classNames={{
					root: classes.stepper,
					steps: `${classes.steps} ${classes.section}`,
					content: `${classes.inputs} ${classes.section}`,
				}}
			>
				<Stepper.Step label="First Step" description="Basic Information">
					<Input.Wrapper
						label="Company Logo"
						description="Upload your company logo"
						className={classes.avatar}
					>
						<AvatarUpload className={classes.input} />
					</Input.Wrapper>
					<TextInput
						label="Company Name"
						placeholder="Enter company name..."
						autoComplete="company"
						leftSection={<IconBuilding size={16} />}
						required
					/>
					<TextInput
						label="Commercial Registration Number (CRN)"
						placeholder="Enter CRN..."
						autoComplete="crn"
						leftSection={<IconCertificate size={16} />}
						required
					/>
					<MultiSelect
						label="Business Sectors"
						description="Select the sectors your company operates in"
						placeholder="Select business sectors..."
						leftSection={<IconChartPie size={16} />}
						required
						data={AuctionCategoryList}
						renderOption={({ option }) => (
							<CategoryBadge category={option.value as AuctionCategory} />
						)}
					/>
				</Stepper.Step>
				<Stepper.Step
					label="Second Step"
					description="Primary Contact Details"
				></Stepper.Step>
				<Stepper.Step label="Third Step" description="Upload Documents"></Stepper.Step>
				<Stepper.Step label="Final Step" description="Preview Account"></Stepper.Step>
			</Stepper>

			<Group className={`${classes.action} ${classes.section}`}>
				<Button variant="outline" className={classes.button}>
					Back
				</Button>
				<Button
					className={classes.button}
					rightSection={<IconArrowNarrowRight size={20} />}
				>
					Continue
				</Button>
			</Group>
		</>
	);
}
