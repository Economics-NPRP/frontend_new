'use client'
import { Id } from "@/components/Id";
import { MyUserProfileContext } from "contexts/MyUserProfile";
import { useEffect, useContext } from "react";

export default function Hero() {

	const profile = useContext(MyUserProfileContext)

	useEffect(() => {
		console.log("UserProfile in Hero", profile)
	}, [profile])

	return (
		<>
			<Id
				variant="company"
				value={(profile && profile.data && profile.data.id) || ""}
			/>
		</>
	);
}
