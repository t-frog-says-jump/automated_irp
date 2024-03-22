import { NavigationPublicPluginStart } from '../../../src/plugins/navigation/public';

export interface AutomatedIrpPluginSetup {
  getGreeting: () => string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AutomatedIrpPluginStart {}

export interface AppPluginStartDependencies {
  navigation: NavigationPublicPluginStart;
}
