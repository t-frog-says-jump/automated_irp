import './index.scss';

import { AutomatedIrpPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, OpenSearch Dashboards Platform `plugin()` initializer.
export function plugin() {
  return new AutomatedIrpPlugin();
}
export { AutomatedIrpPluginSetup, AutomatedIrpPluginStart } from './types';
