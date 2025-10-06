import { array, object, string, InferOutput } from 'valibot';
import { PositiveNumberSchema } from '@/schema/utils';

const OnboardingDataSchema = object({
  name: string(),
  phone: string(),
  email: string(),
  image: string(),
  sectors: array(string()),
  application: object({
    crn: PositiveNumberSchema(true),
    rep_name: string(),
    rep_position: string(),
    address: string(),
    websites: array(string()),
    status: string()
  })
});

export const DefaultOnboardingData: IOnboardingData = {
  "name": "",
  "phone": "",
  "email": "",
  "image": "",
  "sectors": [],
  "application": {
    "crn": 0,
    "rep_name": "",
    "rep_position": "",
    "address": "",
    "websites": [],
    "status": "pending"
  }
}

export interface IOnboardingData extends InferOutput<typeof OnboardingDataSchema> { }