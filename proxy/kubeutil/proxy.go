package kubeutil

import (
	"net/http/httputil"
	"net/url"
	"strings"

	"k8s.io/client-go/rest"
)

func NewReverseProxy(config *rest.Config) (*httputil.ReverseProxy, error) {
	rp := httputil.NewSingleHostReverseProxy(&url.URL{
		Host:   strings.TrimPrefix(config.Host, "https://"),
		Scheme: "https",
	})

	transport, err := rest.TransportFor(config)
	if err != nil {
		return nil, err
	}

	rp.Transport = transport
	return rp, nil
}
