'use client'
import { useContext } from 'react'
import { SingleAuctionContext } from 'contexts/SingleAuction'

const Auction = () => {

  const auction = useContext(SingleAuctionContext)

  return (
    <div>Auction</div>
  )
}

export default Auction