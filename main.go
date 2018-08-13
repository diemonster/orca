package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/urfave/cli"
	"github.com/zpatrick/rclient"
	authentication "k8s.io/api/authentication/v1"
)

/*
	K8 Types: https://github.com/kubernetes/api/blob/master/authentication/v1/types.go
	Examples:
		- https://github.com/oursky/kubernetes-github-authn/blob/master/main.go
		- https://github.com/appscode/guard/blob/master/auth/providers/github/github.go

*/

// see: TODO
type Auth0OAuthRequest struct {
	ClientID   string `json:"client_id"`
	Connection string `json:"connection"`
	Username   string `json:"username"`
	Password   string `json:"password"`
	GrantType  string `json:"grant_type"`
	Scope      string `json:"scope"`
}

// see: TODO
type Auth0OAuthResponse struct {
	AccessToken string `json:"access_token"`
}

// see: https://auth0.com/docs/user-profile/user-profile-structure
type Auth0Profile struct {
	UserID string `json:"user_id"`
	Username string `json:"username"`
}

func WriteTokenReview(w http.ResponseWriter, status authentication.TokenReviewStatus) {
	if status.Authenticated {
		w.WriteHeader(http.StatusOK)
	} else {
		w.WriteHeader(http.StatusUnauthorized)
	}

	response := map[string]interface{}{
		"apiVersion": "authentication.k8s.io/v1beta1",
		"kind":       "TokenReview",
		"status":     status,
	}

	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Println("[ERROR]", err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

const (
	FlagPort            = "port"
	EVPort              = "ORCA_PORT"
	FlagAuth0Domain     = "auth0-domain"
	EVAuth0Domain       = "ORCA_AUTH0_DOMAIN"
	FlagAuth0ClientID   = "auth0-client-id"
	EVAuth0ClientID     = "ORCA_AUTH0_CLIENT_ID"
	FlagAuth0Connection = "auth0-connection"
	EVAuth0Connection   = "ORCA_AUTH0_CONNECTION"
)

func main() {
	app := cli.NewApp()
	app.Name = "orca"
	app.Usage = "Auth0 Authenticator for Kubernetes"
	app.Flags = []cli.Flag{
		cli.IntFlag{
			Name:   FlagPort,
			EnvVar: EVPort,
			Value:  80,
		},
		cli.StringFlag{
			Name:   FlagAuth0Domain,
			EnvVar: EVAuth0Domain,
		},
		cli.StringFlag{
			Name:   FlagAuth0ClientID,
			EnvVar: EVAuth0ClientID,
		},
		cli.StringFlag{
			Name:   FlagAuth0Connection,
			EnvVar: EVAuth0Connection,
		},
	}

	app.Before = func(c *cli.Context) error {
		requiredFlags := []string{
			FlagAuth0Domain,
			FlagAuth0ClientID,
			FlagAuth0Connection,
		}

		for _, flag := range requiredFlags {
			if !c.IsSet(flag) {
				return fmt.Errorf("Required flag '%s' is not set!", flag)
			}
		}

		return nil
	}

	app.Action = func(c *cli.Context) error {
		client := rclient.NewRestClient(c.String(FlagAuth0Domain))

		http.HandleFunc("/token", func(w http.ResponseWriter, r *http.Request) {
			user, pass, ok := r.BasicAuth()
			if !ok {
				w.Header().Set("WWW-Authenticate", "Basic realm=\"Restricted\"")
				w.WriteHeader(401)
				w.Write([]byte("Unauthorized\n"))
				return
			}

			req := Auth0OAuthRequest{
				ClientID:   c.String(FlagAuth0ClientID),
				Connection: c.String(FlagAuth0Connection),
				Username:   user,
				Password:   pass,
				GrantType:  "password",
				Scope:      "openid",
			}

			var resp Auth0OAuthResponse
			if err := client.Post("/oauth/ro", req, &resp); err != nil {
				log.Println("[ERROR]", err.Error())
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			w.WriteHeader(http.StatusOK)
			if _, err := w.Write([]byte(resp.AccessToken)); err != nil {
				log.Println("[ERROR]", err.Error())
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		})

		http.HandleFunc("/authenticate", func(w http.ResponseWriter, r *http.Request) {
			var tr authentication.TokenReview
			if err := json.NewDecoder(r.Body).Decode(&tr); err != nil {
				log.Println("[ERROR]", err.Error())
				WriteTokenReview(w, authentication.TokenReviewStatus{Error: err.Error()})
				return
			}

			var profile Auth0Profile
			header := rclient.Header("Authorization", fmt.Sprintf("Bearer %s", tr.Spec.Token))
			if err := client.Get("/userinfo", &profile, header); err != nil {
				log.Println("[ERROR]", err.Error())
				WriteTokenReview(w, authentication.TokenReviewStatus{Error: err.Error()})
				return
			}

			// todo: expiration
			status := authentication.TokenReviewStatus{
				Authenticated: true,
				User: authentication.UserInfo{
					Username: profile.Username,
					UID:      profile.UserID,
				},
			}

			WriteTokenReview(w, status)
		})

		addr := fmt.Sprintf("0.0.0.0:%d", c.Int(FlagPort))
		log.Printf("[INFO] Listening on %s\n", addr)
		return http.ListenAndServe(addr, nil)
	}

	if err := app.Run(os.Args); err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}
}
