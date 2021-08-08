package migrations

import (
	"log"

	"github.com/samyak-jain/agora_backend/models"
	"github.com/samyak-jain/agora_backend/utils"
)

// RunMigration runs the schema migrations
func RunMigration() {
	utils.SetupConfig()
	db, err := models.CreateDB(utils.GetDBURL())
	if err != nil {
		log.Print(err)
		return
	}

	defer db.Close()

	db.AutoMigrate(&models.User{}, &models.Channel{}, &models.Token{})
}
