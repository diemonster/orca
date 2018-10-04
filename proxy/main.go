package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/quintilesims/auth0"
	"github.com/quintilesims/orca/proxy/auth"
	"github.com/quintilesims/orca/proxy/kubeutil"
	"github.com/urfave/cli"
	"k8s.io/client-go/rest"
)

const (
	FlagPort        = "port"
	FlagAuth0Domain = "auth0-domain"
	FlagInCluster   = "in-cluster"
	FlagKubeconfig  = "kubeconfig"
	FlagCacheExpiry = "cache-expiry"
)

const (
	EVPort        = "OP_PORT"
	EVAuth0Domain = "OP_AUTH0_DOMAIN"
	EVInCluster   = "OP_IN_CLUSTER"
	EVKubeconfig  = "KUBECONFIG"
	EVCacheExpiry = "OP_CACHE_EXPIRY"
)

func main() {
	app := cli.NewApp()
	app.Name = "orca-proxy"
	app.Flags = []cli.Flag{
		cli.IntFlag{
			Name:   FlagPort,
			EnvVar: EVPort,
			Value:  8080,
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
		cli.DurationFlag{
			Name:   FlagCacheExpiry,
			EnvVar: EVCacheExpiry,
			Value:  time.Hour,
		},
	}

	app.Action = func(c *cli.Context) error {
		auth0 := auth0.NewClient(c.String(FlagAuth0Domain))
		getProfile := auth.CachedGetProfileFunc(auth0.GetProfile, c.Duration(FlagCacheExpiry))

		config, err := kubeutil.GetConfig(c.Bool(FlagInCluster), c.String(FlagKubeconfig))
		if err != nil {
			return err
		}

		handler := func(w http.ResponseWriter, r *http.Request) {
			// set CORS headers
                        w.Header().Set("Access-Control-Allow-Origin", "*")

			token := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer ")
			if token == "" {
				log.Printf("[INFO] Request missing Authorization Header")
				http.Error(w, "Missing Authorization Header", http.StatusUnauthorized)
				return
			}

			profile, err := getProfile(token)
			if err != nil {
				if err == auth.InvalidToken {
					log.Printf("[INFO] Request sent invalid Auth0 token")
					http.Error(w, "Invalid Token", http.StatusUnauthorized)
					return
				}

				log.Printf("[ERROR] Failed to get profile: %v", err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			config.Impersonate = rest.ImpersonationConfig{UserName: profile.Email}
			reverseProxy, err := kubeutil.NewReverseProxy(config)
			if err != nil {
				log.Printf("[ERROR] Failed to create reverse proxy: %v", err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			reverseProxy.ServeHTTP(w, r)
		}

		addr := fmt.Sprintf("0.0.0.0:%d", c.Int("port"))
		log.Printf("[INFO] Listening on %s\n", addr)
		return http.ListenAndServe(addr, http.HandlerFunc(handler))
	}

	if err := app.Run(os.Args); err != nil {
		log.Fatal(err)
	}
}
