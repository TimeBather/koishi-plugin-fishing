import { Context, Tables } from "koishi";
export namespace FishingDatabase{
    export async function init(ctx:Context){
        ctx.database.extend('user',{
            fishing_status:'text'
        })
    }
}
declare module 'koishi'{
    interface User{
        fishing_status:string
    }
}