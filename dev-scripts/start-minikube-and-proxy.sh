#!/bin/bash

minikube --vm-driver hyperkit --extra-config=apiserver.authorization-mode=RBAC --extra-config=apiserver.cors-allowed-origins=localhost,http://localhost start && kubectl proxy -p 8080
