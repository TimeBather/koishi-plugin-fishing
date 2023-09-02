import { Context } from "koishi";
import { NormalFishing } from "./fishing";

export namespace FishingCommand{
    export async function init(ctx:Context){
        ctx.command('fishing.pool.set <pool:string>')
            .alias('切换鱼池')
            .userFields(['fishing_status'])
            .action(async (argv,pool)=>{
                await NormalFishing.setPool(argv.session,pool);
            })
        
        ctx.command('fishing.fish')
            .alias('钓鱼')
            .userFields(['fishing_status'])
            .action(async (argv)=>{
                await NormalFishing.fish(ctx,argv.session);
            })
    }
}