import { Schema } from "koishi"
import { Config } from "koishi-plugin-item"

export namespace FishingPool{

    export interface Pool{
        id: string,
        name:string
        items:Record<string,number> // 概率
        fishable:boolean, // 是否允许捕鱼
        failure:number // 常数失败率
        hp_cost:number // 体力消耗
        position: [number,number] // XY坐标，1距离=1体力消耗，使用街区算法确定最终体力消耗
    }

    export const Pool : Schema<Pool> = Schema.object({
        id:Schema.string().default('default'),
        name:Schema.string().default('默认鱼池'),
        items:Schema.dict(Schema.number().max(100).min(0)).default({}),
        fishable:Schema.boolean().default(false),
        failure:Schema.number().min(0).max(100).default(0),
        hp_cost:Schema.number().default(10),
        position:Schema.tuple([
            Schema.number(),
            Schema.number()
        ]) as any
    })

    export const DefaultFallbackPool : Pool = {
        id : 'default',
        name : '默认鱼池',
        items : {},
        fishable:false,
        failure: 0,
        hp_cost:0,
        position: [0,0]
    }

    function probabilityNormailze(pool:Pool):Pool{
        let total_probability = 0;
        Object.keys(pool.items).forEach(key=>{
            total_probability += pool.items[key];
        })
        if(total_probability>100){
            Object.keys(pool.items).forEach(key=>{
                pool.items[key] = (pool.items[key] *100) / total_probability;
            })
        }
        return pool;
    }

    export function calcuateDistance(current:Pool,target:Pool):number{
        return Math.abs(current.position[0]-target.position[0])+Math.abs(current.position[1]-target.position[1])
    }

    export function calcuateDistanceFromPosition(current:[number,number],target:Pool):number{
        return Math.abs(current[0]-target.position[0])+Math.abs(current[1]-target.position[1])
    }

    function getItem(pool:Pool){
        let rand = Math.random()*100;
        for(let item in pool.items){
            rand -= pool.items[item];
            if(rand <= 0){
                return item;
            }
        }
    }

    export const PublicPools : Map<string,FishingPool.Pool> = new Map();
}