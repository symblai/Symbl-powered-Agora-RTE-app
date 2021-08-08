package routes

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"net/http"
	"net/url"

	"github.com/rs/zerolog/log"
	"github.com/samyak-jain/agora_backend/utils"

	"github.com/samyak-jain/agora_backend/models"
	"github.com/spf13/viper"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

// GoogleOAuthUser contains all the information that we get as a response from oauth in google
type GoogleOAuthUser struct {
	GivenName     string `json:"given_name"`
	VerifiedEmail bool   `json:"verified_email"`
	Picture       string
	Locale        string
	ID            string
	Email         string
}

// Router refers to all the oauth endpoints
type Router struct {
	DB *models.Database
}

// TokenTemplate is a struct that will be used to template the token into the html that will be served for Desktop and Mobile
type TokenTemplate struct {
	Token  string
	Scheme string
}

// Handler is the handler that will do most of the heavy lifting for OAuth
func Handler(w http.ResponseWriter, r *http.Request, db *models.Database, platform string) (*string, *string, error) {
	err := r.ParseForm()
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		log.Error().Err(err).Msg("Could not parse form request")
		return nil, nil, err
	}

	code := r.FormValue("code")
	state := r.FormValue("state")

	decodedState, err := url.QueryUnescape(state)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		log.Error().Err(err).Msg("Could not url decode state")
		return nil, nil, err
	}

	parsedState, err := url.ParseQuery(decodedState)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Error().Err(err).Msg("Could not parse deocoded state")
		return nil, nil, err
	}

	redirect := parsedState.Get("redirect")
	backendURL := parsedState.Get("backend") // Remove trailing slash
	runeBackendURL := []rune(backendURL)
	if runeBackendURL[len(runeBackendURL)-1] == '/' {
		runeBackendURL = runeBackendURL[:len(runeBackendURL)-1]
	}

	finalBackendURL := string(runeBackendURL)
	var oauthConfig *oauth2.Config
	var userInfoURL string

	switch site := parsedState.Get("site"); site {
	case "google":
		oauthConfig = &oauth2.Config{
			ClientID:     viper.GetString("CLIENT_ID"),
			ClientSecret: viper.GetString("CLIENT_SECRET"),
			Scopes:       []string{"https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"},
			Endpoint:     google.Endpoint,
			RedirectURL:  finalBackendURL + "/oauth/" + platform,
		}
		userInfoURL = "https://www.googleapis.com/oauth2/v2/userinfo?access_token="
	default:
		w.WriteHeader(http.StatusBadRequest)
		log.Warn().Msg("Unknown state parameter passed")
		return nil, nil, nil
	}

	token, err := oauthConfig.Exchange(oauth2.NoContext, code)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Error().Err(err).Str("code", code).Msg("Could not exchange code for access token")
		return nil, nil, err
	}

	response, err := http.Get(userInfoURL + token.AccessToken)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Error().Err(err).Str("code", code).Str("token", token.AccessToken).Msg("Could not fetch user info details")
		return nil, nil, err
	}
	defer response.Body.Close()

	contents, err := ioutil.ReadAll(response.Body)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Error().Err(err).Msg("Could not read response body")
		return nil, nil, err
	}

	var user GoogleOAuthUser
	err = json.Unmarshal(contents, &user)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Error().Err(err).Str("body", string(contents)).Msg("Could not parse response body")
		return nil, nil, err
	}

	if !user.VerifiedEmail {
		w.WriteHeader(http.StatusBadRequest)
		log.Error().Err(err).Str("email", user.Email).Msg("Email is not verified")
		return nil, nil, errors.New("Email is not verified")
	}

	bearerToken, err := utils.GenerateUUID()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Error().Err(err).Msg("Could not generate bearer token")
		return nil, nil, err
	}

	var userData models.User
	if db.Where("email = ?", user.Email).First(&userData).RecordNotFound() {
		db.Create(&models.User{
			Name:  user.GivenName,
			Email: user.Email,
			Tokens: []models.Token{{
				TokenID: bearerToken,
			}},
		})
	} else {
		db.Model(&userData).Association("Tokens").Append(models.Token{
			TokenID: bearerToken,
		})
	}

	return &redirect, &bearerToken, nil
}
