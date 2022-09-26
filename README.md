# cloudbees-openfeature-provider-node

[![Project Status: WIP – Initial development is in progress, but there has not yet been a stable, usable release suitable for the public.](https://www.repostatus.org/badges/latest/wip.svg)](https://www.repostatus.org/#wip)
[![a](https://img.shields.io/badge/slack-%40cncf%2Fopenfeature-brightgreen?style=flat&logo=slack)](https://cloud-native.slack.com/archives/C0344AANLA1)
[![OpenFeature Specification](https://img.shields.io/static/v1?label=OpenFeature%20Specification&message=v0.4.0&color=yellow)](https://github.com/open-feature/spec/tree/v0.4.0)
[![OpenFeature SDK](https://img.shields.io/static/v1?label=OpenFeature%20SDK&message=v0.4.0&color=green)](https://github.com/open-feature/js-sdk)
[![npm version](https://badge.fury.io/js/cloudbees-openfeature-provider-node.svg)](https://badge.fury.io/js/cloudbees-openfeature-provider-node)
[![CloudBees Rox SDK](https://img.shields.io/static/v1?label=Rox%20SDK&message=v5.4.1&color=green)](https://www.npmjs.com/package/rox-node)
[![Known Vulnerabilities](https://snyk.io/test/github/rollout/cloudbees-openfeature-provider-node/badge.svg)](https://snyk.io/test/github/rollout/cloudbees-openfeature-provider-node)

This is the [CloudBees](https://www.cloudbees.com/products/feature-management) provider implementation for [OpenFeature](https://openfeature.dev/) for the [Javascript SDK](https://github.com/open-feature/js-sdk).

OpenFeature provides a vendor-agnostic abstraction layer on Feature Flag management.

This provider allows the use of CloudBees Feature Management as a backend for Feature Flag configurations.

## Requirements
- node 14 or greater

## Installation

### Add it to your build

```bash
npm install cloudbees-openfeature-provider-node
```
or
```bash
yarn add cloudbees-openfeature-provider-node
```

### Configuration

Follow the instructions on the [Javascript SDK project](https://github.com/open-feature/js-sdk) for how to use the Javascript SDK.

You can configure the CloudBees provider by doing the following:

```typescript
import {OpenFeature} from '@openfeature/js-sdk';
import {CloudbeesProvider} from 'cloudbees-openfeature-provider-node'

const appKey = 'INSERT_APP_KEY_HERE'
OpenFeature.setProvider(await CloudbeesProvider.build(appKey));
const client = OpenFeature.getClient();
const value = await client.getBooleanValue('enabled-new-feature', false);
```
