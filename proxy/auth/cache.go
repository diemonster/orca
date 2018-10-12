package auth

import (
	"net/http"
	"time"

	"github.com/quintilesims/auth0"
	cache "github.com/zpatrick/go-cache"
)

type TokenStatus struct {
	IsValid bool
	Profile *auth0.Profile
}

func CachedGetProfileFunc(getProfile GetProfileFunc, expiry time.Duration) GetProfileFunc {
	c := cache.New()
	return func(token string) (*auth0.Profile, error) {
		if v, ok := c.GetOK(token); ok {
			return cachedToken(v.(TokenStatus))
		}

		profile, err := getProfile(token)
		if err != nil {
			if err, ok := err.(auth0.Error); ok && err.Status == http.StatusUnauthorized {
				c.Set(token, TokenStatus{IsValid: false})
				return nil, InvalidToken
			}

			return nil, err
		}

		c.Set(token, TokenStatus{IsValid: true, Profile: profile}, cache.Expire(expiry))
		return profile, nil
	}
}

func cachedToken(status TokenStatus) (*auth0.Profile, error) {
	if status.IsValid {
		return status.Profile, nil
	}

	return nil, InvalidToken
}
