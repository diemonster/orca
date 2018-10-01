package main

import (
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"strings"

	"github.com/quintilesims/auth0"
	"github.com/urfave/cli"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
)

const (
	FlagPort        = "port"
	FlagAuth0Domain = "auth0-domain"
	FlagInCluster   = "in-cluster"
	FlagKubeconfig  = "kubeconfig"
)

const (
	EVPort        = "OP_PORT"
	EVAuth0Domain = "OP_AUTH0_DOMAIN"
	EVInCluster   = "OP_IN_CLUSTER"
	EVKubeconfig  = "KUBECONFIG"
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
		cli.StringFlag{
			Name:   FlagAuth0Domain,
			EnvVar: EVAuth0Domain,
			Value:  "imshealth.auth0.com",
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

		auth0 := auth0.NewClient(c.String(FlagAuth0Domain))
		proxy := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			token := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer ")
			if token == "" {
				log.Printf("[INFO] Request missing Authorization Header")
				http.Error(w, "Missing Authorization Header", http.StatusUnauthorized)
				return
			}

			profile, err := auth0.GetProfile(token)
			if err != nil {
				log.Printf("[ERROR] Failed to exchange Auth0 token: %v", err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			config.Impersonate = rest.ImpersonationConfig{
				UserName: profile.Email,
			}

			transport, err := rest.TransportFor(config)
			if err != nil {
				log.Printf("[ERROR] Failed to create transport: %v", err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			rp := httputil.NewSingleHostReverseProxy(&url.URL{
				Host:   strings.TrimPrefix(config.Host, "https://"),
				Scheme: "https",
			})

			rp.Transport = transport
			rp.ServeHTTP(w, r)
		})

		addr := fmt.Sprintf("0.0.0.0:%d", c.Int("port"))
		log.Printf("[INFO] Listening on %s\n", addr)
		return http.ListenAndServe(addr, proxy)
	}

	if err := app.Run(os.Args); err != nil {
		log.Fatal(err)
	}
}
