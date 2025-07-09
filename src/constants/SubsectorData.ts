import MiniSearch from 'minisearch';

import English from '@/locales/en.json';
import { EnergySubsectorType, IndustrySubsectorType } from '@/schema/models';

export interface SubsectorData {
	id: string;
	image: string;
	alt: string;
	title: string;
	description: string;
}

export const EnergySubsectorVariants: Record<EnergySubsectorType, SubsectorData> = {
	gasTurbine: {
		// https://www.vecteezy.com/photo/47307105-a-man-in-an-orange-jacket-is-working-on-a-large-machine
		id: 'gasTurbine',
		image: '/imgs/energy/gasTurbine.jpg',
		alt: English.constants.subsector.gasTurbine.alt,
		title: English.constants.subsector.gasTurbine.title,
		description: English.constants.subsector.gasTurbine.description,
	},
};

export const IndustrySubsectorVariants: Record<IndustrySubsectorType, SubsectorData> = {
	flareGasRecoveryBurning: {
		id: 'flareGasRecoveryBurning',
		image: '/imgs/industry/flare.jpg',
		alt: English.constants.subsector.flareGasRecoveryBurning.alt,
		title: English.constants.subsector.flareGasRecoveryBurning.title,
		description: English.constants.subsector.flareGasRecoveryBurning.description,
	},
	oilAndGasWellheadOperations: {
		id: 'oilAndGasWellheadOperations',
		image: 'https://images.pexels.com/photos/11718060/pexels-photo-11718060.png?_gl=1*1mdlgi8*_ga*MjAzOTIwMDUxNS4xNzUyMDMwOTU1*_ga_8JE65Q40S6*czE3NTIwMzA5NTQkbzEkZzEkdDE3NTIwMzI2MDQkajUkbDAkaDA.',
		alt: English.constants.subsector.oilAndGasWellheadOperations.alt,
		title: English.constants.subsector.oilAndGasWellheadOperations.title,
		description: English.constants.subsector.oilAndGasWellheadOperations.description,
	},
	oilAndGasTankStorage: {
		id: 'oilAndGasTankStorage',
		image: 'https://images.pexels.com/photos/6537731/pexels-photo-6537731.jpeg?_gl=1*1ledgau*_ga*MjAzOTIwMDUxNS4xNzUyMDMwOTU1*_ga_8JE65Q40S6*czE3NTIwMzA5NTQkbzEkZzEkdDE3NTIwMzE4NjYkajQxJGwwJGgw',
		alt: English.constants.subsector.oilAndGasTankStorage.alt,
		title: English.constants.subsector.oilAndGasTankStorage.title,
		description: English.constants.subsector.oilAndGasTankStorage.description,
	},
};

export const AllSubsectorVariants = {
	...EnergySubsectorVariants,
	...IndustrySubsectorVariants,
};

export const AllSubsectorVariantsList = Object.values(AllSubsectorVariants);

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

export const SubsectorSearch = new MiniSearch<SubsectorData>({
	fields: ['id', 'title', 'description', 'alt'],
	storeFields: ['id'],
	searchOptions: {
		boost: { id: 2, title: 4, description: 2 },
		fuzzy: 0.2,
		prefix: true,
	},
});
