package main

import (
	"log"
	"net/http"
	"net/http/httputil"

	"k8s.io/client-go/rest"
	"k8s.io/client-go/transport"
)

func main() {
	// todo: flags to switch between in-cluster and local development? 
	config, err := rest.InClusterConfig()
	if err != nil {
		log.Fatal(err)
	}

	// https://github.com/kubernetes/client-go/blob/02384dbe123ff097a279965297f327a72ebefb72/transport/round_trippers.go#L100
	// https://github.com/kubernetes/client-go/blob/02384dbe123ff097a279965297f327a72ebefb72/transport/transport.go
	handler := func(w http.ResponseWriter, r *http.Request) {
		// todo: update config.Impersonate with data from request header
		
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

}
