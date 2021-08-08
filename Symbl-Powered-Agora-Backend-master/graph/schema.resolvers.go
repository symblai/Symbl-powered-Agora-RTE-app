package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/rs/zerolog/log"
	"github.com/samyak-jain/agora_backend/graph/generated"
	"github.com/samyak-jain/agora_backend/graph/model"
	"github.com/samyak-jain/agora_backend/middleware"
	"github.com/samyak-jain/agora_backend/models"
	"github.com/samyak-jain/agora_backend/utils"
	"github.com/spf13/viper"
)

var errInternalServer error = errors.New("Internal Server Error")
var errBadRequest error = errors.New("Bad Request")

func (r *mutationResolver) CreateChannel(ctx context.Context, title string, enablePstn *bool) (*model.ShareResponse, error) {
	if viper.GetBool("ENABLE_OAUTH") {
		authUser := middleware.GetUserFromContext(ctx)
		if authUser == nil {
			log.Debug().Str("Email", authUser.Email).Msg("Invalid Token")
			return nil, errors.New("Invalid Token")
		}
	}

	var pstnResponse *model.Pstn
	var newChannel *models.Channel
	recorder := &utils.Recorder{}
	err := recorder.GetSymblToken()
	fmt.Println("-->recorder.SymblToken", recorder.SymblToken)

	hostPhrase, err := utils.GenerateUUID()
	if err != nil {
		log.Error().Err(err).Msg("Host Phrase generation failed")
		return nil, errInternalServer
	}

	viewPhrase, err := utils.GenerateUUID()
	if err != nil {
		log.Error().Err(err).Msg("View Phrase generation failed")
		return nil, errInternalServer
	}

	channelName, err := utils.GenerateUUID()
	if err != nil {
		log.Error().Err(err).Msg("Channel Name generation failed")
		return nil, errInternalServer
	}

	channel := strings.ReplaceAll(channelName, "-", "")

	secretGen, err := utils.GenerateUUID()
	if err != nil {
		return nil, err
	}
	secret := strings.ReplaceAll(secretGen, "-", "")

	if *enablePstn {
		dtmfResult, err := utils.GenerateDTMF()
		if err != nil {
			log.Error().Err(err).Msg("DTMF generation failed")
			return nil, errInternalServer
		}

		pstnResponse = &model.Pstn{
			Number: viper.GetString("PSTN_NUMBER"),
			Dtmf:   *dtmfResult,
		}

		newChannel = &models.Channel{
			Title:            title,
			Name:             channel,
			Secret:           secret,
			HostPassphrase:   hostPhrase,
			ViewerPassphrase: viewPhrase,
			DTMF:             *dtmfResult,
			SymblToken:       recorder.SymblToken,
			SymblExpires:     recorder.SymblExpires,
		}

	} else {
		pstnResponse = nil
		newChannel = &models.Channel{
			Title:            title,
			Name:             channel,
			Secret:           secret,
			HostPassphrase:   hostPhrase,
			ViewerPassphrase: viewPhrase,
			SymblToken:       recorder.SymblToken,
			SymblExpires:     recorder.SymblExpires,
		}
	}

	if err := r.DB.Create(newChannel).Error; err != nil {
		log.Error().Err(err).Msg("Adding new channel to DB Failed")
		return nil, errInternalServer
	}

	return &model.ShareResponse{
		Passphrase: &model.Passphrase{
			SymblToken:   recorder.SymblToken,
			SymblExpires: recorder.SymblExpires,
			Host:         &hostPhrase,
			View:         viewPhrase,
		},
		Title:   title,
		Channel: channel,
		Pstn:    pstnResponse,
	}, nil
}

func (r *mutationResolver) UpdateUserName(ctx context.Context, name string) (*model.User, error) {
	if !viper.GetBool("ENABLE_OAUTH") {
		return nil, nil
	}

	authUser := middleware.GetUserFromContext(ctx)
	if authUser == nil {
		log.Debug().Str("Email", authUser.Email).Msg("Invalid Token")
		return nil, errors.New("Invalid Token")
	}

	user := &models.User{Email: authUser.Email}
	if err := r.DB.Model(&user).Update("name", name).Error; err != nil {
		log.Error().Err(err).Msg("Username update failed")
		return nil, errInternalServer
	}

	return &model.User{
		Name:  name,
		Email: authUser.Email,
	}, nil
}

func (r *mutationResolver) StartRecordingSession(ctx context.Context, passphrase string, secret *string) (string, error) {
	var channelData models.Channel
	var host bool

	if passphrase == "" {
		return "", errors.New("Passphrase cannot be empty")
	}

	if r.DB.Where("host_passphrase = ?", passphrase).First(&channelData).RecordNotFound() {
		if r.DB.Where("viewer_passphrase = ?", passphrase).First(&channelData).RecordNotFound() {
			log.Debug().Str("passphrase", passphrase).Msg("Invalid Passphrase")
			return "", errors.New("Invalid passphrase")
		}

		host = false
	} else {
		host = true
	}

	if !host {
		log.Debug().Str("passphrase", passphrase).Str("channel", channelData.Name).Msg("Unauthorized to record channel")
		return "", errors.New("Unauthorised to record channel")
	}

	recorder := &utils.Recorder{}
	recorder.Channel = channelData.Name

	err := recorder.Acquire()
	if err != nil {
		log.Error().Err(err).Msg("Acquire Failed")
		return "", errInternalServer
	}

	err = recorder.Start(secret)
	if err != nil {
		log.Error().Err(err).Msg("Start Failed")
		return "", errInternalServer
	}

	if err := r.DB.Model(&channelData).Update("Recording", &models.Recording{
		UID: recorder.UID,
		SID: recorder.SID,
		RID: recorder.RID,
	}).Error; err != nil {
		log.Error().Err(err).Msg("Updating database for recording failed")
		return "", errInternalServer
	}

	return "success", nil
}

func (r *mutationResolver) StopRecordingSession(ctx context.Context, passphrase string) (string, error) {
	var channelData models.Channel
	var host bool

	if passphrase == "" {
		return "", errors.New("Passphrase cannot be empty")
	}

	if r.DB.Where("host_passphrase = ?", passphrase).First(&channelData).RecordNotFound() {
		if r.DB.Where("viewer_passphrase = ?", passphrase).First(&channelData).RecordNotFound() {
			log.Debug().Str("passphrase", passphrase).Msg("Invalid Passphrase")
			return "", errors.New("Invalid passphrase")
		}

		host = false
	} else {
		host = true
	}

	if !host {
		log.Debug().Str("passphrase", passphrase).Str("channel", channelData.Name).Msg("Unauthorized to record channel")
		return "", errors.New("Unauthorised to record channel")
	}

	var record models.Recording
	r.DB.Model(&channelData).Related(&record)

	err := utils.Stop(channelData.Name, record.UID, record.RID, record.SID)
	if err != nil {
		log.Error().Err(err).Msg("Stop recording failed")
		return "", errInternalServer
	}

	return "success", nil
}

func (r *mutationResolver) LogoutSession(ctx context.Context, token string) ([]string, error) {
	authUser := middleware.GetUserFromContext(ctx)
	if authUser == nil {
		log.Debug().Str("Email", authUser.Email).Msg("Invalid Token")
		return nil, errors.New("Invalid Token")
	}

	tokenIndex := -1

	if err := r.DB.Preload("Tokens").Find(&authUser).Error; err != nil {
		log.Error().Err(err).Msg("Could not load token association")
		return nil, errInternalServer
	}

	for index := range authUser.Tokens {
		if authUser.Tokens[index].TokenID == token {
			tokenIndex = index
		}
	}

	if tokenIndex == -1 {
		log.Debug().Str("Email", authUser.Email).Msg("Token does not exist")
		return nil, errBadRequest
	}

	if err := r.DB.Where("token_id = ?", token).Delete(models.Token{}).Error; err != nil {
		log.Error().Err(err).Msg("Could not delete token from database")
		return nil, errInternalServer
	}

	return authUser.GetAllTokens(), nil
}

func (r *mutationResolver) LogoutAllSessions(ctx context.Context) (*string, error) {
	authUser := middleware.GetUserFromContext(ctx)
	if authUser == nil {
		log.Debug().Str("Email", authUser.Email).Msg("Invalid Token")
		return nil, errors.New("Invalid Token")
	}

	if err := r.DB.Where("user_email = ?", authUser.Email).Delete(models.Token{}).Error; err != nil {
		log.Error().Err(err).Msg("Could not delete all the tokens from the database")
		return nil, errInternalServer
	}

	return nil, nil
}

func (r *queryResolver) JoinChannel(ctx context.Context, passphrase string) (*model.Session, error) {
	var channelData models.Channel
	var host bool

	currentTimestamp := time.Now()
	recorder := &utils.Recorder{}
	if currentTimestamp.Sub(channelData.CreatedAt) > time.Duration(channelData.SymblExpires*1e9) {
		err := recorder.GetSymblToken()
		if err != nil {
			log.Error().Err(err).Msg("Error getting the symbl token")
		}
	}
	log.Printf("-->currentTimestamp%+v", currentTimestamp)
	log.Printf("-->channelData.CreatedAt%+v", channelData.CreatedAt)
	log.Printf("-->channelData.SymblExpires%+v", channelData.SymblExpires)

	if passphrase == "" {
		return nil, errors.New("Passphrase cannot be empty")
	}

	if r.DB.Where("host_passphrase = ?", passphrase).First(&channelData).RecordNotFound() {
		if r.DB.Where("viewer_passphrase = ?", passphrase).First(&channelData).RecordNotFound() {
			log.Debug().Str("passphrase", passphrase).Msg("Invalid Passphrase")
			return nil, errors.New("Invalid passphrase")
		}

		host = false
	} else {
		host = true
	}

	mainUser, err := utils.GenerateUserCredentials(channelData.Name, true, recorder.SymblToken, recorder.SymblExpires)
	if err != nil {
		log.Error().Err(err).Msg("Could not generate main user credentials")
		return nil, errInternalServer
	}

	screenShare, err := utils.GenerateUserCredentials(channelData.Name, false, recorder.SymblToken, recorder.SymblExpires)
	if err != nil {
		log.Error().Err(err).Msg("Could not generate screenshare user credentails")
		return nil, errInternalServer
	}

	return &model.Session{
		Title:       channelData.Title,
		Channel:     channelData.Name,
		IsHost:      host,
		MainUser:    mainUser,
		ScreenShare: screenShare,
		Secret:      channelData.Secret,
	}, nil
}

func (r *queryResolver) Share(ctx context.Context, passphrase string) (*model.ShareResponse, error) {
	var channelData models.Channel
	var host bool

	if passphrase == "" {
		return nil, errors.New("Passphrase cannot be empty")
	}

	if r.DB.Where("host_passphrase = ?", passphrase).First(&channelData).RecordNotFound() {
		if r.DB.Where("viewer_passphrase = ?", passphrase).First(&channelData).RecordNotFound() {
			log.Debug().Str("passphrase", passphrase).Msg("Invalid Passphrase")
			return nil, errors.New("Invalid passphrase")
		}

		host = false
	} else {
		host = true
	}

	var hostPassphrase *string
	if host {
		hostPassphrase = &channelData.HostPassphrase
	} else {
		hostPassphrase = nil
	}

	var pstnResult *model.Pstn
	if channelData.DTMF != "" {
		pstnResult = &model.Pstn{
			Number: viper.GetString("PSTN_NUMBER"),
			Dtmf:   channelData.DTMF,
		}
	} else {
		pstnResult = nil
	}

	return &model.ShareResponse{
		Passphrase: &model.Passphrase{
			SymblToken:   channelData.SymblToken,
			SymblExpires: channelData.SymblExpires,
			Host:         hostPassphrase,
			View:         channelData.ViewerPassphrase,
		},
		Channel: channelData.Name,
		Title:   channelData.Title,
		Pstn:    pstnResult,
	}, nil
}

func (r *queryResolver) GetUser(ctx context.Context) (*model.User, error) {
	if !viper.GetBool("ENABLE_OAUTH") {
		return nil, nil
	}

	authUser := middleware.GetUserFromContext(ctx)
	if authUser == nil {
		log.Debug().Str("Email", authUser.Email).Msg("Invalid Token")
		return nil, errors.New("Invalid Token")
	}

	return &model.User{
		Name:  authUser.Name,
		Email: authUser.Email,
	}, nil
}

func (r *queryResolver) GetSessions(ctx context.Context) ([]string, error) {
	authUser := middleware.GetUserFromContext(ctx)
	if authUser == nil {
		log.Debug().Str("Email", authUser.Email).Msg("Invalid Token")
		return nil, errors.New("Invalid Token")
	}

	if err := r.DB.Preload("Tokens").Find(&authUser).Error; err != nil {
		log.Error().Err(err).Msg("Could not preload all the tokens")
		return nil, errInternalServer
	}

	return authUser.GetAllTokens(), nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
