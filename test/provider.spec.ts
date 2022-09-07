import {CloudbeesProvider} from '../src'
import {Client, OpenFeature} from '@openfeature/nodejs-sdk'

describe('Cloudbees Provider', () => {
  it('invalid creation', async () => {
    await expect(CloudbeesProvider.build('')).rejects.toThrow('invalid rollout apikey')
  })

  describe('integration tests', () => {
    let client: Client

    beforeAll(async () => {
      const APP_KEY = '62bee5bbca1059d18808adad' // CloudBees Provider test Data appKey
      OpenFeature.setProvider(await CloudbeesProvider.build(APP_KEY));
      client = OpenFeature.getClient();
    })

    describe('boolean flags', () => {
      it('with targeting on', async () => {
        await expect(client.getBooleanValue('boolean-static-true', false)).resolves.toBe(true)
        await expect(client.getBooleanValue('boolean-static-false', true)).resolves.toBe(false)
      })

      it('with targeting off', async () => {
        await expect(client.getBooleanValue('boolean-disabled', false)).resolves.toBe(false)
        await expect(client.getBooleanValue('boolean-disabled', true)).resolves.toBe(true)
      })

      it('using a context', async () => {
        await expect(client.getBooleanValue('boolean-with-context', false, {stringproperty: 'on'})).resolves.toBe(true)
        await expect(client.getBooleanValue('boolean-with-context', false, {stringproperty: 'off'})).resolves.toBe(false)
      })
    })

    describe('string flags', () => {
      it('with targeting on', async () => {
        await expect(client.getStringValue('string-static-yes', 'default')).resolves.toBe('yes')
        await expect(client.getStringValue('string-static-no', 'default')).resolves.toBe('no')
      })

      it('with targeting off', async () => {
        await expect(client.getStringValue('string-disabled', 'banana')).resolves.toBe('banana')
      })

      it('using a context', async () => {
        await expect(client.getStringValue('string-with-context', 'default', {stringproperty: 'on'})).resolves.toBe('yes')
        await expect(client.getStringValue('string-with-context', 'default', {stringproperty: 'off'})).resolves.toBe('no')
        await expect(client.getStringValue('string-with-context', 'default', {not_defined: 'whatever'})).resolves.toBe('not specified')
        await expect(client.getStringValue('string-with-context', 'default', {})).resolves.toBe('not specified')
        await expect(client.getStringValue('string-with-context', 'default')).resolves.toBe('not specified')
      })
    })

    describe('number flags', () => {
      it('with targeting on', async () => {
        await expect(client.getNumberValue('string-static-5', 5)).resolves.toBe(5)
      })

      it('with targeting off', async () => {
        await expect(client.getNumberValue('string-disabled', 7)).resolves.toBe(7)
      })

      it('using a context', async () => {
        await expect(client.getNumberValue('integer-with-context', -1, {stringproperty: '1'})).resolves.toBe(1)
        await expect(client.getNumberValue('integer-with-context', -1, {stringproperty: '5'})).resolves.toBe(5)
        await expect(client.getNumberValue('integer-with-context', -1, {not_defined: 'whatever'})).resolves.toBe(10)
        await expect(client.getNumberValue('integer-with-context', -1, {})).resolves.toBe(10)
        await expect(client.getNumberValue('integer-with-context', -1)).resolves.toBe(10)
      })
    })

    describe('object flags', () => {
      it('test we do not support these types of flag', async () => {
        await expect(client.getObjectDetails('not-supported', {a: 'b'})).resolves.toEqual({
          errorCode: 'GENERAL_ERROR',
          flagKey: 'not-supported',
          reason: 'ERROR',
          value: {a: 'b'},
        })
      })
    })

    describe('flags with differently typed context values', () => {
      it('positive matches for supported types (string/number/boolean)', async () => {
        // // Test positive matches for supported types (string/number/boolean)
        await expect(client.getNumberValue('integer-with-complex-context', -1, {stringproperty: 'one'})).resolves.toBe(1)
        await expect(client.getNumberValue('integer-with-complex-context', -1, {numberproperty: 1})).resolves.toBe(1)
        await expect(client.getNumberValue('integer-with-complex-context', -1, {booleanproperty: true})).resolves.toBe(1)
      })

      it('negative matches for supported types (string/number/boolean) - it should serve the default value', async () => {
        await expect(client.getNumberValue('integer-with-complex-context', -1, {stringproperty: 'no'})).resolves.toBe(-1)
        await expect(client.getNumberValue('integer-with-complex-context', -1, {numberproperty: 0})).resolves.toBe(-1)
        await expect(client.getNumberValue('integer-with-complex-context', -1, {booleanproperty: false})).resolves.toBe(-1)

        // Unexpected/unsupported contexts
        await expect(client.getNumberValue('integer-with-complex-context', -1, {badproperty: 'whatever'})).resolves.toBe(-1)
        await expect(client.getNumberValue('integer-with-complex-context', -1, {stringproperty: []})).resolves.toBe(-1)
        await expect(client.getNumberValue('integer-with-complex-context', -1, {stringproperty: {}})).resolves.toBe(-1)
        await expect(client.getNumberValue('integer-with-complex-context', -1, {stringproperty: 1})).resolves.toBe(-1)
      })
    })
  })
})
