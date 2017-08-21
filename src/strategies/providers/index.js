/* @flow */
import strategyFallback from './fallback'
import strategyNoFallback from './no-fallback'
import strategyRoundrobin from './roundrobin'
// Types
import type {ProviderType, ChannelOptionsType} from '../../providers'
import type {ChannelType} from '../../index'

export type StrategyType = (providers: ProviderType[]) => (request: any) => Promise<{
  providerId: string,
  id: string
}>
export type StrategiesType = {[ChannelType]: StrategyType}

const providerStrategies = {
  fallback: strategyFallback,
  'no-fallback': strategyNoFallback,
  roundrobin: strategyRoundrobin
}

export default function factory (channels: ChannelOptionsType): StrategiesType {
  return Object.keys(channels).reduce((acc, key: ChannelType): StrategiesType => {
    const optionStrategy = (channels[key]: any).multiProviderStrategy
    if (typeof optionStrategy === 'function') {
      acc[key] = optionStrategy
    } else if (Object.keys(providerStrategies).includes(optionStrategy)) {
      acc[key] = providerStrategies[optionStrategy]
    } else {
      throw new Error(`"${optionStrategy}" is not a valid strategy. Strategy must be a funtion or fallback|roundrobin|no-fallback.`)
    }
    return acc
  }, {})
}
