import { Schema } from "koishi";

export namespace FishingStatus{
    export interface Status{
        effects:Record<string,number> // 获得的效果
        status: number // 状态 0~5
        hp:number // 体力 0~100
        pool:string
        position:[number,number]
    }

    const Status : Schema<Status> = Schema.object({
        effects:Schema.dict(Schema.number()).default({}),
        status:Schema.number().min(-2).max(2).default(0),
        hp:Schema.number().min(0).max(100).default(100),
        pool:Schema.string(),
        position:Schema.tuple([
            Schema.number(),
            Schema.number()
        ]).default([0,0]) as any
    })
    
    export function serialize(status:Status){
        return JSON.stringify(status);
    }

    export function deserialize(data:string):Status{
        let status = null;
        try{
            status = Status(JSON.parse(data));
        }catch(e){}
        return status ?? {
            effects:{},
            status:0,
            pool:'default',
            hp:100,
            position:[0,0]
        }
    }
}
