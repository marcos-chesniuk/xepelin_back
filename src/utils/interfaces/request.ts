import { Request } from "express";

export interface TypedRequestBody<T> extends Request {
    body: T
};

export interface ClientCreateBody {
    internalCode: number,
    companyName: string,
    taxId: string,
    currencyId: number,
    monthlyQuota: number,
    bankRegistry: Array<number>
};

export interface ClientEditBody {
    taxId: string,
    currencyId: number
};
