package models

import (
	"os"

	"github.com/jinzhu/gorm"

	// Importing postgres driver
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

// Database contains a pointer to the database object
type Database struct {
	*gorm.DB
}

// CreateDB is used to initialize a new database connection
func CreateDB(dbURL string) (*Database, error) {
	db, err := gorm.Open("postgres", os.Getenv("PG_DB_DETAILS"))
	if err != nil {
		return nil, err
	}

	// TODO: Setup Production Migrations
	return &Database{db}, nil
}
