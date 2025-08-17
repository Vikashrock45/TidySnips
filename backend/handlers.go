package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"regexp"
	"strings"
	"time"
)

// Handlers struct holds configuration and provides HTTP handlers
type Handlers struct {
	config *Config
}

// FormatHandler handles code formatting requests
func (h *Handlers) FormatHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		h.respondError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Validate request
	if !h.validateRequest(w, r) {
		return
	}

	var req Request
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.respondError(w, "Invalid JSON payload", http.StatusBadRequest)
		return
	}

	// Validate input
	if strings.TrimSpace(req.Code) == "" {
		h.respondError(w, "Code field is required", http.StatusBadRequest)
		return
	}

	if strings.TrimSpace(req.Language) == "" {
		h.respondError(w, "Language field is required", http.StatusBadRequest)
		return
	}

	// Security check for suspicious code patterns
	if h.containsSuspiciousCode(req.Code) {
		h.respondError(w, "Code contains suspicious patterns", http.StatusBadRequest)
		return
	}

	// Format the code
	formatter := NewFormatter()
	formattedCode, err := formatter.Format(req.Code, req.Language)
	if err != nil {
		h.respondError(w, fmt.Sprintf("Formatting error: %v", err), http.StatusBadRequest)
		return
	}

	// Return successful response
	response := Response{
		Success:   true,
		Code:      formattedCode,
		Timestamp: time.Now().Format(time.RFC3339),
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

// MinifyHandler handles code minification requests
func (h *Handlers) MinifyHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		h.respondError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Validate request
	if !h.validateRequest(w, r) {
		return
	}

	var req Request
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.respondError(w, "Invalid JSON payload", http.StatusBadRequest)
		return
	}

	// Validate input
	if strings.TrimSpace(req.Code) == "" {
		h.respondError(w, "Code field is required", http.StatusBadRequest)
		return
	}

	if strings.TrimSpace(req.Language) == "" {
		h.respondError(w, "Language field is required", http.StatusBadRequest)
		return
	}

	// Security check for suspicious code patterns
	if h.containsSuspiciousCode(req.Code) {
		h.respondError(w, "Code contains suspicious patterns", http.StatusBadRequest)
		return
	}

	// Minify the code
	formatter := NewFormatter()
	minifiedCode, err := formatter.Minify(req.Code, req.Language)
	if err != nil {
		h.respondError(w, fmt.Sprintf("Minification error: %v", err), http.StatusBadRequest)
		return
	}

	// Return successful response
	response := Response{
		Success:   true,
		Code:      minifiedCode,
		Timestamp: time.Now().Format(time.RFC3339),
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

// HealthHandler handles health check requests
func (h *Handlers) HealthHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		h.respondError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	health := map[string]interface{}{
		"status":      "healthy",
		"timestamp":   time.Now().Format(time.RFC3339),
		"environment": h.config.Server.Environment,
		"version":     "1.0.0",
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(health)
}

// validateRequest performs common request validation
func (h *Handlers) validateRequest(w http.ResponseWriter, r *http.Request) bool {
	// Check Content-Type for POST requests
	if r.Method == http.MethodPost {
		contentType := r.Header.Get("Content-Type")
		if !strings.Contains(contentType, "application/json") {
			h.respondError(w, "Content-Type must be application/json", http.StatusBadRequest)
			return false
		}
	}

	// Check request size
	if r.ContentLength > h.config.Request.MaxSize {
		h.respondError(w, "Request body too large", http.StatusRequestEntityTooLarge)
		return false
	}

	// Limit request body size
	r.Body = http.MaxBytesReader(w, r.Body, h.config.Request.MaxSize)

	return true
}

// containsSuspiciousCode checks for potentially dangerous code patterns
func (h *Handlers) containsSuspiciousCode(code string) bool {
	suspiciousPatterns := []string{
		`eval\s*\(`,
		`exec\s*\(`,
		`system\s*\(`,
		`os\.system`,
		`subprocess`,
		`shell_exec`,
		`passthru`,
		`\$\{.*\}`,  // Template injection
		`<!--.*-->`, // HTML comments that might contain scripts
	}

	for _, pattern := range suspiciousPatterns {
		if matched, _ := regexp.MatchString(pattern, code); matched {
			return true
		}
	}

	return false
}

// respondError sends an error response
func (h *Handlers) respondError(w http.ResponseWriter, message string, statusCode int) {
	response := Response{
		Success:   false,
		Error:     message,
		Timestamp: time.Now().Format(time.RFC3339),
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(response)
}
