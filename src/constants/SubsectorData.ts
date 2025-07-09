import English from '@/locales/en.json';
import { EnergySubsectorType, IndustrySubsectorType } from '@/schema/models';

export interface SubsectorData {
	image: string;
	title: string;
	description: string;
}

export const EnergySubsectorVariants: Record<EnergySubsectorType, SubsectorData> = {
	gasTurbine: {
		// https://www.vecteezy.com/photo/47307105-a-man-in-an-orange-jacket-is-working-on-a-large-machine
		image: '/imgs/energy/gasTurbine.jpg',
		title: English.constants.subsector.gasTurbine.title,
		description: English.constants.subsector.gasTurbine.description,
	},
};

export const IndustrySubsectorVariants: Record<IndustrySubsectorType, SubsectorData> = {
	flareGasRecoveryBurning: {
		image: '/imgs/industry/flare.jpg',
		title: English.constants.subsector.flareGasRecoveryBurning.title,
		description: English.constants.subsector.flareGasRecoveryBurning.description,
	},
	oilAndGasWellheadOperations: {
		image: 'https://images.pexels.com/photos/11718060/pexels-photo-11718060.png?_gl=1*1mdlgi8*_ga*MjAzOTIwMDUxNS4xNzUyMDMwOTU1*_ga_8JE65Q40S6*czE3NTIwMzA5NTQkbzEkZzEkdDE3NTIwMzI2MDQkajUkbDAkaDA.',
		title: English.constants.subsector.oilAndGasWellheadOperations.title,
		description: English.constants.subsector.oilAndGasWellheadOperations.description,
	},
	oilAndGasTankStorage: {
		image: 'https://images.pexels.com/photos/6537731/pexels-photo-6537731.jpeg?_gl=1*1ledgau*_ga*MjAzOTIwMDUxNS4xNzUyMDMwOTU1*_ga_8JE65Q40S6*czE3NTIwMzA5NTQkbzEkZzEkdDE3NTIwMzE4NjYkajQxJGwwJGgw',
		title: English.constants.subsector.oilAndGasTankStorage.title,
		description: English.constants.subsector.oilAndGasTankStorage.description,
	},
};

export const AllSubsectorVariants = {
	...EnergySubsectorVariants,
	...IndustrySubsectorVariants,
};

export const SubsectorVariants = {
	energy: EnergySubsectorVariants,
	industry: IndustrySubsectorVariants,
	transport: {},
	buildings: {},
	agriculture: {},
	waste: {},
};

export const EnergySubsectorList = ['gasTurbine'] as const;
export const IndustrySubsectorList = [
	'flareGasRecoveryBurning',
	'oilAndGasWellheadOperations',
	'oilAndGasTankStorage',
] as const;
