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

import {formatCpuUsage, formatMemoryUsage, formatTime} from './graph_tick_formatters';

const i18n = {
  /** @export {string} @desc Name of the CPU usage metric as displayed in the legend. */
  MSG_GRAPH_CPU_USAGE_LEGEND_LABEL: goog.getMsg('CPU Usage'),
  /** @export {string} @desc Name of the memory usage metric as displayed in the legend. */
  MSG_GRAPH_MEMORY_USAGE_LEGEND_LABEL: goog.getMsg('Memory Usage'),
  /** @export {string} @desc Name of the CPU limit metric as displayed in the legend. */
  MSG_GRAPH_CPU_LIMIT_LEGEND_LABEL: goog.getMsg('CPU Limit'),
  /** @export {string} @desc Name of the Disk Used metric as displayed in the legend. */
  MSG_GRAPH_DISK_USED_LEGEND_LABEL: goog.getMsg('Disk Used'),
  /** @export {string} @desc Name of the Disk Read metric as displayed in the legend. */
  MSG_GRAPH_DISK_READ_LEGEND_LABEL: goog.getMsg('Disk Read'),
  /** @export {string} @desc Name of the Disk Write metric as displayed in the legend. */
  MSG_GRAPH_DISK_WRITE_LEGEND_LABEL: goog.getMsg('Disk Write'),
  /** @export {string} @desc Name of the Netwoek Send metric as displayed in the legend. */
  MSG_GRAPH_NETWORK_SEND_LEGEND_LABEL: goog.getMsg('Netwoek Send'),
  /** @export {string} @desc Name of the Netwoek Send metric as displayed in the legend. */
  MSG_GRAPH_NETWORK_RECEIVE_LEGEND_LABEL: goog.getMsg('Netwoek Receive'),
  /** @export {string} @desc Name of Y axis showing CPU usage. */
  MSG_GRAPH_CPU_AXIS_LABEL: goog.getMsg('CPU (cores)'),
  /** @export {string} @desc Name of Y axis showing memory usage. */
  MSG_GRAPH_MEMORY_AXIS_LABEL: goog.getMsg('Memory (bytes)'),
  /** @export {string} @desc Name of Y axis showing Disk. */
  MSG_GRAPH_DISK_USED_AXIS_LABEL: goog.getMsg('Disk Used'),
  /** @export {string} @desc Name of Y axis showing Disk. */
  MSG_GRAPH_DISK_RATE_AXIS_LABEL: goog.getMsg('Disk Rate (bytes/s)'),
  /** @export {string} @desc Name of Y axis showing Network. */
  MSG_GRAPH_NETWORK_AXIS_LABEL: goog.getMsg('Network Rate (bytes/s)'),
  /** @export {string} @desc Name of time axis. */
  MSG_GRAPH_TIME_AXIS_LABEL: goog.getMsg('Time'),
};

/**
 * Settings specifying total number of ticks of Y axis
 *
 * @type {number}
 */
export const TICK_NUM = 4.5;

/**
 * Settings specifying the range of position of the maximum value on Y axis (units = number of
 * ticks).
 * For example setting [4,5] means that maximum value of the graph should be somewhere between tick
 * 4 and tick 5.
 *
 * @type {!Array<number>}
 */
export const MAX_BETWEEN_TICKS = [3.8, 4.1];

export const CPUAxisType = 'CPUAxisType';
export const MemoryAxisType = 'MemoryAxisType';
export const TimeAxisType = 'TimeAxisType';
export const NetworkAxisType = 'NetworkAxisType';
export const DiskUsedAxisType = 'DiskUsedAxisType';
export const DiskRateAxisType = 'DiskRateAxisType';

/**
 * Settings used by GraphController to display different metrics.
 *
 * @type {!Object<string, !Object<string, !kdGraph.metricSetting>>}
 */
export const metricDisplaySettings = {
  'cpu/usage_rate': {
    yAxisType: CPUAxisType,
    area: true,
    key: i18n.MSG_GRAPH_CPU_USAGE_LEGEND_LABEL,
    color: '#00c752',  // $chart-1
    fillOpacity: 0.2,
    strokeWidth: 3,
    type: 'line',
    yAxis: 1,
  },
  'cpu/limit': {
    yAxisType: CPUAxisType,
    area: true,
    key: i18n.MSG_GRAPH_CPU_LIMIT_LEGEND_LABEL,
    color: '#f51200',
    fillOpacity: 0.2,
    strokeWidth: 3,
    type: 'line',
    yAxis: 1,
  },
  'memory/usage': {
    yAxisType: MemoryAxisType,
    area: true,
    key: i18n.MSG_GRAPH_MEMORY_USAGE_LEGEND_LABEL,
    color: '#326de6',  // $chart-2
    fillOpacity: 0.2,
    strokeWidth: 3,
    type: 'line',
    yAxis: 2,
  },
  'disk/used': {
    yAxisType: DiskUsedAxisType,
    area: true,
    key: i18n.MSG_GRAPH_DISK_USED_LEGEND_LABEL,
    color: '#ffb74d',  // $chart-2
    fillOpacity: 0.2,
    strokeWidth: 3,
    type: 'line',
    yAxis: 2,
  },
  'disk/read': {
    yAxisType: DiskRateAxisType,
    area: true,
    key: i18n.MSG_GRAPH_DISK_READ_LEGEND_LABEL,
    color: '#ffb74d',  // $chart-2
    fillOpacity: 0.2,
    strokeWidth: 3,
    type: 'line',
    yAxis: 2,
  },
  'disk/write': {
    yAxisType: DiskRateAxisType,
    area: true,
    key: i18n.MSG_GRAPH_DISK_WRITE_LEGEND_LABEL,
    color: '#ffb74d',  // $chart-2
    fillOpacity: 0.2,
    strokeWidth: 3,
    type: 'line',
    yAxis: 2,
  },
  'network/send': {
    yAxisType: NetworkAxisType,
    area: true,
    key: i18n.MSG_GRAPH_NETWORK_SEND_LEGEND_LABEL,
    color: '#f36c60',  // $chart-2
    fillOpacity: 0.2,
    strokeWidth: 3,
    type: 'line',
    yAxis: 2,
  },
  'network/receive': {
    yAxisType: NetworkAxisType,
    area: true,
    key: i18n.MSG_GRAPH_NETWORK_RECEIVE_LEGEND_LABEL,
    color: '#f36c60',  // $chart-2
    fillOpacity: 0.2,
    strokeWidth: 3,
    type: 'line',
    yAxis: 2,
  },
};

/**
 * Settings used by GraphController to display different axes.
 *
 * @type {!Object<string, !Object<string, !kdGraph.axisSetting>>}
 */
export const axisSettings = {
  'CPUAxisType': {
    formatter: formatCpuUsage,
    label: i18n.MSG_GRAPH_CPU_AXIS_LABEL,
  },
  'MemoryAxisType': {
    formatter: formatMemoryUsage,
    label: i18n.MSG_GRAPH_MEMORY_AXIS_LABEL,
  },
  'TimeAxisType': {
    formatter: formatTime,
    label: i18n.MSG_GRAPH_TIME_AXIS_LABEL,
  },
  'DiskUsedAxisType': {
    formatter: function (d) {
      return d+'%';
    },
    label: i18n.MSG_GRAPH_DISK_USED_AXIS_LABEL,
  },
  'DiskRateAxisType': {
    formatter: formatMemoryUsage,
    label: i18n.MSG_GRAPH_DISK_RATE_AXIS_LABEL,
  },
  'NetworkAxisType': {
    formatter: formatMemoryUsage,
    label: i18n.MSG_GRAPH_NETWORK_AXIS_LABEL,
  },
};
