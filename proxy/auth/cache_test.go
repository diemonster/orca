package auth

import (
	"net/http"
	"testing"
	"time"

	"github.com/quintilesims/auth0"
	"github.com/stretchr/testify/assert"
)

func TestCachedGetProfileFunc_utilizesGetProfileCorrectly(t *testing.T) {
	var called bool
	getProfile := func(token string) (*auth0.Profile, error) {
		called = true
		assert.Equal(t, "some_token", token)
		return &auth0.Profile{Email: "some_email"}, nil
	}

	profile, err := CachedGetProfileFunc(getProfile, time.Minute)("some_token")
	if err != nil {
		t.Fatal(err)
	}

	assert.True(t, called)
	assert.Equal(t, "some_email", profile.Email)
}

func TestCachedGetProfileFunc_validTokensAreCached(t *testing.T) {
	var calls int
	getProfile := func(token string) (*auth0.Profile, error) {
		calls++
		return &auth0.Profile{Email: "some_email"}, nil
	}

	target := CachedGetProfileFunc(getProfile, time.Minute)
	for i := 0; i < 5; i++ {
		profile, err := target("")
		if err != nil {
			t.Fatal(err)
		}

		assert.Equal(t, "some_email", profile.Email)
	}

	assert.Equal(t, 1, calls)
}

func TestCachedGetProfileFunc_validTokenExpiryIsHonored(t *testing.T) {
	var calls int
	getProfile := func(token string) (*auth0.Profile, error) {
		calls++
		return &auth0.Profile{}, nil
	}

	target := CachedGetProfileFunc(getProfile, time.Nanosecond)
	target("")
	time.Sleep(time.Millisecond)
	target("")

	assert.Equal(t, 2, calls)
}

func TestCachedGetProfileFunc_invalidTokensAreCached(t *testing.T) {
	var calls int
	getProfile := func(token string) (*auth0.Profile, error) {
		calls++
		return nil, auth0.Error{Status: http.StatusUnauthorized}
	}

	target := CachedGetProfileFunc(getProfile, time.Minute)
	for i := 0; i < 5; i++ {
		if _, err := target("some_token"); err == nil {
			t.Fatalf("Error was nil")
		}
	}

	assert.Equal(t, 1, calls)
}
