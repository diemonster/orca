# Orca Rostrum (experimental)

The React frontend for the Orca service.

## Running locally

### Set up minikube and run the proxy
```
minikube --vm-driver hyperkit --extra-config=apiserver.authorization-mode=RBAC --extra-config=apiserver.cors-allowed-origins=localhost,http://localhost start

kubectl proxy -p 8080
```

### Install React dependencies and run the app
```
# this line necessary only once for initialization when you clone the repo
yarn install

yarn start
```
