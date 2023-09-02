import { Schema } from "koishi";
import { FishingPool } from "./pool";

export namespace FishingConfig{
    export interface Config{
        pools:FishingPool.Pool[]
    }
    export const Config : Schema<Config> = Schema.object({
        pools:Schema.array(FishingPool.Pool).default([
            FishingPool.DefaultFallbackPool
        ]).description('通用鱼池设定')
    })
}