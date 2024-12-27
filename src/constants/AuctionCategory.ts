import { ForwardRefExoticComponent, RefAttributes } from 'react';

import { AuctionCategory, ThemeColors } from '@/types';
import {
	Icon,
	IconBolt,
	IconBuildingCommunity,
	IconBuildingFactory,
	IconLeaf,
	IconProps,
	IconRecycle,
	IconTruck,
} from '@tabler/icons-react';

export interface AuctionCategoryData {
	Icon: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
	image: string;
	color: {
		token?: ThemeColors;
		hex?: string;
	};
}

export const AuctionCategoryVariants: Partial<Record<AuctionCategory, AuctionCategoryData>> = {
	energy: {
		// image: 'https://images.unsplash.com/photo-1473876637954-4b493d59fd97?q=80&w=1692&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		image: 'http://localhost:4321/imgs/carbon_dioxide.jpg',
		Icon: IconBolt,
		color: {
			token: 'yellow',
		},
	},
	industry: {
		// image: 'https://plus.unsplash.com/premium_photo-1682144944581-7ed4b3e8ea93?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		// image: 'https://img.freepik.com/free-photo/factory-workshop-interior-machines-glass-industry-background-process-production_645730-553.jpg?t=st=1735198645~exp=1735202245~hmac=6abd5eb8a8839707023d8ad51aeeb63707c92c9a48fb2d082e812240307e2be2&w=1380',
		// image: 'https://media.istockphoto.com/id/1414159128/photo/inside-bright-advanced-semiconductor-production-fab-cleanroom-with-working-overhead-wafer.jpg?s=2048x2048&w=is&k=20&c=uuqqDOpLxPCGCtCQr_CDmxIybTmJ_zjxowaGQma9Bis=',
		// image: 'https://images.pexels.com/photos/4487364/pexels-photo-4487364.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
		// image: 'https://images.pexels.com/photos/19233057/pexels-photo-19233057/free-photo-of-assembling-machines-in-factory.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
		// image: 'https://images.pexels.com/photos/16045335/pexels-photo-16045335/free-photo-of-man-standing-and-working-by-machinery.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
		// image: 'https://images.pexels.com/photos/6890325/pexels-photo-6890325.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
		image: 'https://images.pexels.com/photos/6890378/pexels-photo-6890378.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
		Icon: IconBuildingFactory,
		color: {
			token: 'maroon',
		},
	},
	transport: {
		// image: 'https://images.pexels.com/photos/210182/pexels-photo-210182.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
		// image: 'https://images.pexels.com/photos/186537/pexels-photo-186537.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
		// image: 'https://images.pexels.com/photos/7674/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
		// image: 'https://images.pexels.com/photos/20545175/pexels-photo-20545175/free-photo-of-rush-hour-traffic-jam.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
		// image: 'https://images.pexels.com/photos/23806917/pexels-photo-23806917/free-photo-of-rush-hour-traffic-in-the-downtown-at-dusk.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
		// image: 'https://images.pexels.com/photos/11347831/pexels-photo-11347831.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
		// image: 'https://images.pexels.com/photos/11839508/pexels-photo-11839508.jpeg?auto=compress&cs=tinysrgb&w=600',
		image: 'https://images.pexels.com/photos/10658552/pexels-photo-10658552.jpeg?auto=compress&cs=tinysrgb&w=600',
		// image: 'https://images.pexels.com/photos/29893349/pexels-photo-29893349/free-photo-of-urban-street-scene-during-busy-twilight-hours.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
		// image: 'https://images.pexels.com/photos/1600757/pexels-photo-1600757.jpeg?auto=compress&cs=tinysrgb&w=600',
		Icon: IconTruck,
		color: {
			token: 'salmon',
		},
	},
	buildings: {
		image: 'http://localhost:4321/imgs/hfc.jpg',
		Icon: IconBuildingCommunity,
		color: {
			token: 'purple',
		},
	},
	agriculture: {
		image: 'http://localhost:4321/imgs/methane.jpg',
		Icon: IconLeaf,
		color: {
			token: 'palm',
		},
	},
	waste: {
		// image: 'https://images.pexels.com/photos/128421/pexels-photo-128421.jpeg?auto=compress&cs=tinysrgb&w=600',
		// image: 'https://images.pexels.com/photos/3174350/pexels-photo-3174350.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
		image: 'https://images.pexels.com/photos/2955032/pexels-photo-2955032.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
		Icon: IconRecycle,
		color: {
			token: 'skyline',
		},
	},
};
