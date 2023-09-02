import { Context, Schema } from 'koishi'
import {} from 'koishi-plugin-item';
import { Rod } from './rod';
export const name = 'fishing'

import { FishingConfig } from './config';
import { FishingPool } from './pool';
import { FishingCommand } from './command';
import { FishingDatabase } from './database';

export const Config: Schema<Config> = FishingConfig.Config

export interface Config extends FishingConfig.Config{

}

export const using = ['item']

export function apply(ctx: Context,config: Config) {
  config.pools.forEach(pool=>{
    FishingPool.PublicPools.set(pool.id,pool);
  })
  FishingDatabase.init(ctx);
  FishingCommand.init(ctx);
  Rod.initRod(ctx);
}