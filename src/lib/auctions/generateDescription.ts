const capitalizeFirstLetter = (str:string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const generateDescription = (auctionTitle:string, sector:string) => {
  return `${auctionTitle.split(' - ').map(text => capitalizeFirstLetter(text)).join(' ')} for the ${capitalizeFirstLetter(sector)} sector.`;
}