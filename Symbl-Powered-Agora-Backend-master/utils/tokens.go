package utils

import (
	"fmt"
	"math/rand"
	"time"

	"github.com/samyak-jain/agora_backend/graph/model"
	"github.com/samyak-jain/agora_backend/utils/rtctoken"
	"github.com/samyak-jain/agora_backend/utils/rtmtoken"
	"github.com/spf13/viper"
)

// GetRtcToken generates token for Agora RTC SDK
func GetRtcToken(channel string, uid int) (string, error) {
	var RtcRole rtctoken.Role = rtctoken.RolePublisher

	currentTimestamp := uint32(time.Now().UTC().Unix())
	expireTimestamp := currentTimestamp + 86400

	return rtctoken.BuildTokenWithUID(viper.GetString("APP_ID"), viper.GetString("APP_CERTIFICATE"), channel, uint32(uid), RtcRole, expireTimestamp)
}

// GetRtmToken generates a token for Agora RTM SDK
func GetRtmToken(user string) (string, error) {

	currentTimestamp := uint32(time.Now().UTC().Unix())
	expireTimestamp := currentTimestamp + 86400

	return rtmtoken.BuildToken(viper.GetString("APP_ID"), viper.GetString("APP_CERTIFICATE"), user, rtmtoken.RoleRtmUser, expireTimestamp)
}

// GenerateUserCredentials generates uid, rtc and rtc token
func GenerateUserCredentials(channel string, rtm bool, symblT string, symblExp float64) (*model.UserCredentials, error) {
	uid := int(rand.Uint32())
	rtcToken, err := GetRtcToken(channel, uid)
	if err != nil {
		return nil, err
	}

	if !rtm {
		return &model.UserCredentials{
			Rtc:          rtcToken,
			UID:          uid,
			Symt:         symblT,
			SymblTExpire: symblExp,
		}, nil
	}

	rtmToken, err := GetRtmToken(fmt.Sprint(uid))
	if err != nil {
		return nil, err
	}

	return &model.UserCredentials{
		Rtc:          rtcToken,
		Rtm:          &rtmToken,
		UID:          uid,
		Symt:         symblT,
		SymblTExpire: symblExp,
	}, nil
}
