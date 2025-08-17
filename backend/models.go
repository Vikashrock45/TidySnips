package main

// Request represents the incoming format/minify request
type Request struct {
	Code     string `json:"code" validate:"required"`
	Language string `json:"language" validate:"required"`
}

// Response represents the API response
type Response struct {
	Success   bool   `json:"success"`
	Code      string `json:"code,omitempty"`
	Output    string `json:"output,omitempty"`
	Error     string `json:"error,omitempty"`
	Timestamp string `json:"timestamp"`
}
