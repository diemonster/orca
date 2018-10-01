package controllers

import (
	"net/http"

	"github.com/zpatrick/handler"
)

// todo: determine http status for different error types
func NewErrorHandler(err error) http.Handler {
	return handler.Error(http.StatusInternalServerError, err)
}
