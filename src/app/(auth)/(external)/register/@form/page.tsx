'use client';

import { useContext } from 'react';

import { AccountSummary } from '@/components/AccountSummary';
import { AvatarUpload } from '@/components/AvatarUpload';
import { Switch } from '@/components/SwitchCase';
import { SectorCard } from '@/pages/(auth)/(external)/register/@form/SectorCard';
import { RegistrationPageContext } from '@/pages/(auth)/(external)/register/_components/Providers';
import classes from '@/pages/(auth)/(external)/styles.module.css';
import { DefaultFirmData } from '@/schema/models';
import {
	Button,
	Container,
	Divider,
	FileInput,
	Group,
	Input,
	Stack,
	Text,
	TextInput,
	Title,
} from '@mantine/core';
import {
	IconArrowNarrowRight,
	IconBriefcase,
	IconBuilding,
	IconBuildingBank,
	IconCertificate,
	IconCheck,
	IconMail,
	IconPhone,
	IconWorld,
} from '@tabler/icons-react';

export default function Form() {
	const { activeStep, handleNextStep, handlePrevStep } = useContext(RegistrationPageContext);

	return (
		<>
			<Switch value={activeStep}>
				<Switch.Case when={0}>
					<Stack className={`${classes.header} ${classes.section}`}>
						<Title className={classes.heading}>Welcome to ETS!</Title>
						<Text className={classes.subheading}>
							Please complete the following steps to register your account.
						</Text>
					</Stack>
					<Stack className={`${classes.inputs} ${classes.section}`}>
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
						<TextInput
							label="IBAN Number"
							placeholder="Enter IBAN..."
							autoComplete="crn"
							leftSection={<IconBuildingBank size={16} />}
							required
						/>
						<Divider label="Upload Documents" />
						<FileInput
							label="Upload Commercial Registration Card"
							placeholder="Upload file..."
							required
							clearable
						/>
						<FileInput
							label="Upload IBAN Certificate"
							placeholder="Upload file..."
							required
							clearable
						/>
					</Stack>
				</Switch.Case>
				<Switch.Case when={1}>
					<Stack className={`${classes.header} ${classes.section}`}>
						<Title className={classes.heading}>Select Business Sectors</Title>
						<Text className={classes.subheading}>
							Please select the sectors your company operates in. This is used to
							determine which auctions you can participate in.
						</Text>
					</Stack>
					<Stack className={`${classes.inputs} ${classes.section}`}>
						<Container className={classes.sectors}>
							<SectorCard sector="energy" />
							<SectorCard sector="industry" />
							<SectorCard sector="transport" />
							<SectorCard sector="buildings" />
							<SectorCard sector="agriculture" />
							<SectorCard sector="waste" />
						</Container>
					</Stack>
				</Switch.Case>
				<Switch.Case when={2}>
					<Stack className={`${classes.header} ${classes.section}`}>
						<Title className={classes.heading}>
							Add Primary Company Representative
						</Title>
						<Text className={classes.subheading}>
							Please provide the details of the primary representative for your
							company. This person will be the main point of contact for your account.
						</Text>
					</Stack>
					<Stack className={`${classes.inputs} ${classes.section}`}>
						<TextInput
							label="Full Name"
							placeholder="Enter full name..."
							name="fullName"
							autoComplete="name"
							required
						/>
						<TextInput
							label="Position"
							placeholder="Enter position..."
							name="position"
							leftSection={<IconBriefcase size={16} />}
						/>
						<TextInput
							type="email"
							label="Email Address"
							placeholder="Enter email address..."
							autoComplete="email"
							leftSection={<IconMail size={16} />}
							required
						/>
						<TextInput
							label="Phone Number"
							placeholder="Enter phone number..."
							autoComplete="tel"
							leftSection={<IconPhone size={16} />}
							required
						/>
						<TextInput
							label="Company Website"
							placeholder="Enter website url..."
							autoComplete="url"
							leftSection={<IconWorld size={16} />}
							required
						/>
						<TextInput
							label="Headquarter Address"
							placeholder="Enter address of company HQ..."
							autoComplete="address"
							leftSection={<IconBuilding size={16} />}
						/>
					</Stack>
				</Switch.Case>
				<Switch.Case when={3}>
					<Stack className={`${classes.header} ${classes.section}`}>
						<Title className={classes.heading}>Review Your Account Details</Title>
						<Text className={classes.subheading}>
							Please review the details below to ensure everything is correct before
							proceeding.
						</Text>
					</Stack>
					<Stack className={`${classes.inputs} ${classes.section}`}>
						<AccountSummary
							className={classes.summary}
							firmData={{
								name: 'New Company',
								email: 'test@gmail.com',
								phone: '+974 1234 5678',
								type: 'firm',
								sectors: ['industry', 'transport', 'buildings'],
							}}
						/>
					</Stack>
				</Switch.Case>
			</Switch>

			<Group className={`${classes.action} ${classes.section}`}>
				{activeStep !== 0 && (
					<Button variant="outline" className={classes.button} onClick={handlePrevStep}>
						Back
					</Button>
				)}
				<Switch value={activeStep === 3}>
					<Switch.True>
						<Button
							className={classes.button}
							color="green"
							rightSection={<IconCheck size={16} />}
							onClick={handleNextStep}
						>
							Create Account
						</Button>
					</Switch.True>
					<Switch.False>
						<Button
							className={classes.button}
							rightSection={<IconArrowNarrowRight size={20} />}
							onClick={handleNextStep}
						>
							Continue
						</Button>
					</Switch.False>
				</Switch>
			</Group>
		</>
	);
}
