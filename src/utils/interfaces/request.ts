import { Request } from "express";

export interface TypedRequestBody<T> extends Request {
    body: T
}

export interface ClientCreateBody {
    internalId: Number,
    companyName: String,
    taxId: String,
    currencyId: Number,
    monthlyQuota: Number,
    bankRegistry: Array<Number>
}