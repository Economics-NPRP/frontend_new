'use client'
import { HomeAuctionCycleCard } from "@/components/AuctionCycleCard";
import { useContext, useEffect } from "react";
import { PaginatedAuctionCyclesContext } from 'contexts/PaginatedAuctionCycles';
import { DefaultAuctionCycleData } from "@/schema/models";

export default function Content() {

	const { data, isLoading } = useContext(PaginatedAuctionCyclesContext);

	useEffect(() => {
		console.log(data, isLoading)
	}, [data]);

	return (
		<>
			<HomeAuctionCycleCard
				auctionCycleData={data.results[0] ?? DefaultAuctionCycleData}
				loading={isLoading}
			/>
		</>
	);
}
