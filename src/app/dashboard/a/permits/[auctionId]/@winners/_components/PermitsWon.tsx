"use client"
import { Flex, Title, Text, Button } from "@mantine/core"
import { IconUser } from "@tabler/icons-react"
type PermitsWonProps = {
  bid: {
    companyName: string;
    owner: string;
    bids: {
      total: number;
      approved: number;
      pending: number;
      rejected: number;
      locked: number;
      unlocked: number;
      expired: number;
      valid: number;
    }
  }
}
const PermitsWon = ({ bid }:PermitsWonProps) => {
  return (
    <div>PermitsWon</div>
  )
}

export default PermitsWon