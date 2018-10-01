package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/quintilesims/orca/proxy/controllers"
	"github.com/urfave/cli"
	"github.com/zpatrick/handler"
	"github.com/zpatrick/router"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
)

const (
	FlagPort       = "port"
	FlagInCluster  = "in-cluster"
	FlagKubeconfig = "kubeconfig"
)

const (
	EVPort       = "OP_PORT"
	EVInCluster  = "OP_IN_CLUSTER"
	EVKubeconfig = "KUBECONFIG"
)

func main() {
	app := cli.NewApp()
	app.Name = "orca-proxy"
	app.Flags = []cli.Flag{
		cli.IntFlag{
			Name:   FlagPort,
			EnvVar: EVPort,
			Value:  9090,
		},
		cli.BoolFlag{
			Name:   FlagInCluster,
			EnvVar: EVInCluster,
		},
		cli.StringFlag{
			Name:   FlagKubeconfig,
			EnvVar: EVKubeconfig,
			Value:  fmt.Sprintf("%s/.kube/config", os.Getenv("HOME")),
		},
	}

	app.Action = func(c *cli.Context) error {
		getConfig := rest.InClusterConfig
		if !c.Bool(FlagInCluster) {
			getConfig = func() (*rest.Config, error) {
				return clientcmd.BuildConfigFromFlags("", c.String(FlagKubeconfig))
			}
		}

		config, err := getConfig()
		if err != nil {
			return err
		}

		config.Impersonate = rest.ImpersonationConfig{
			UserName: "test-user",
			Groups:   []string{},
			Extra:    map[string][]string{},
		}

		client, err := kubernetes.NewForConfig(config)
		if err != nil {
			return err
		}

		rt, err := rest.TransportFor(config)
		if err != nil {
			return err
		}

		proxy := controllers.NewProxyController(client)
		rm := router.RouteMap{
			"/api/v1/namespaces/": router.MethodHandlers{
				http.MethodGet: handler.Constructor(proxy.ListNamespaces),
			},
		}

		rm.ApplyMiddleware(router.LoggingMiddleware())
		router := router.NewRouter(rm.VariableMatch())

		addr := fmt.Sprintf("0.0.0.0:%d", c.Int("port"))
		log.Printf("[INFO] Listening on %s\n", addr)
		return http.ListenAndServe(addr, router)
	}

	if err := app.Run(os.Args); err != nil {
		log.Fatal(err)
	}
}
