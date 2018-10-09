# Helm Chart for Orca Proxy

## Install
To install this helm chart into your cluster, navigate to this directory and run `helm install`:
```console 
$ cd orca/proxy/helm
$ helm install --name orca-proxy orca-proxy
```

### Install w/ Minikube
If installing into a Minikube cluster, you can run the `minikube service list` to discover the endpoint for the Orca Proxy:
```console
$ minikube service list
|-------------|----------------------|---------------------------|
|  NAMESPACE  |         NAME         |            URL            |
|-------------|----------------------|---------------------------|
| default     | kubernetes           | No node port              |
| kube-system | kube-dns             | No node port              |
| kube-system | kubernetes-dashboard | http://192.168.64.5:30000 |
| kube-system | orca-proxy           | http://192.168.64.5:32404 |
| kube-system | tiller-deploy        | No node port              |
|-------------|----------------------|---------------------------|
```


## Update 
To update the helm chart, navigate to the `orca-proxy` directory and make the desired changes.
Then, run the following helm commands:
```console
$ cd orca/proxy/helm/orca-proxy
$ helm package .
$ helm repo index .
```
