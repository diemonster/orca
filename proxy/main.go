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
	FlagLocal = "local"
)

const (
	EVLocal = "OP_LOCAL"
)

func main() {
	app := cli.NewApp()
	app.Name = "orca-proxy"
	app.Flags = []cli.Flag{
		cli.BoolFlag{
			Name:   FlagLocal,
			EnvVar: EVLocal,
		},
	}

	app.Action = func(c *cli.Context) error {
		getConfig := rest.InClusterConfig
		if c.Bool(FlagLocal) {
			getConfig = func() (*rest.Config, error) {
				return clientcmd.BuildConfigFromFlags("", os.Getenv("KUBECONFIG"))
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
