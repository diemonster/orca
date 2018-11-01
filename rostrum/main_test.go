package main

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestHydrateHTML(t *testing.T) {
	expected := `<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
  <meta name="theme-color" content="#000000">
  <link rel="manifest" href="/manifest.json">
  <link rel="shortcut icon" href="/favicon.ico">
  <title>Orca</title>
  <link href="path/to/css" rel="stylesheet">
  <script id="config">
    window.config = {
      proxyURL: "localhost:9090",
      auth0Domain: "test.auth0.com",
      auth0ClientID: "12345",
    }
  </script>
</head>

<body><noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root"></div>
  <script type="text/javascript" src="path/to/js"></script>
</body>

</html>
`

	config := Config{
		ProxyURL:      "localhost:9090",
		Auth0Domain:   "test.auth0.com",
		Auth0ClientID: "12345",
		CSSFilePath:   "path/to/css",
		JSFilePath:    "path/to/js",
	}

	output, err := HyrdateHTML(config)
	if err != nil {
		t.Fatal(err)
	}

	assert.Equal(t, []byte(expected), output)
}
