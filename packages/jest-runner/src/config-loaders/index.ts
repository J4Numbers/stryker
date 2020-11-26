import { tokens, commonTokens, Injector, PluginContext } from '@stryker-mutator/api/plugin';
import { StrykerOptions } from '@stryker-mutator/api/core';
import { Logger } from '@stryker-mutator/api/logging';

import { JestRunnerOptionsWithStrykerOptions } from '../jest-runner-options-with-stryker-options';
import { loader, resolve, projectRoot } from '../plugin-tokens';

import CustomJestConfigLoader from './custom-jest-config-loader';
import ReactScriptsJestConfigLoader from './react-scripts-jest-config-loader';
import ReactScriptsTSJestConfigLoader from './react-scripts-ts-jest-config-loader';

configLoaderFactory.inject = tokens(commonTokens.options, commonTokens.injector, commonTokens.logger);
export function configLoaderFactory(options: StrykerOptions, injector: Injector<PluginContext>, log: Logger) {
  const warnAboutConfigFile = (projectType: string, configFile: string | undefined) => {
    if (configFile) {
      log.warn(`Config setting "configFile" is not supported for projectType "${projectType}"`);
    }
  };
  const optionsWithJest: JestRunnerOptionsWithStrykerOptions = options as JestRunnerOptionsWithStrykerOptions;

  const configLoaderInjector = injector.provideValue(loader, require).provideValue(resolve, require.resolve).provideValue(projectRoot, process.cwd());

  switch (optionsWithJest.jest.projectType) {
    case 'custom':
      return configLoaderInjector.injectClass(CustomJestConfigLoader);
    case 'create-react-app':
      warnAboutConfigFile(optionsWithJest.jest.projectType, optionsWithJest.jest.configFile);
      return configLoaderInjector.injectClass(ReactScriptsJestConfigLoader);
    case 'create-react-app-ts':
      warnAboutConfigFile(optionsWithJest.jest.projectType, optionsWithJest.jest.configFile);
      return configLoaderInjector.injectClass(ReactScriptsTSJestConfigLoader);
    default:
      throw new Error(`No configLoader available for ${optionsWithJest.jest.projectType}`);
  }
}
