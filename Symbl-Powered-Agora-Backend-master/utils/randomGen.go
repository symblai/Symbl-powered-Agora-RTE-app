package utils

import (
	"crypto/rand"
	"io"

	"github.com/gofrs/uuid"
)

// GenerateDTMF generates a random string of 8 digits
func GenerateDTMF() (*string, error) {
	const size = 8
	table := [...]byte{'1', '2', '3', '4', '5', '6', '7', '8', '9', '0'}

	b := make([]byte, size)
	n, err := io.ReadAtLeast(rand.Reader, b, size)
	if n != size {
		return nil, err
	}

	for i := 0; i < len(b); i++ {
		b[i] = table[int(b[i])%len(table)]
	}

	result := string(b)
	return &result, nil
}

// GenerateUUID generates a uuid string
func GenerateUUID() (string, error) {
	uuid, err := uuid.NewV4()
	if err != nil {
		return "", err
	}

	return uuid.String(), nil
}
