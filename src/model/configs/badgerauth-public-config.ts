import { CS571DefaultPublicConfig } from "@cs571/s24-api-framework";

export default interface BadgerAuthPublicConfig extends CS571DefaultPublicConfig {
    ENABLE_CAPTCHA: boolean;
    IS_REMOTELY_HOSTED: boolean;
    IS_WISC_ONLY: boolean;
}