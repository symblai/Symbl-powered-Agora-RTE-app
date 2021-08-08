package routes

import (
	"fmt"
	"html/template"
	"net/http"

	"github.com/spf13/viper"
)

// MobileOAuthHandler is a REST route that is called when the oauth provider redirects to here and provides the code
func (o *Router) MobileOAuthHandler(w http.ResponseWriter, r *http.Request) {
	_, token, err := Handler(w, r, o.DB, "mobile")
	if err != nil {
		fmt.Fprint(w, "Internal Server Error")
		return
	}

	t, err := template.ParseFiles("web/mobile.html")
	if err != nil {
		fmt.Fprint(w, "Internal Server Error")
		return
	}

	t.Execute(w, TokenTemplate{
		Token:  *token,
		Scheme: viper.GetString("SCHEME"),
	})
}
