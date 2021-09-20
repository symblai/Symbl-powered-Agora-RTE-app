package models

import (
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
	db, err := gorm.Open("postgres", "postgres://ufkfnqnxkzcvnl:285eee312dee11c2282637101e1abab238bba9f86ca9643b063fda4ec21b4d2e@ec2-54-158-247-97.compute-1.amazonaws.com:5432/d2q7nhhmoclhrh")
	if err != nil {
		return nil, err
	}

	// TODO: Setup Production Migrations
	return &Database{db}, nil
}
