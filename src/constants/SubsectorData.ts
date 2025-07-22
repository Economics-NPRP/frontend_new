import MiniSearch from 'minisearch';

import { StopWords } from '@/constants/StopWords';
import English from '@/locales/en.json';
import {
	AgricultureSubsectorType,
	BuildingsSubsectorType,
	EnergySubsectorType,
	IndustrySubsectorType,
	TransportSubsectorType,
	WasteSubsectorType,
} from '@/schema/models';

export interface SubsectorData {
	id: string;
	image: string;
	alt: string;
	title: string;
	description: string;
	keywords: Array<string>;
}

export const EnergySubsectorVariants: Record<EnergySubsectorType, SubsectorData> = {
	gasTurbine: {
		// https://www.vecteezy.com/photo/47307105-a-man-in-an-orange-jacket-is-working-on-a-large-machine
		id: 'gasTurbine',
		image: '/imgs/energy/gasTurbine.jpg',
		alt: English.constants.subsector.gasTurbine.alt,
		title: English.constants.subsector.gasTurbine.title,
		description: English.constants.subsector.gasTurbine.description,
		keywords: [
			'gas turbine',
			'gas',
			'turbine',
			'power plant',
			'electricity',
			'energy',
			'steam',
			'steam turbine',
			'combustion',
			'combustion engine',
			'generator',
			'generator plant',
			'power plant',
		],
	},
	electricalTransmissionAndDistribution: {
		id: 'electricalTransmissionAndDistribution',
		image: 'https://plus.unsplash.com/premium_photo-1675643315742-d5798a060b47?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		alt: English.constants.subsector.electricalTransmissionAndDistribution.alt,
		title: English.constants.subsector.electricalTransmissionAndDistribution.title,
		description: English.constants.subsector.electricalTransmissionAndDistribution.description,
		keywords: [
			'electrical transmission',
			'electricity',
			'distribution',
			'power distribution',
			'power grid',
			'grid',
			'transmission',
			'distribution grid',
			'electric grid',
			'power line',
			'substation',
			'transformer',
			'line',
		],
	},
};

export const IndustrySubsectorVariants: Record<IndustrySubsectorType, SubsectorData> = {
	flareGasRecoveryBurning: {
		id: 'flareGasRecoveryBurning',
		image: '/imgs/industry/flare.jpg',
		alt: English.constants.subsector.flareGasRecoveryBurning.alt,
		title: English.constants.subsector.flareGasRecoveryBurning.title,
		description: English.constants.subsector.flareGasRecoveryBurning.description,
		keywords: [
			'flare gas recovery',
			'flare',
			'flaring',
			'flare stack',
			'gas recovery',
			'gas recovery burning',
			'gas recovery system',
			'oil and gas',
			'oil',
			'gas',
			'downstream',
		],
	},
	oilAndGasWellheadOperations: {
		id: 'oilAndGasWellheadOperations',
		image: 'https://images.pexels.com/photos/11718060/pexels-photo-11718060.png?_gl=1*1mdlgi8*_ga*MjAzOTIwMDUxNS4xNzUyMDMwOTU1*_ga_8JE65Q40S6*czE3NTIwMzA5NTQkbzEkZzEkdDE3NTIwMzI2MDQkajUkbDAkaDA.',
		alt: English.constants.subsector.oilAndGasWellheadOperations.alt,
		title: English.constants.subsector.oilAndGasWellheadOperations.title,
		description: English.constants.subsector.oilAndGasWellheadOperations.description,
		keywords: [
			'oil and gas',
			'oil',
			'gas',
			'wellhead',
			'well',
			'wellhead operation',
			'drilling',
			'production',
			'extraction',
			'refining',
			'petroleum',
			'crude oil',
			'natural gas',
			'gas extraction',
			'gas well',
			'gas well operation',
			'gas wellhead',
			'gas wellhead operation',
			'oil well',
			'oil well operation',
			'oil wellhead',
			'oil wellhead operation',
			'offshore',
			'oil rig',
			'offshore platform',
			'offshore drilling',
		],
	},
	oilAndGasTankStorage: {
		id: 'oilAndGasTankStorage',
		image: 'https://images.pexels.com/photos/6537731/pexels-photo-6537731.jpeg?_gl=1*1ledgau*_ga*MjAzOTIwMDUxNS4xNzUyMDMwOTU1*_ga_8JE65Q40S6*czE3NTIwMzA5NTQkbzEkZzEkdDE3NTIwMzE4NjYkajQxJGwwJGgw',
		alt: English.constants.subsector.oilAndGasTankStorage.alt,
		title: English.constants.subsector.oilAndGasTankStorage.title,
		description: English.constants.subsector.oilAndGasTankStorage.description,
		keywords: [
			'oil and gas',
			'oil',
			'gas',
			'tank',
			'storage',
			'storage tank',
			'oil storage',
			'gas storage',
			'oil tank',
			'gas tank',
			'storage depot',
		],
	},
};

export const TransportSubsectorVariants: Record<TransportSubsectorType, SubsectorData> = {
	passengerAndGovernmentVehicles: {
		id: 'passengerAndGovernmentVehicles',
		image: 'https://images.pexels.com/photos/210182/pexels-photo-210182.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
		alt: English.constants.subsector.passengerAndGovernmentVehicles.alt,
		title: English.constants.subsector.passengerAndGovernmentVehicles.title,
		description: English.constants.subsector.passengerAndGovernmentVehicles.description,
		keywords: [
			'cars',
			'small cars',
			'passenger car',
			'taxi',
			'motorcycle',
			'motorbike',
			'ice engine',
			'internal combustion engine',
		],
	},
	airTransport: {
		id: 'airTransport',
		image: '/imgs/transport/airplane.jpg',
		alt: English.constants.subsector.airTransport.alt,
		title: English.constants.subsector.airTransport.title,
		description: English.constants.subsector.airTransport.description,
		keywords: [
			'plane',
			'airplane',
			'aeroplane',
			'aircraft',
			'airliner',
			'jet',
			'jetliner',
			'jumbo jet',
			'jumbo jets',
			'jumbo jet engine',
			'turboprop',
			'turboprop engine',
			'turbojet',
			'turbojet engine',
			'propjet',
			'propjet engine',
			'propeller',
			'helicopter',
			'helicopter engine',
			'helicopter engine',
			'helicopter',
			'helicopter engine',
		],
	},
};

export const BuildingsSubsectorVariants: Record<BuildingsSubsectorType, SubsectorData> = {
	districtCooling: {
		id: 'districtCooling',
		image: '/imgs/buildings/districtCooling.jpg',
		alt: English.constants.subsector.districtCooling.alt,
		title: English.constants.subsector.districtCooling.title,
		description: English.constants.subsector.districtCooling.description,
		keywords: [
			'district',
			'cooling',
			'cold',
			'cooling tower',
			'central air conditioning',
			'central air conditioner',
			'central air conditioning system',
			'central air conditioning plant',
			'dc',
		],
	},
	residentialHvacSystems: {
		id: 'residentialHvacSystems',
		image: '/imgs/buildings/residentialAC.jpg',
		alt: English.constants.subsector.residentialHvacSystems.alt,
		title: English.constants.subsector.residentialHvacSystems.title,
		description: English.constants.subsector.residentialHvacSystems.description,
		keywords: [
			'ac',
			'air conditioning',
			'air conditioner',
			'residential',
			'house ac',
			'suburbs',
			'personal',
			'apartment',
			'villa',
			'home',
			'house',
			'cooling',
			'cold',
		],
	},
};

export const AgricultureSubsectorVariants: Record<AgricultureSubsectorType, SubsectorData> = {
	livestockAndPoultryHousing: {
		id: 'livestockAndPoultryHousing',
		image: '/imgs/agriculture/cow.jpg',
		alt: English.constants.subsector.livestockAndPoultryHousing.alt,
		title: English.constants.subsector.livestockAndPoultryHousing.title,
		description: English.constants.subsector.livestockAndPoultryHousing.description,
		keywords: [
			'livestock',
			'poultry',
			'manure',
			'manure management',
			'manure processing',
			'cows',
			'cattle',
			'dairy',
			'beef',
			'poultry',
			'meat',
			'chicken',
			'barn',
			'coop',
			'farm',
			'goat',
			'sheep',
			'horse',
		],
	},
	fertilizerProductionAndUse: {
		id: 'fertilizerProductionAndUse',
		image: '/imgs/agriculture/fertilizer.jpg',
		alt: English.constants.subsector.fertilizerProductionAndUse.alt,
		title: English.constants.subsector.fertilizerProductionAndUse.title,
		description: English.constants.subsector.fertilizerProductionAndUse.description,
		keywords: [
			'fertilizer',
			'fertilizer production',
			'fertilizer use',
			'fertilizer management',
			'fertilizer processing',
			'fertilizer truck',
			'fertilizer trucks',
			'soil',
			'agriculture',
			'farming',
			'crops',
			'crop',
			'farm',
			'garden',
			'greenhouse',
			'greenhouses',
			'greenhouse',
			'nursery',
			'plant',
			'plants',
			'seed',
			'seeds',
		],
	},
};

export const WasteSubsectorVariants: Record<WasteSubsectorType, SubsectorData> = {
	landfills: {
		id: 'landfills',
		image: '/imgs/waste/landfill.jpg',
		alt: English.constants.subsector.landfills.alt,
		title: English.constants.subsector.landfills.title,
		description: English.constants.subsector.landfills.description,
		keywords: [
			'landfill',
			'landfills',
			'waste',
			'garbage',
			'trash',
			'compost',
			'municipal',
			'industrial',
			'commercial',
			'industrial waste',
			'commercial waste',
		],
	},
	wasteProcessing: {
		id: 'wasteProcessing',
		image: '/imgs/waste/wasteProcessing.jpg',
		alt: English.constants.subsector.wasteProcessing.alt,
		title: English.constants.subsector.wasteProcessing.title,
		description: English.constants.subsector.wasteProcessing.description,
		keywords: [
			'waste',
			'incineration',
			'incinerator',
			'recycling',
			'recycler',
			'garbage',
			'trash',
			'compost',
			'municipal',
			'industrial',
			'commercial',
			'industrial waste',
			'commercial waste',
			'incineration plant',
			'combustion',
			'burning trash',
			'composting',
			'waste handling',
			'medical waste',
		],
	},
};

export const AllSubsectorVariants = {
	...EnergySubsectorVariants,
	...IndustrySubsectorVariants,
	...TransportSubsectorVariants,
	...BuildingsSubsectorVariants,
	...AgricultureSubsectorVariants,
	...WasteSubsectorVariants,
};

export const AllSubsectorVariantsList = Object.values(AllSubsectorVariants);

export const SubsectorVariants = {
	energy: EnergySubsectorVariants,
	industry: IndustrySubsectorVariants,
	transport: TransportSubsectorVariants,
	buildings: BuildingsSubsectorVariants,
	agriculture: AgricultureSubsectorVariants,
	waste: WasteSubsectorVariants,
};

export const EnergySubsectorList = ['gasTurbine', 'electricalTransmissionAndDistribution'] as const;
export const IndustrySubsectorList = [
	'flareGasRecoveryBurning',
	'oilAndGasWellheadOperations',
	'oilAndGasTankStorage',
] as const;
export const TransportSubsectorList = ['passengerAndGovernmentVehicles', 'airTransport'] as const;
export const BuildingsSubsectorList = ['districtCooling', 'residentialHvacSystems'] as const;
export const AgricultureSubsectorList = [
	'livestockAndPoultryHousing',
	'fertilizerProductionAndUse',
] as const;
export const WasteSubsectorList = ['landfills', 'wasteProcessing'] as const;

export const SubsectorSearch = new MiniSearch<SubsectorData>({
	fields: ['id', 'image', 'title', 'description', 'alt', 'keywords'],
	storeFields: ['id', 'image', 'title', 'description', 'alt', 'keywords'],
	searchOptions: {
		boost: { id: 2, title: 4, description: 2, keywords: 2 },
		fuzzy: 0.2,
		prefix: true,
	},
	processTerm: (term) => (StopWords.has(term) ? null : term.toLowerCase()),
});
