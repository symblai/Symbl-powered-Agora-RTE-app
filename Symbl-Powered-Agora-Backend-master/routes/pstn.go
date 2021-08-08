package routes

import (
	"fmt"
	"math/rand"
	"net/http"
	"text/template"
	"strings"

	"github.com/rs/zerolog/log"
	"github.com/spf13/viper"

	"github.com/samyak-jain/agora_backend/models"
	"github.com/samyak-jain/agora_backend/utils"
)

type PSTNTemplate struct {
	Host string
}

// PSTNConfig returns the reuqired configuration to setup VoiceAPI
func (o *Router) PSTNConfig(w http.ResponseWriter, r *http.Request) {
	t, err := template.ParseFiles("web/collectID.json")
	if err != nil {
		fmt.Fprint(w, "Internal Server Error")
		return
	}

	t.Execute(w, PSTNTemplate{r.Host})
}

// DTMFHandler handles DTMF
func (o *Router) DTMFHandler(w http.ResponseWriter, r *http.Request) {
	dtmf := r.URL.Query().Get("id")

	var channelData models.Channel
	if err := o.DB.Where("DTMF = ?", dtmf).First(&channelData).Error; err != nil {
		log.Error().Err(err).Str("DTMF", dtmf).Msg("DTMF not found")
	}

	uid := int(rand.Uint32())
	tokenData, err := utils.GetRtcToken(channelData.Name, uid)
	if err != nil {
		log.Error().Err(err).Msg("token generation failed")
	}

	responseString := `{
		"merge":true,
		"commands":[
			{
				"joinAgora": {
					"app": "{{AppID}}",
					"channel": "{{Channel}}",
					"channelKey": "{{Token}}",
					"uid": {{UID}}
				}
			}
		]
	}`

	finalResult := strings.Replace(responseString, "{{AppID}}", viper.GetString("APP_ID"), 1)
	finalResult = strings.Replace(finalResult, "{{Channel}}", channelData.Name, 1)
	finalResult = strings.Replace(finalResult, "{{Token}}", tokenData, 1)
	finalResult = strings.Replace(finalResult, "{{UID}}", fmt.Sprint(uid), 1)

	log.Info().Str("result", finalResult)
	byt := []byte(finalResult)

	w.Header().Set("Content-Type", "application/json")
	w.Write(byt)
}
