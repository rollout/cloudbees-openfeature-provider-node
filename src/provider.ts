import {EvaluationContext, Provider, ResolutionDetails} from '@openfeature/nodejs-sdk'
import Rox, {RoxSetupOptions} from 'rox-node'

/**
 * The CloudBees Provider will use CloudBees Feature Management to evaluate flags.
 *
 * Use <code>OpenFeature.setProvider(await CloudbeesProvider.build(APP_KEY))</code> to register the provider.
 */
export class CloudbeesProvider implements Provider {
  static async build(appKey: string, options: RoxSetupOptions = {}): Promise<CloudbeesProvider> {
    await Rox.setup(appKey, options)
    return new CloudbeesProvider()
    // Todo. Rox is a singleton, so we need to protect against people trying to instantiate this twice
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {} // Rox.setup is async. Force the use of the build method to asynchronously construct the provider.

  readonly metadata = {
    name: 'CloudBees Feature Management Provider',
  } as const;

  resolveBooleanEvaluation(flagKey: string, defaultValue: boolean, context: EvaluationContext): Promise<ResolutionDetails<boolean>> {
    return Promise.resolve({value: Rox.dynamicApi.isEnabled(flagKey, defaultValue, context)})
  }

  resolveStringEvaluation(flagKey: string, defaultValue: string, context: EvaluationContext): Promise<ResolutionDetails<string>> {
    return Promise.resolve({value: Rox.dynamicApi.value(flagKey, defaultValue, context)})
  }

  resolveNumberEvaluation(flagKey: string, defaultValue: number, context: EvaluationContext): Promise<ResolutionDetails<number>> {
    return Promise.resolve({value: Rox.dynamicApi.getNumber(flagKey, defaultValue, context)})
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  resolveObjectEvaluation<T extends object>(flagKey: string, defaultValue: T, context: EvaluationContext): Promise<ResolutionDetails<T>> {
    return Promise.reject('Not implemented - CloudBees feature management does not support an object type. Only String, Number and Boolean')
  }
}
