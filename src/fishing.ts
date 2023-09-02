import { Context, Session } from "koishi";
import { Rod } from "./rod";
import { FishingStatus } from "./status";
import { FishingPool } from "./pool";
import { Effect } from "./effects";
import { FishingMath } from "./math";

export namespace NormalFishing{
    function calcuateFishingContantSuccessRate(status:FishingStatus.Status,rod:Rod.RodData,pool:FishingPool.Pool):number{
        // 计算常值成功率，返回0~100的正整数
        const effect_rate = new FishingMath.Variable(1);
        Effect.appliesEffects('failure_rate',[status.effects,rod.effects],effect_rate)
        return Math.min(Math.max(( 1 + status.status * 0.1 ) * ( Math.min(status.hp/50+0.01,1) ) * (effect_rate.toNumber()) * (1-pool.failure),0.01),1);
    }

    function calcuateFishingSuccessRate(constant:number,time_difference:number):number{
        // 计算最终成功率，返回0~100的正整数
        return 0;
    }

    async function runFishFinish(timestmap:number,rod:Rod.RodData){
        // 第一步，计算成功率
    }

    async function getPoolInstance(pool_id?:string){
        if(!pool_id)
            pool_id = 'default';
        return FishingPool.PublicPools.get(pool_id) ?? await getPrivatePool(pool_id)
    }

    export async function getPrivatePool(pool_id:string):Promise<FishingPool.Pool>|null{
        return null;
    }

    export async function checkUser(session:Session<any>){
        if(!session.user){
            // This code should never been run.
            throw new Error('Unable to get user inforamtion. Please contract developer or send a issue. It may a **bug**.')
        }
    }

    export async function setPool(session:Session<'fishing_status',any>,pool_id?:string){
        checkUser(session);
        const pool = await getPoolInstance(pool_id);
        if(!pool){
            await session.send('无法找到鱼池,请检查输入是否正确')
            return;
        }
        const status = FishingStatus.deserialize(session.user.fishing_status)
        if(status.pool == (pool_id ?? 'default')){
            await session.send('你已经在【'+pool.name+'】了！')
            //return 
        }
        const distance = FishingPool.calcuateDistanceFromPosition(status.position,pool);
        if(status.hp < distance){
            await session.send('体力不足!需要额外的'+(distance - status.hp)+'体力才能到达【'+pool.name+'】')
            return;
        }
        status.hp = status.hp - distance;
        status.pool = (pool_id ?? 'default');
        status.position = pool.position;
        session.user.fishing_status = FishingStatus.serialize(status);
        await session.send("体力消耗了 "+distance+" 点\n你到达了【 "+pool.name+" 】")
        return;
    }

    export async function fish(ctx:Context,session:Session<'fishing_status',any>){
        checkUser(session);
        const status = FishingStatus.deserialize(session.user.fishing_status)
        const pool = await getPoolInstance(status.pool)
        console.info(pool)
        // @todo : limit the player to fish in a single place
        if(!pool.fishable){
            await session.send('该地点暂时不能钓鱼。');
            return
        }
        if(status.hp<20){
            await session.send('你的体力不足以钓鱼，请等待体力恢复或补充体力。');
            return
        }
        const constantFailureRate = calcuateFishingContantSuccessRate(status,{},pool);
        let message = '您已经开始在【 '+pool.name+' 】钓鱼\n';
        message += '体力 降低了 '+ Math.min(pool.hp_cost,status.hp)+"\n"
        console.info(constantFailureRate)
        message += '失败率 ' + Math.round((1-constantFailureRate)*100)+"%\n"
        message += '在若干秒后，机器人将at你并提示“鱼上钩了”，此时你需要回复“起杆”，时间间隔越小成功率越高！'
        await session.send(message)
        status.hp = Math.max(0,status.hp - pool.hp_cost); // @todo: hp_cost effects
        session.user.fishing_status = FishingStatus.serialize(status);
    }
}