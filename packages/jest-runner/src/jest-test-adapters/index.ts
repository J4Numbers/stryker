import { Logger } from '@stryker-mutator/api/logging';
import { BaseContext, commonTokens, Injector, tokens } from '@stryker-mutator/api/plugin';
import semver from 'semver';

import { jestVersion } from '../plugin-tokens';

import JestLessThan25TestAdapter from './jest-less-than-25-adapter';
import JestGreaterThan25TestAdapter from './jest-greater-than-25-adapter';
import { JestTestAdapter } from './jest-test-adapter';

export function jestTestAdapterFactory(log: Logger, jestVersion: string, injector: Injector<BaseContext>) {
  if (semver.satisfies(jestVersion, '<22.0.0')) {
    log.debug('Detected Jest below 22.0.0: %s', jestVersion);
    throw new Error('You need Jest version >= 22.0.0 to use Stryker');
  } else if (semver.satisfies(jestVersion, '<25.0.0')) {
    return injector.injectClass(JestLessThan25TestAdapter);
  } else {
    return injector.injectClass(JestGreaterThan25TestAdapter);
  }
}

jestTestAdapterFactory.inject = tokens(commonTokens.logger, jestVersion, commonTokens.injector);
export { JestTestAdapter };
