package auth

import (
	"crypto/sha1"
	"fmt"
)

var salt string

func SetSalt(configSalt string) {
	salt = configSalt
}

func GeneratePasswordHash(password string) string {
	hash := sha1.New()
	hash.Write([]byte(password))

	return fmt.Sprintf("%x", hash.Sum([]byte(salt)))
}
