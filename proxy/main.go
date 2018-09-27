package main

import (
	"fmt"
	"log"
	"os"

	"github.com/urfave/cli"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
)

const (
	FlagInCluster  = "in-cluster"
	FlagKubeconfig = "kubeconfig"
)

const (
	EVInCluster  = "OP_INCLUSTER"
	EVKubeconfig = "KUBECONFIG"
)

func main() {
	app := cli.NewApp()
	app.Name = "orca-proxy"
	app.Flags = []cli.Flag{
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

		fmt.Println(config)
		return nil
	}

	if err := app.Run(os.Args); err != nil {
		log.Fatal(err)
	}
	/*

		// todo: flags to switch between in-cluster and local development?
		config, err := rest.InClusterConfig()
		if err != nil {
			log.Fatal(err)
		}

		// https://github.com/kubernetes/client-go/blob/02384dbe123ff097a279965297f327a72ebefb72/transport/round_trippers.go#L100
		// https://github.com/kubernetes/client-go/blob/02384dbe123ff097a279965297f327a72ebefb72/transport/transport.go
		handler := func(w http.ResponseWriter, r *http.Request) {
			// todo: update config.Impersonate with data from request header

			// todo: should this use transport.TLSConfigFor ?
			rt, err := transport.New(config)
			if err != nil {
				log.Println(err.Error())
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}

		rp := httputil.NewSingleHostReverseProxy("") // todo: config.BaseURL?

		// whenever a request comes in:
		rt, err := transport.HTTPWrappersForConfig(config, rt)
		if err != nil {
			log.Fatal(err)
		}
	*/

}
