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

  const [shuffleIp, setShuffleIp] = useState("");
  const [bearerKey, setBearerKey] = useState("");

  const [shuffleIpTemp, setShuffleIpTemp] = useState("");
  const [bearerKeyTemp, setBearerKeyTemp] = useState("");

  const [files, setFiles] = useState({});
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const onButtonClick = () => {
    setIsPopoverOpen(!isPopoverOpen);
  };

  const closePopover = () => {
    setIsPopoverOpen(false);
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
  
  const onClickSave = () => {    

    const ip = String(shuffleIpTemp);
    const key = String(bearerKeyTemp);
    var re_key = new RegExp('^[[0-9]|a-f]{8}-([[0-9]|a-f]{4}-){3}[[0-9]|a-f]{12}$');
    var re_ip = new RegExp('(^([0-9]{1,3}\.){3}[0-9]{1,3}$)|(^[a-zA-Z0-9][a-zA-Z0-9-_]{0,61}[a-zA-Z0-9]{0,1}\.([a-zA-Z]{1,6}|[a-zA-Z0-9-]{1,30}\.[a-zA-Z]{2,3})$)');

    if (key != '')
      if (re_key.test(key)){
        setBearerKey(key)
        notifications.toasts.addSuccess(
        i18n.translate('automatedIrp.dataUpload', {
          defaultMessage: 'Bearer ключ обновлен: ' + key,
        }))}
      else
        notifications.toasts.addDanger(
        i18n.translate('automatedIrp.dataDontUpload', {
          defaultMessage: 'Ошибка валидации Bearer ключа: ' + key,
        }))

    if (ip != '')
      if (re_ip.test(ip)){
        setShuffleIp(ip)
        notifications.toasts.addSuccess(
        i18n.translate('automatedIrp.dataUpload', {
          defaultMessage: 'IP обновлен: ' + ip,
        }))}
      else
        notifications.toasts.addDanger(
        i18n.translate('automatedIrp.dataDontUpload', {
          defaultMessage: 'Ошибка валидации ip: ' + ip,
        }))

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
          <EuiFormRow label="Ключ API" style={{ width: 300 }}>
            <EuiFieldText id="automatedIrp.bearerkey" onChange={(e) => setBearerKeyTemp(e.target.value)} icon="tokenKey" placeholder={ String(bearerKey) }/>
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

  const onClickHandler = (files: any) => {    
    setFiles(files.length > 0 ? Array.from(files) : []);

    // Use the core notifications service to display a success message.
    notifications.toasts.addSuccess(
      i18n.translate('automatedIrp.dataUpdated', {
        defaultMessage: 'Список файлов изменен',
      })
    );
  };

  const onClickButton = (files: any, bearerKey: any, shuffleIP: any) => {    

    for(const file of files){
      const form = new FormData();
      form.append('shuffle_file', file, file.name);

      fetch('http://' + String(shuffleIP) + '/api/v1/files/file/upload', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + String(bearerKey)
        },
        body: form
      })
      .then(result => result.json())
      .then(jsonformat => {
        if (jsonformat['success'] === 'true')
          notifications.toasts.addSuccess(
          i18n.translate('automatedIrp.dataUpload', {
            defaultMessage: 'Файл отправлен на сервер',
          }))

        else
          notifications.toasts.addDanger(
          i18n.translate('automatedIrp.dataDontUpload', {
            defaultMessage: 'Ошибка ' + jsonformat,
          }))
      })
    }
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
                        defaultMessage="Панель управления автоматизированной системой описания этапов реализации компьюитерного инциндента"
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
                        <div style={{ width: 700 }}>{formSample}</div>
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
                  <div>
                    <EuiButton type="submit" size="s" onClick={() => onClickButton(files, bearerKey, shuffleIp)}>
                      <FormattedMessage id="automatedIrp.buttonText" defaultMessage="Analyze" />
                    </EuiButton>
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