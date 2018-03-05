package node

import (
	"context"
	"errors"
	"log"
	"time"

	metricapi "github.com/kubernetes/dashboard/src/app/backend/integration/metric/api"
	pApi "github.com/prometheus/client_golang/api"
	pApiV1 "github.com/prometheus/client_golang/api/prometheus/v1"
	"github.com/prometheus/common/model"
	"k8s.io/api/core/v1"
)

// GetPrometheusMetrics append prometheus metrics to origin metrics
func GetPrometheusMetrics(node *v1.Node) ([]metricapi.Metric, error) {
	result := make([]metricapi.Metric, 0)
	nodeIP := ""
	for _, address := range node.Status.Addresses {
		if address.Type == v1.NodeInternalIP {
			nodeIP = address.Address
		}
	}

	if nodeIP == "" {
		return nil, errors.New("Not parse the node IP Address")
	}
	log.Printf("Node IP Address: %s", nodeIP)

	prometheusQueryList := [...]string{"100 - 100*sum(node_filesystem_free{device!=\"rootfs\",instance=\"" + nodeIP + ":9100\"}) / sum(node_filesystem_size{device!=\"rootfs\",instance=\"" + nodeIP + ":9100\"})",
		"sum by (instance) (rate(node_disk_bytes_read{instance=\"" + nodeIP + ":9100\"}[2m]))",
		"sum by (instance) (rate(node_disk_bytes_written{instance=\"" + nodeIP + ":9100\"}[2m]))",
		"sum by (instance) (rate(node_network_transmit_bytes{instance=\"" + nodeIP + ":9100\",device!~\"lo\"}[5m]))",
		"sum by (instance) (rate(node_network_receive_bytes{instance=\"" + nodeIP + ":9100\",device!~\"lo\"}[5m]))"}
	prometheusMetricNames := [...]string{"disk/used", "disk/read", "disk/write", "network/send", "network/receive"}

	config := pApi.Config{
		Address:      "http://" + nodeIP + ":30900",
		RoundTripper: pApi.DefaultRoundTripper,
	}

	pClient, err := pApi.NewClient(config)
	if err != nil {
		return nil, err
	}

	pAPI := pApiV1.NewAPI(pClient)
	nowTime := time.Now()

	for index, query := range prometheusQueryList {
		queryResult, err := pAPI.QueryRange(context.Background(), query, pApiV1.Range{
			Start: nowTime.Add(-time.Minute * 10),
			End:   nowTime,
			Step:  time.Minute,
		})
		if err != nil {
			return nil, err
		}

		matrixs, success := queryResult.(model.Matrix)
		dataPoints := make(metricapi.DataPoints, 0)
		metricPoints := make([]metricapi.MetricPoint, 0)

		if success {
			for _, matrix := range matrixs {
				for _, item := range matrix.Values {
					dataPoints = append(dataPoints, metricapi.DataPoint{X: item.Timestamp.Unix(), Y: int64(item.Value)})
					metricPoints = append(metricPoints, metricapi.MetricPoint{Timestamp: item.Timestamp.Time(), Value: uint64(item.Value)})
				}
			}
		} else {
			return nil, errors.New("Wrong type transform")
		}

		metric := metricapi.Metric{
			MetricName:   prometheusMetricNames[index],
			MetricPoints: metricPoints,
			DataPoints:   dataPoints,
			Aggregate:    metricapi.SumAggregation,
		}
		result = append(result, metric)
	}
	return result, nil

}
