// Copyright 2017 The Kubernetes Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {GlobalSettings, LocalSettings} from '@api/backendapi';
import {onSettingsFailCallback, onSettingsLoadCallback} from '@api/frontendapi';
import {CookieService} from 'ngx-cookie-service';

import {AuthorizerService} from './authorizer';
import {ThemeService} from './theme';

@Injectable()
export class SettingsService {
  private readonly globalSettingsEndpoint_ = 'api/v1/settings/global';
  private globalSettings_: GlobalSettings = {
    itemsPerPage: 10,
    clusterName: '',
    autoRefreshTimeInterval: 5,
  };
  private readonly localSettingsCookie_ = 'localSettings';
  private localSetttings_: LocalSettings = {
    isThemeDark: false,
  };
  private isInitialized_ = false;

  constructor(
      private http_: HttpClient, private authorizer_: AuthorizerService,
      private theme_: ThemeService, private cookies_: CookieService) {}

  init() {
    this.loadGlobalSettings();
  }

  isInitialized() {
    return this.isInitialized_;
  }

  loadGlobalSettings(onLoad?: onSettingsLoadCallback, onFail?: onSettingsFailCallback) {
    this.authorizer_.proxyGET<GlobalSettings>(this.globalSettingsEndpoint_)
        .toPromise()
        .then(
            (settings) => {
              this.globalSettings_ = settings;
              this.isInitialized_ = true;
              if (onLoad) onLoad(settings);
            },
            (err) => {
              this.isInitialized_ = false;
              if (onFail) onFail(err);
            });
  }

  getClusterName() {
    return this.globalSettings_.clusterName;
  }

  getItemsPerPage() {
    return this.globalSettings_.itemsPerPage;
  }

  getAutoRefreshTimeInterval() {
    return this.globalSettings_.autoRefreshTimeInterval;
  }

  getLocalSettings() {
    const cookieValue = this.cookies_.get(this.localSettingsCookie_);
    this.localSetttings_ = JSON.parse(cookieValue);
    return this.localSetttings_;
  }

  saveLocalSettings(localSettings: LocalSettings) {
    this.cookies_.set(this.localSettingsCookie_, JSON.stringify(localSettings));
    this.localSetttings_ = localSettings;
    this.applyLocalSettings();
    return this.localSetttings_;
  }

  applyLocalSettings() {
    this.theme_.switchTheme(this.localSetttings_.isThemeDark);
  }
}
