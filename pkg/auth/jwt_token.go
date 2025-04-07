package auth

import (
	"errors"
	"github.com/dgrijalva/jwt-go"
	"time"
)

const tokenTTL = 12 * time.Hour

var signingKey string

func SetSigningKey(key string) {
	signingKey = key
}

type tokenClaims struct {
	jwt.StandardClaims
	UserId   int    `json:"user_id"`
	UserRole string `json:"user_role"`
}

func GenerateToken(role string, id int) (string, error) {

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, &tokenClaims{
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(tokenTTL).Unix(),
			IssuedAt:  time.Now().Unix(),
		},
		id,
		role,
	})

	return token.SignedString([]byte(signingKey))
}

func ParseToken(accessToken string) (int, string, error) {
	token, err := jwt.ParseWithClaims(accessToken, &tokenClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("invalid signing method")
		}

		return []byte(signingKey), nil
	})
	if err != nil {
		return 0, "", err
	}

	claims, ok := token.Claims.(*tokenClaims)
	if !ok {
		return 0, "", errors.New("token claims are not of type *tokenClaims")
	}

	return claims.UserId, claims.UserRole, nil
}
