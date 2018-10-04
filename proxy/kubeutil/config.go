package kubeutil

import (
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
)

func GetConfig(inCluster bool, kubeConfigPath string) (*rest.Config, error) {
	if inCluster {
		return rest.InClusterConfig()
	}

	return clientcmd.BuildConfigFromFlags("", kubeConfigPath)
}
