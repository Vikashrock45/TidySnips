package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

func main() {
	// Load configuration
	config := LoadConfig()

	// Create rate limiter with config
	rateLimiter := NewRateLimiter(config.RateLimit.RequestsPerMinute, time.Duration(config.RateLimit.WindowSeconds)*time.Second)

	// Create handlers with config
	handlers := &Handlers{config: config}

	// Create a new HTTP mux
	mux := http.NewServeMux()

	// Register routes with API versioning
	mux.HandleFunc("/api/v1/format", handlers.FormatHandler)
	mux.HandleFunc("/api/v1/minify", handlers.MinifyHandler)
	mux.HandleFunc("/api/v1/health", handlers.HealthHandler)

	// Apply middleware based on configuration
	var handler http.Handler = mux

	if config.Security.EnableCORS {
		handler = CORSMiddleware(config)(handler)
	}

	if config.Security.EnableRateLimiting {
		handler = RateLimitMiddleware(rateLimiter)(handler)
	}

	if config.Security.EnableLogging {
		handler = LoggingMiddleware(config)(handler)
	}

	// Create server with configuration
	srv := &http.Server{
		Addr:         ":" + config.Server.Port,
		Handler:      handler,
		ReadTimeout:  config.Server.ReadTimeout,
		WriteTimeout: config.Server.WriteTimeout,
		IdleTimeout:  config.Server.IdleTimeout,
	}

	// Start server in goroutine
	go func() {
		log.Printf("Server starting on port %s (environment: %s)", config.Server.Port, config.Server.Environment)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server failed to start: %v", err)
		}
	}()

	// Graceful shutdown
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)

	<-c
	log.Println("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("Server exited")
}
