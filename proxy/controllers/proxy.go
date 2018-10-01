package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/zpatrick/handler"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

const Authorization = "Authorization"

type ProxyController struct {
	client *kubernetes.Clientset
}

func NewProxyController(c *kubernetes.Clientset) *ProxyController {
	return &ProxyController{
		client: c,
	}
}

func (p *ProxyController) CreateNamespaces(r *http.Request) http.Handler {
	var req *corev1.Namespace
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		return handler.Error(http.StatusBadRequest, err)
	}

	namespace, err := p.client.CoreV1().Namespaces().Create(req)
	if err != nil {
		return NewErrorHandler(err)
	}

	return handler.JSON(http.StatusOK, namespace)
}

/*

func (p *ProxyController) DeleteNamespace(r *http.Request) http.Handler {
	client, err := p.exchangeToken(r.Header.Get(Authorization))
	if err != nil {
		return NewErrorHandler(err)
	}

	namespaceID := router.Segment(r.URL.Path, 3)
	if err := client.CoreV1().Namespaces
	var req *corev1.Namespace
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		return handler.Error(http.StatusBadRequest, err)
	}

	namespace, err := p.client.CoreV1().Namespaces().Create(req)
	if err != nil {
		return NewErrorHandler(err)
	}

	return handler.JSON(http.StatusOK, namespace)
}
*/

func (p *ProxyController) ListNamespaces(r *http.Request) http.Handler {
	namespaces, err := p.client.CoreV1().Namespaces().List(metav1.ListOptions{})
	if err != nil {
		return NewErrorHandler(err)
	}

	return handler.JSON(http.StatusOK, namespaces)
}
