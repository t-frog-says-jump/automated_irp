import React, { useState } from 'react';
import { i18n } from '@osd/i18n';
import { FormattedMessage, I18nProvider } from '@osd/i18n/react';
import { BrowserRouter as Router } from 'react-router-dom';

import {
  EuiButton,
  EuiHorizontalRule,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageHeader,
  EuiTitle,
  EuiFilePicker,
  EuiPopover,
  EuiForm,
  EuiFormRow,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
  EuiDescribedFormGroup,
  EuiCheckboxGroup,
} from '@elastic/eui';

import { CoreStart } from '../../../../src/core/public';
import { NavigationPublicPluginStart } from '../../../../src/plugins/navigation/public';

import { PLUGIN_ID, PLUGIN_NAME } from '../../common';

interface AutomatedIrpAppDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
}

export const AutomatedIrpApp = ({
  basename,
  notifications,
  http,
  navigation,
}: AutomatedIrpAppDeps) => {

  const artefact_type = ["activitiescache", "amcache.applaunches", "amcache.application_files", "amcache.applications",
  "amcache.device_containers", "amcache.drivers", "amcache.files", "amcache.programs", "amcache.shortcuts",
  "catroot", "cim.consumerbindings", "defender.evtx", "defender.exclusions", "defender.quarantine",
  "defender.recover", "environment_variables", "path_extensions", "exchange.transport_agents",
  "alternateshell", "appinit", "bootshell", "commandprocautorun", "filerenameop",
  "knowndlls", "ndis", "nullsessionpipes", "pathenvironment", "sessionmanager", "winrar", "winsocknamespaceprovider",
  "lnk", "keyboard", "amcache_install", "etl.boot", "etl.etl", "etl.shutdown", "evt", "scraped_evt", "evtx",
  "scraped_evtx", "pfro", "notifications.appdb", "notifications.wpndatabase", "prefetch", "recyclebin", "sevenzip", "appxdebugkeys",
  "auditpol", "bam", "cit.cit", "cit.dp", "cit.modules", "cit.puu", "cit.telemetry", "clsid.machine", "clsid.user", "firewall", "mru.acmru",
  "mru.lastvisited", "mru.msoffice", "mru.mstsc", "mru.networkdrive", "mru.opensave", "mru.recentdocs", "mru.run", "muicache",
  "network_history", "recentfilecache", "regf", "runkeys", "shellbags", "shimcache", "trusteddocs", "usb", "userassist", "sam", "services",
  "sru.application", "sru.application_timeline", "sru.energy_estimator", "sru.energy_usage", "sru.energy_usage_lt",
  "sru.network_connectivity", "sru.network_data", "sru.push_notification", "sru.sdp_cpu_provider", "sru.sdp_network_provider",
  "sru.sdp_physical_disk_provider", "sru.sdp_volume_provider", "sru.vfu", "startupinfo", "syscache", "tasks", "thumbcache.iconcache",
  "thumbcache.thumbcache", "ual.client_access", "ual.domains_seen", "ual.role_access", "ual.system_identities", "ual.virtual_machines", "wer",
  "mcafee.msc", "sophos.hitmanlogs", "sophos.sophoshomelogs", "symantec.firewall", "symantec.logs", "trendmicro.wffirewall", "trendmicro.wflogs",
  "docker.containers", "docker.images", "anydesk.logs", "remoteaccess.logs", "teamviewer.logs", "powershell_history", "ssh.authorized_keys", 
  "ssh.known_hosts", "ssh.private_keys", "ssh.public_keys", "sshd.config", "openvpn.config", "wireguard.config", "cpanel.lastlogin", "apache.access", 
  "caddy.access", "iis.access", "iis.logs", "nginx.access", "webserver.access", "webserver.logs", "browser.downloads", "browser.extensions", 
  "browser.history", "chrome.downloads", "chrome.extensions", "chrome.history", "chromium.downloads", "chromium.extensions", "chromium.history", 
  "edge.downloads", "edge.extensions", "edge.history", "firefox.downloads", "firefox.history", "iexplore.downloads", "iexplore.history", "acquire_handles", 
  "acquire_hashes", "mft", "usnjrnl"].sort((a, b) => a.localeCompare(b));

  const default_profil = {[String("defender.evtx")]: true, [String("defender.exclusions")]: true, [String("defender.quarantine")]: true, 
  [String("defender.recover")]: true, [String("environment_variables")]: true, [String("pathenvironment")]: true, 
  [String("evt")]: true, [String("evtx")]: true, [String("runkeys")]: true, [String("powershell_history")]: true, 
  [String("usnjrnl")]: true, [String("usb")]: true, [String("tasks")]: true, [String("startupinfo")]: true, 
  [String("docker.containers")]: true, [String("docker.images")]: true, [String("webserver.access")]: true, 
  [String("webserver.logs")]: true, [String("browser.downloads")]: true, [String("browser.extensions")]: true, 
  [String("browser.history")]: true, [String("chrome.downloads")]: true, [String("chrome.extensions")]: true, 
  [String("chrome.history")]: true, [String("chromium.downloads")]: true, [String("chromium.extensions")]: true, 
  [String("chromium.history")]: true, [String("edge.downloads")]: true, [String("edge.extensions")]: true, 
  [String("edge.history")]: true, [String("firefox.downloads")]: true, [String("firefox.history")]: true, 
  [String("iexplore.downloads")]: true, [String("iexplore.history")]: true}

  const [shuffleIp, setShuffleIp] = useState("shuffle.shuffle.svc.cluster.local");
  const [workflow_id, setWorkflowId] = useState("");
  const [files, setFiles] = useState(Array({}));

  const [shuffleIpTemp, setShuffleIpTemp] = useState("");
  const [workflowIdTemp, setWorkflowIdTemp] = useState("");

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isPopoverOpenArt, setIsPopoverOpenArt] = useState(false);

  const onButtonClick = () => {
    setIsPopoverOpen(!isPopoverOpen);
  };

  const closePopover = () => {
    setIsPopoverOpen(false);
  };

  const onButtonClickArt = () => {
    setIsPopoverOpenArt(!isPopoverOpenArt);
  };

  const closePopoverArt = () => {
    setIsPopoverOpenArt(false);
  };

  const button = (
    <EuiButton
      iconSide="right"
      fill
      iconType="arrowDown"
      onClick={onButtonClick}
    >
      Изменить данные Shuffle
    </EuiButton>
  );

  const buttonArt = (
    <EuiButton
      iconSide="right"
      fill
      size = "s"
      iconType="arrowDown"
      onClick={onButtonClickArt}
    >
      Артефакты
    </EuiButton>
  );

  function validate_data(data: string, re: RegExp, mes: string, format: any){
    if (data != '')
      if (re.test(data)){

        format(data);
        notifications.toasts.addSuccess(
        i18n.translate('automatedIrp.dataUpload', {
          defaultMessage: mes + ' обновлен: ' + data
        }))}
        
      else
        notifications.toasts.addDanger(
        i18n.translate('automatedIrp.dataDontUpload', {
          defaultMessage: 'Ошибка валидации ' + mes + ': ' + data
        }))

    return 
  }

  const onClickSave = () => {    

    let re_ip = new RegExp('(^([0-9]{1,3}\.){3}[0-9]{1,3}(:[0-9]{1,5})?$)|(^[a-zA-Z0-9][a-zA-Z0-9-_]{0,61}[a-zA-Z0-9]{0,1}\.([a-zA-Z]{1,6}|[a-zA-Z0-9-]{1,30}\.[a-zA-Z]{2,3})(:[0-9]{1,5})?$)|(^([a-zA-Z0-9-]{1,30}.){2}svc.cluster.local$)');
    let re_workflow = new RegExp('^webhook_[a-z0-9-]*$');

    validate_data(shuffleIpTemp, re_ip, "IP", setShuffleIp);
    validate_data(workflowIdTemp, re_workflow, "Workflow id", setWorkflowId);

    setShuffleIpTemp("")
    setWorkflowIdTemp("")

  }

  const formSample = (
    <EuiForm component="form">
      <EuiFlexGroup>
        <EuiFlexItem grow={false} style={{ width: 250 }}>
          <EuiFormRow label="IP Shuffle">
            <EuiFieldText id="automatedIrp.shuffleip" onChange={(e) => setShuffleIpTemp(e.target.value)} icon="ip" placeholder={ String(shuffleIp) }/>
          </EuiFormRow>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiFormRow label="Workflow id" style={{ width: 250 }}>
            <EuiFieldText id="automatedIrp.workflow_id" onChange={(e) => setWorkflowIdTemp(e.target.value)} icon="tokenKey" placeholder={ String(workflow_id) }/>
          </EuiFormRow>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiFormRow hasEmptyLabelSpace>
            <EuiButton onClick={() => onClickSave()}>Сохранить</EuiButton>
          </EuiFormRow>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiForm>
  );

  var artefact_list = []
  for ( let list_art of artefact_type){
    
    artefact_list.push({
                        id: list_art,
                        label: list_art,
                      })
  }

  const [checkboxIdToSelectedMap, setCheckboxIdToSelectedMap] = useState(default_profil);

  const onChangeArt = (optionId: string) => {
    const newCheckboxIdToSelectedMap = {
      ...checkboxIdToSelectedMap,
      ...{
        [optionId]: optionId in checkboxIdToSelectedMap? false : true,
      },
    };
    setCheckboxIdToSelectedMap(newCheckboxIdToSelectedMap);
  };

  const onClickHandler = (files: any) => {    
    setFiles(files.length > 0 ? Array.from(files) : []);

    // Use the core notifications service to display a success message.
    notifications.toasts.addSuccess(
      i18n.translate('automatedIrp.dataUpdated', {
        defaultMessage: 'Список файлов изменен',
      })
    );
  };

  async function uploadMultiple(formData: FormData) {
    try {
      const response = await fetch("http://dissect.artifact-collector.svc.cluster.local/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result['status'] === 'ok')
        notifications.toasts.addSuccess(
        i18n.translate('automatedIrp.dataUpload', {
          defaultMessage: 'Файл отправлен на сервер',
        }))
    } catch (error) {
      notifications.toasts.addDanger(
      i18n.translate('automatedIrp.dataDontUpload', {
        defaultMessage: 'Ошибка ' + error,
      }))
    }
  }

  async function uploadImage(url: string, body: string) {
    const response = await fetch(url, {
      method: "POST",
      body: body,
    });
    await response.json();

    notifications.toasts.addSuccess(
    i18n.translate('automatedIrp.uploadImage', {
      defaultMessage: 'Анализ завершен',
    }))
  }

  const onClickButton = (files: Array<any>, shuffleIP: any) => {    

    const formData = new FormData();

    for(const file of files) 
      formData.append('file', file, file.name);

    uploadMultiple(formData)

    for (const art of artefact_type)
      if(art in checkboxIdToSelectedMap)
        for(const file of files) 
          uploadImage('http://' + String(shuffleIP) + '/api/v1/hooks/' + String(workflow_id),'{"image": "' + file.name + '", "artefact" : "' + art + '"}')

  };

  return (
    <Router basename={basename}>
      <I18nProvider>
        <>
          <navigation.ui.TopNavMenu
            appName={PLUGIN_ID}
            showSearchBar={true}
            useDefaultBehaviors={true}
          />
          <EuiPage restrictWidth="1000px">
            <EuiPageBody component="main">
              <EuiPageHeader>
                <EuiTitle size="l">
                  <h1>
                    <FormattedMessage
                      id="automatedIrp.helloWorldText"
                      defaultMessage="{name}"
                      values={{ name: PLUGIN_NAME }}
                    />
                  </h1>
                </EuiTitle>
              </EuiPageHeader>
              <EuiPageContent>
                <EuiPageContentHeader>
                  <EuiTitle>
                    <h2>
                      <FormattedMessage
                        id="automatedIrp.congratulationsTitle"
                        defaultMessage="Панель управления автоматизированной системой описания этапов реализации компьютерного инцидента"
                      />
                    </h2>
                  </EuiTitle>
                </EuiPageContentHeader>
                <EuiPageContentBody>
                  <div>
                          <EuiDescribedFormGroup
                      title={<h3>Поддерживает различные форматы контейнеров: E01, VMDK, QCoW и др</h3>}
                      description={
                        <>
                          <p>
                          Загрузите коллекции артефактов для анализа ниже
                          </p>
                        </>
                      }
                    >
                        <EuiPopover
                        button={button}
                        isOpen={isPopoverOpen}
                        closePopover={closePopover}
                      >
                        <div style={{ width: 640 }}>{formSample}</div>
                      </EuiPopover> 
                    </EuiDescribedFormGroup>

                    
                  </div>
                  <EuiHorizontalRule />

                  <div>
                  <EuiFlexGroup>
                    <EuiFlexItem>
                        <EuiFilePicker
                          id="automatedIrp.filePickerId"
                          multiple
                          initialPromptText="Выберите или перетащите несколько файлов"
                          onChange={onClickHandler}
                          display='large'
                          fullWidth
                        />
                      <EuiSpacer />
                    </EuiFlexItem>
                  </EuiFlexGroup>
                  </div>
                  <div style={{ width: 400 }}>
                    <EuiFlexGroup>
                      <EuiFlexItem>
                      <EuiButton type="submit" size="s" onClick={() => onClickButton(files, shuffleIp)}>
                        <FormattedMessage id="automatedIrp.buttonText" defaultMessage="Анализировать" />
                      </EuiButton>
                        <EuiSpacer />
                      </EuiFlexItem>
                        <EuiFlexItem>
                          <EuiPopover
                              button={buttonArt}
                              isOpen={isPopoverOpenArt}
                              closePopover={closePopoverArt}
                            >
                              <EuiCheckboxGroup 
                              style={{ width: 200, height: 200 }} 
                              options={artefact_list}
                              className="eui-yScrollWithShadows"
                              idToSelectedMap={checkboxIdToSelectedMap}
                              onChange={(id) => onChangeArt(id)}
                              tabIndex={0} 
                              />
                            </EuiPopover> 
                          </EuiFlexItem>                    
                    </EuiFlexGroup>
                  </div>
                </EuiPageContentBody>
              </EuiPageContent>
            </EuiPageBody>
          </EuiPage>
        </>
      </I18nProvider>
    </Router>
  );
};