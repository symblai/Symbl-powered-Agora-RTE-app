package middleware

import (
	"context"
	"fmt"
	"net/http"
	"strings"

	"github.com/rs/zerolog/log"
	"github.com/samyak-jain/agora_backend/models"
	"github.com/spf13/viper"
	"github.com/urfave/negroni"
)

type contextKey struct {
	name string
}

var userContextKey = &contextKey{"user"}

// AuthHandler is a middleware for authentication
func AuthHandler(db *models.Database) negroni.HandlerFunc {
	return negroni.HandlerFunc(func(w http.ResponseWriter, r *http.Request, next http.HandlerFunc) {
		if r.Method == "OPTIONS" {
			next.ServeHTTP(w, r)
			return
		}

		if !viper.GetBool("ENABLE_OAUTH") {
			next.ServeHTTP(w, r)
			return
		}

		header := r.Header.Get("Authorization")

		if header == "" {
			log.Debug().Msg("No Token Provided")
			next.ServeHTTP(w, r)
		} else {
			splitToken := strings.Split(header, "Bearer ")
			token := splitToken[1]

			var tokenData models.Token
			var user models.User

			if db.Where("token_id = ?", token).First(&tokenData).RecordNotFound() {
				w.WriteHeader(http.StatusUnauthorized)
				log.Debug().Str("token", token).Msg("Passed Invalid token")
			} else if err := db.Where("email = ?", tokenData.UserEmail).First(&user).Error; err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				log.Error().Str("email", tokenData.UserEmail).Str("token", token).Msg("Email does not exist for the provided token")
			} else {
				ctx := context.WithValue(r.Context(), userContextKey, &user)
				next.ServeHTTP(w, r.WithContext(ctx))
			}

		}
	})
}

func SymblAuthHandler(db *models.Database) negroni.HandlerFunc {
	return negroni.HandlerFunc(func(w http.ResponseWriter, r *http.Request, next http.HandlerFunc) {
		if r.Method == "OPTIONS" {
			next.ServeHTTP(w, r)
			return
		}

		fmt.Println("=====SymblAuthHandler")
		next.ServeHTTP(w, r)
	})
}

// GetUserFromContext fetches the user from the context
func GetUserFromContext(ctx context.Context) *models.User {
	return ctx.Value(userContextKey).(*models.User)
}
