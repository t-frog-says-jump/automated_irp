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
  EuiText,
  EuiFilePicker,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
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

  let BearerKey = ""

  const [files, setFiles] = useState({});

  const onClickHandler = (files: any) => {    
    setFiles(files.length > 0 ? Array.from(files) : []);

    // Use the core notifications service to display a success message.
    notifications.toasts.addSuccess(
      i18n.translate('automatedIrp.dataUpdated', {
        defaultMessage: 'Список файлов изменен',
      })
    );
  };

  const onClickButton = (files: any, BearerKey: string) => {    

    for(const file of files){
      const form = new FormData();
      form.append('shuffle_file', file, file.name);

      fetch('https://shuffler.io/api/v1/files/file/upload', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + BearerKey
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
    // Use the core http service to make a response to the server API.
  };

  // Render the application DOM.
  // Note that `navigation.ui.TopNavMenu` is a stateful component exported on the `navigation` plugin's start contract.
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
                  <EuiText>
                    <p>
                      <FormattedMessage
                        id="automatedIrp.content"
                        defaultMessage="Загрузите коллекции артефактов для анализа ниже"
                      />
                    </p>
                    <EuiHorizontalRule />
                    
                  </EuiText>
                  <EuiFlexGroup>
                    <EuiFlexItem>
                        <EuiFilePicker
                          id="automatedIrp.filePickerId"
                          multiple
                          initialPromptText="Выберите или перетащите несколько файлов"
                          onChange={onClickHandler}
                          display='large'
                          aria-label="Use aria labels when no actual label is in use"
                        />
                      <EuiSpacer />
                    </EuiFlexItem>
                  </EuiFlexGroup>
                    <EuiButton type="submit" size="s" onClick={() => onClickButton(files, BearerKey)}>
                      <FormattedMessage id="automatedIrp.buttonText" defaultMessage="Analyze" />
                    </EuiButton>
                </EuiPageContentBody>
              </EuiPageContent>
            </EuiPageBody>
          </EuiPage>
        </>
      </I18nProvider>
    </Router>
  );
};