import {
	InferOutput,
	nonEmpty,
	nullish,
	object,
	pipe,
	string,
	trim,
} from 'valibot';

import { PositiveNumberSchema, TimestampSchema, UuidSchema } from '@/schema/utils';

export const SMApprovalAdminDataSchema = object({
	id: PositiveNumberSchema(),
	emissionId: PositiveNumberSchema(),
	fromFirmId: UuidSchema(),
	toFirmId: UuidSchema(),
	qty: PositiveNumberSchema(),
	status: pipe(string(), trim(), nonEmpty()),
	createdAt: nullish(TimestampSchema()),
	decidedAt: nullish(TimestampSchema()),
	decidedBy: UuidSchema(),
	notes: nullish(pipe(string(), trim())),
	decisionNotes: nullish(pipe(string(), trim())),
	actorFirmUserId: UuidSchema(),
	actorAdminId: UuidSchema(),
});

export interface ISMApprovalAdminData extends InferOutput<typeof SMApprovalAdminDataSchema> { }

export const DefaultSMApprovalAdminData: ISMApprovalAdminData = {
	id: 0,
	emissionId: 0,
	fromFirmId: '',
	toFirmId: '',
	qty: 0,
	status: 'pending',
	createdAt: null,
	decidedAt: null,
	decidedBy: '',
	notes: null,
	decisionNotes: null,
	actorFirmUserId: '',
	actorAdminId: '',
};
