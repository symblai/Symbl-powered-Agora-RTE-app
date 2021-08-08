package graph

import "github.com/samyak-jain/agora_backend/models"

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

// Resolver is used for state management
type Resolver struct {
	DB *models.Database
}
