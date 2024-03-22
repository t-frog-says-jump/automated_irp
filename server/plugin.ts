import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
} from '../../../src/core/server';

import { AutomatedIrpPluginSetup, AutomatedIrpPluginStart } from './types';
import { defineRoutes } from './routes';

export class AutomatedIrpPlugin
  implements Plugin<AutomatedIrpPluginSetup, AutomatedIrpPluginStart> {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public setup(core: CoreSetup) {
    this.logger.debug('automated_irp: Setup');
    const router = core.http.createRouter();

    // Register server side APIs
    defineRoutes(router);

    return {};
  }

  public start(core: CoreStart) {
    this.logger.debug('automated_irp: Started');
    return {};
  }

  public stop() {}
}
