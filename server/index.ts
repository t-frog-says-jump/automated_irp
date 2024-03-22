import { PluginInitializerContext } from '../../../src/core/server';
import { AutomatedIrpPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, OpenSearch Dashboards Platform `plugin()` initializer.

export function plugin(initializerContext: PluginInitializerContext) {
  return new AutomatedIrpPlugin(initializerContext);
}

export { AutomatedIrpPluginSetup, AutomatedIrpPluginStart } from './types';
