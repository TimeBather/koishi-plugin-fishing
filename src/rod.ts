import { Context } from "koishi";
import { ItemStack,ItemContainer } from "koishi-plugin-item";

export namespace Rod{
    
    export class BackpackContainer extends ItemContainer{
        constructor(protected ctx:Context,protected title:string = "物品栏"){
            super(ctx,'鱼竿仓库',100);
        }
    }

    export function initRod(ctx:Context){
        ctx.item.itemRegistry.register('fishing:rod',{
            stacksTo:1,
            displayName:(item:ItemStack)=>((item.data as RodData)?.displayName ?? '鱼竿'),
            create:(count)=>({
                id:'fishing:rod',
                count:count ?? 1
            })
        })
    }
    
    export interface RodData{
        displayName?:string
        effects?:Record<string,number>
    }
}