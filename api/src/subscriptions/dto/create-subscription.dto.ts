import { Transform } from "class-transformer";
import { IsEnum, IsISO8601, isISO8601, IsNotEmpty, IsNumber, IsOptional, IsString, IsTimeZone } from "class-validator";
import { BillingInterval } from "@src/contracts/index.js";

export class CreateSubscriptionDto {

    @IsString()
    title: string

    @IsNumber()
    @Transform(({ value }) => Number(value))
    price: number

    @Transform(({ value }) => {
        const isValidDate = isISO8601(value, { strict: true, strictSeparator: true });
        if (!isValidDate) {
            throw new Error(`Property "start_date" should be a valid ISO8601 date string`);
        }
        return new Date(value);
    })
    @IsNotEmpty()
    startDate: Date;

    @Transform(({ value }) => {
        const isValidDate = isISO8601(value, { strict: true, strictSeparator: true });
        if (!isValidDate) {
            throw new Error(`Property "end_date" should be a valid ISO8601 date string`);
        }
        return new Date(value);
    })
    @IsNotEmpty()
    endDate: Date;

    @IsEnum(BillingInterval, {message: "Invalid billing interval type"})
    billingInterval : BillingInterval

    @IsString()
    currency: string

    @IsOptional()
    @IsTimeZone({ message: 'The provided timezone must be a valid IANA timezone identifier.' })
    timezone: string;

}