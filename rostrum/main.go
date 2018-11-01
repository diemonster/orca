package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/urfave/cli"
)

const (
	FlagPort          = "port"
	FlagProxyURL      = "proxy-url"
	FlagAuth0Domain   = "auth0-domain"
	FlagAuth0ClientID = "auth0-client-id"
)

const (
	EVPort          = "OP_PORT"
	EVProxyURL      = "OP_PROXY_URL"
	EVAUTH0Domain   = "OP_AUTH0_DOMAIN"
	EVAUTH0ClientID = "OP_AUTH0_CLIENT_ID"
)

var Version string = "unset/develop"

type AssetManifest struct {
	CSS string `json:"main.css"`
	JS  string `json:"main.js"`
}

type Config struct {
	ProxyURL      string
	Auth0Domain   string
	Auth0ClientID string
	CSSFilePath   string
	JSFilePath    string
}

func main() {
	app := cli.NewApp()
	app.Name = "rostrum"
	app.Version = Version
	app.Flags = []cli.Flag{
		cli.IntFlag{
			Name:   FlagPort,
			EnvVar: EVPort,
			Value:  3000,
		},
		cli.StringFlag{
			Name:   FlagProxyURL,
			EnvVar: EVProxyURL,
			Value:  "http://localhost:8080",
		},
		cli.StringFlag{
			Name:   FlagAuth0Domain,
			EnvVar: EVAUTH0Domain,
		},
		cli.StringFlag{
			Name:   FlagAuth0ClientID,
			EnvVar: EVAUTH0ClientID,
		},
	}

	app.Before = func(c *cli.Context) error {
		requiredFlags := []string{FlagAuth0Domain, FlagAuth0ClientID}
		for _, flag := range requiredFlags {
			if !c.IsSet(flag) {
				return fmt.Errorf("Please set required flag: '%v'", flag)
			}
		}

		return nil
	}

	app.Action = func(c *cli.Context) error {
		auth0Domain := c.String(FlagAuth0Domain)
		auth0ClientID := c.String(FlagAuth0ClientID)
		proxyURL := c.String(FlagProxyURL)

		am, err := ReadAssetManifest("build/asset-manifest.json")
		if err != nil {
			return err
		}

		config := Config{
			ProxyURL:      proxyURL,
			Auth0Domain:   auth0Domain,
			Auth0ClientID: auth0ClientID,
			CSSFilePath:   am.CSS,
			JSFilePath:    am.JS,
		}

		data, err := HyrdateHTML(config)
		if err != nil {
			return err
		}

		if err := ioutil.WriteFile("build/index.html", data, 0644); err != nil {
			return err
		}

		fs := http.FileServer(http.Dir("build"))
		http.Handle("/", fs)

		addr := fmt.Sprintf("0.0.0.0:%d", c.Int(FlagPort))
		log.Printf("[INFO] Listening on http://%s\n", addr)
		return http.ListenAndServe(addr, nil)
	}

	if err := app.Run(os.Args); err != nil {
		log.Fatal(err)
	}
}

func ReadAssetManifest(path string) (*AssetManifest, error) {
	amJSON, err := ioutil.ReadFile(path)
	if err != nil {
		return nil, err
	}

	var am *AssetManifest
	if err := json.Unmarshal(amJSON, &am); err != nil {
		return nil, err
	}

	return am, nil
}

func HyrdateHTML(c Config) ([]byte, error) {
	t, err := template.New("index.html").Parse(htmlTempl)
	if err != nil {
		return nil, err
	}

	var html bytes.Buffer
	if err := t.Execute(&html, c); err != nil {
		return nil, err
	}

	return html.Bytes(), nil
}

const htmlTempl = `<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
  <meta name="theme-color" content="#000000">
  <link rel="manifest" href="/manifest.json">
  <link rel="shortcut icon" href="/favicon.ico">
  <title>Orca</title>
  <link href="{{.CSSFilePath}}" rel="stylesheet">
  <script id="config">
    window.config = {
      proxyURL: {{.ProxyURL}},
      auth0Domain: {{.Auth0Domain}},
      auth0ClientID: {{.Auth0ClientID}},
    }
  </script>
</head>

<body><noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root"></div>
  <script type="text/javascript" src="{{.JSFilePath}}"></script>
</body>

</html>
`
