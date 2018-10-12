package auth

import "github.com/quintilesims/auth0"

type GetProfileFunc func(token string) (*auth0.Profile, error)
