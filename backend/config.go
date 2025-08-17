package main

import (
	"os"
	"strconv"
	"strings"
	"time"
)

// Config holds all configuration for the application
type Config struct {
	Server    ServerConfig
	RateLimit RateLimitConfig
	Request   RequestConfig
	CORS      CORSConfig
	Logging   LoggingConfig
	Security  SecurityConfig
}

// ServerConfig holds server-specific configuration
type ServerConfig struct {
	Port         string
	Host         string
	Environment  string
	ReadTimeout  time.Duration
	WriteTimeout time.Duration
	IdleTimeout  time.Duration
}

// RateLimitConfig holds rate limiting configuration
type RateLimitConfig struct {
	RequestsPerMinute int
	WindowSeconds     int
}

// RequestConfig holds request-specific configuration
type RequestConfig struct {
	MaxSize int64
}

// CORSConfig holds CORS configuration
type CORSConfig struct {
	AllowedOrigins []string
	AllowedMethods []string
	AllowedHeaders []string
}

// LoggingConfig holds logging configuration
type LoggingConfig struct {
	Level  string
	Format string
}

// SecurityConfig holds security feature toggles
type SecurityConfig struct {
	EnableRateLimiting bool
	EnableLogging      bool
	EnableCORS         bool
}

// LoadConfig loads configuration from environment variables
func LoadConfig() *Config {
	return &Config{
		Server: ServerConfig{
			Port:         getEnvOrDefault("PORT", "8080"),
			Host:         getEnvOrDefault("HOST", "localhost"),
			Environment:  getEnvOrDefault("GO_ENV", "development"),
			ReadTimeout:  time.Duration(getEnvAsIntOrDefault("READ_TIMEOUT", 10)) * time.Second,
			WriteTimeout: time.Duration(getEnvAsIntOrDefault("WRITE_TIMEOUT", 10)) * time.Second,
			IdleTimeout:  time.Duration(getEnvAsIntOrDefault("IDLE_TIMEOUT", 120)) * time.Second,
		},
		RateLimit: RateLimitConfig{
			RequestsPerMinute: getEnvAsIntOrDefault("RATE_LIMIT_REQUESTS", 100),
			WindowSeconds:     getEnvAsIntOrDefault("RATE_LIMIT_WINDOW", 60),
		},
		Request: RequestConfig{
			MaxSize: int64(getEnvAsIntOrDefault("MAX_REQUEST_SIZE", 1048576)), // 1MB default
		},
		CORS: CORSConfig{
			AllowedOrigins: strings.Split(getEnvOrDefault("ALLOWED_ORIGINS", "http://localhost:3000"), ","),
			AllowedMethods: strings.Split(getEnvOrDefault("ALLOWED_METHODS", "GET,POST,OPTIONS"), ","),
			AllowedHeaders: strings.Split(getEnvOrDefault("ALLOWED_HEADERS", "Content-Type,Authorization"), ","),
		},
		Logging: LoggingConfig{
			Level:  getEnvOrDefault("LOG_LEVEL", "info"),
			Format: getEnvOrDefault("LOG_FORMAT", "text"),
		},
		Security: SecurityConfig{
			EnableRateLimiting: getEnvAsBoolOrDefault("ENABLE_RATE_LIMITING", true),
			EnableLogging:      getEnvAsBoolOrDefault("ENABLE_LOGGING", true),
			EnableCORS:         getEnvAsBoolOrDefault("ENABLE_CORS", true),
		},
	}
}

// Helper functions for environment variable parsing
func getEnvOrDefault(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvAsIntOrDefault(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}
	return defaultValue
}

func getEnvAsBoolOrDefault(key string, defaultValue bool) bool {
	if value := os.Getenv(key); value != "" {
		if boolValue, err := strconv.ParseBool(value); err == nil {
			return boolValue
		}
	}
	return defaultValue
}

// IsProduction returns true if running in production environment
func (c *Config) IsProduction() bool {
	return c.Server.Environment == "production"
}

// IsDevelopment returns true if running in development environment
func (c *Config) IsDevelopment() bool {
	return c.Server.Environment == "development"
}

// GetServerAddress returns the full server address
func (c *Config) GetServerAddress() string {
	return c.Server.Host + ":" + c.Server.Port
}
