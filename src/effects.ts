import { User } from "koishi"
import { FishingMath } from "./math"

export namespace Effect{

    interface Stages{
        failure_rate:(rate:FishingMath.Variable)=>void,
        fished:(user:User)=>void
        item:()=>void
    }

    interface FishingEffect<S extends keyof Stages>{
        stage:string,
        name:string,
        description:string,
        apply(level:number,...param:Parameters<Stages[S]>):ReturnType<Stages[S]>
        priority?:number
        unit?:string,
    }

    function defineEffect<S extends keyof Stages>(stage:S,name:string,description:string,apply:(level:number,...param:Parameters<Stages[S]>)=>ReturnType<Stages[S]>,priority?:number,unit?:string):FishingEffect<S>{
        return {
            stage,
            name,
            description,
            apply,
            priority,
            unit
        }
    }
    
    export const PresetEffects : Record<string,FishingEffect<any>> = {
        'fishing:rod_reduce_failure':defineEffect('failure_rate','降低失败率','降低钓鱼过程中失败的概率',(level,rate)=>rate.multipy(1*(level/100)),0,'%'),
        'fishing:rod_failure_curse':defineEffect('failure_rate','失败诅咒','使用此钓竿会增加钓鱼过程中的失败风险',(level,rate)=>rate.multipy(1-(level/100)),1,'%'),
        'fishing:rod_reduce_hp_cost':defineEffect('fished','降低体力消耗','能更轻松地使用这个鱼竿钓到大鱼',()=>null),
        'fishing:rod_hp_recover':defineEffect('fished','体力恢复','使用此钓竿钓鱼，有几率恢复体力',()=>null),
        'fishing:rod_status_recover':defineEffect('fished','心情恢复','使用此钓竿钓鱼，有几率恢复心情',()=>null),
        'fishing:rod_rare':defineEffect('item','稀有物品概率提升','使用该物品钓鱼，可增加稀有物品掉落几率',()=>null)
    }

    export function applyEffects<S extends keyof Stages>(name:S,effects:Record<string,number>,...params:Parameters<Stages[S]>):ReturnType<Stages[S]>[]{
        return Object.entries(effects).filter(effect=>PresetEffects[effect[0]]).sort(([value,name],[value1,name1])=>(PresetEffects[name].priority??0) - (PresetEffects[name1].priority??0)).map(effect=>PresetEffects[effect[0]].apply(effect[1],params))
    }
    export function appliesEffects<S extends keyof Stages>(name:S,effects_array:Record<string,number>[],...params:Parameters<Stages[S]>):ReturnType<Stages[S]>[]{
        return effects_array.filter(t=>typeof t == 'object').map(effects=>Object.entries(effects)).flat().filter(effect=>PresetEffects[effect[0]]).sort(([value,name],[value1,name1])=>(PresetEffects[name].priority??0) - (PresetEffects[name1].priority??0)).map(effect=>PresetEffects[effect[0]].apply(effect[1],params))
    }
}