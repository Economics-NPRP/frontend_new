import { ICreateAuctionCycleOutput } from '@/schema/models/AuctionCycleData';

export const toSnakeCase = (obj: Record<string, unknown>): ICreateAuctionCycleOutput => {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      if (obj[i] && typeof obj[i] === 'object') {
        obj[i] = toSnakeCase(obj[i]);
      }
    }
  } else {
    for (const key in obj) {
      if (obj[key] && typeof obj[key] === 'object') {
        if (key.toLowerCase() !== key) {
          const newKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
          obj[newKey] = toSnakeCase(obj[key] as Record<string, unknown>);
          delete obj[key]
        }
      } else {
        if (key.toLowerCase() !== key) {
          const newKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
          obj[newKey] = obj[key]
          delete obj[key]
        }
      }
    }
  }
  return obj as ICreateAuctionCycleOutput;
}
type Admin = { role: string, admin_id: string };

export const replaceRoleNames = (arr: Admin[]): Admin[] => {
  const conversions: Record<string, string> = {
    "manager": "planner",
    "auctionOperator": "permits_allocator",
    "permitStrategist": "coordinator",
    "financeOfficer": "payment_collector",
    "permitDistributor": "permit_distributor"
  }
  for(let i = 0; i < arr.length; i++) {
    arr[i].role = conversions[arr[i].role] || arr[i].role;
  }
  return arr
}