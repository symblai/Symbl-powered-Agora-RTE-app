package utils

import (
	"fmt"

	"github.com/spf13/viper"
)

// AgoraConfig stores the server side config for token generation
type AgoraConfig struct {
	AppID          string
	AppCertificate string
}

// SetupConfig configures the boilerplate for viper
func SetupConfig() {
	viper.SetConfigName("config.json")
	viper.SetConfigType("json")
	viper.AddConfigPath(".")
	err := viper.ReadInConfig() // Find and read the config file
	if err != nil {             // Handle errors reading the config file
		panic(fmt.Errorf("Fatal error config file: %s", err))
	}

	viper.SetDefault("RECORDING_VENDOR", 1)
	viper.SetDefault("RECORDING_REGION", 0)
	viper.AutomaticEnv()
	if viper.GetString("ENABLE_OAUTH") == "false" {
		viper.Set("ENABLE_OAUTH", false)
	}
}

// GetPORT fetches the PORT
func GetPORT(defaultPort string) string {
	if port := viper.GetString("PORT"); port != "" {
		return port
	}

	return defaultPort
}

// GetDBURL fetches the database string
func GetDBURL() string {
	return viper.GetString("DATABASE_URL")
}

// GetMigrationSource gets the url from which the database migrations are fetched from
func GetMigrationSource() string {
	if source := viper.GetString("MIGRATION_SOURCE"); source != "" {
		return source
	}

	return "file://db/migrations"
}

// GetAllowedOrigin returns origin in the environment variable, else allows all origins
func GetAllowedOrigin() string {
	if origin := viper.GetString("ALLOWED_ORIGIN"); origin != "" {
		return origin
	}

	return "*"
}
