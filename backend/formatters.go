package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"go/format"
	"regexp"
	"strings"
)

// Formatter provides code formatting and minification capabilities
type Formatter struct{}

// NewFormatter creates a new Formatter instance
func NewFormatter() *Formatter {
	return &Formatter{}
}

// Format formats code based on the language
func (f *Formatter) Format(code, language string) (string, error) {
	return formatCode(language, code)
}

// Minify minifies code based on the language
func (f *Formatter) Minify(code, language string) (string, error) {
	return minifyCode(language, code)
}

func formatCode(language, code string) (string, error) {
	// Validate inputs
	if code == "" {
		return "", fmt.Errorf("code cannot be empty")
	}

	switch language {
	case "Go":
		return formatGoCode(code)
	case "JSON":
		return formatJSONCode(code)
	case "PHP":
		return formatPHPCode(code)
	case "JavaScript", "JS":
		return formatJavaScriptCode(code)
	default:
		return "", fmt.Errorf("unsupported language: %s", language)
	}
}

func minifyCode(language, code string) (string, error) {
	// Validate inputs
	if code == "" {
		return "", fmt.Errorf("code cannot be empty")
	}

	switch language {
	case "Go":
		// Go doesn't really "minify" - just format
		return formatGoCode(code)
	case "JSON":
		return minifyJSONCode(code)
	case "PHP":
		return minifyPHPCode(code)
	case "JavaScript", "JS":
		return minifyJavaScriptCode(code)
	default:
		return "", fmt.Errorf("unsupported language: %s", language)
	}
}

func formatGoCode(code string) (string, error) {
	formatted, err := format.Source([]byte(code))
	if err != nil {
		return "", fmt.Errorf("invalid Go syntax: %v", err)
	}
	return string(formatted), nil
}

func formatJSONCode(code string) (string, error) {
	var obj interface{}
	if err := json.Unmarshal([]byte(code), &obj); err != nil {
		return "", fmt.Errorf("invalid JSON syntax: %v", err)
	}

	formatted, err := json.MarshalIndent(obj, "", "  ")
	if err != nil {
		return "", fmt.Errorf("failed to format JSON: %v", err)
	}

	return string(formatted), nil
}

func minifyJSONCode(code string) (string, error) {
	var obj interface{}
	if err := json.Unmarshal([]byte(code), &obj); err != nil {
		return "", fmt.Errorf("invalid JSON syntax: %v", err)
	}

	minified, err := json.Marshal(obj)
	if err != nil {
		return "", fmt.Errorf("failed to minify JSON: %v", err)
	}

	return string(minified), nil
}

func formatPHPCode(code string) (string, error) {
	// Basic PHP formatting - add proper indentation
	lines := strings.Split(code, "\n")
	var formatted []string
	indent := 0

	for _, line := range lines {
		trimmed := strings.TrimSpace(line)
		if trimmed == "" {
			formatted = append(formatted, "")
			continue
		}

		// Decrease indent for closing braces
		if strings.HasPrefix(trimmed, "}") {
			indent--
		}

		// Add indentation
		indentedLine := strings.Repeat("    ", indent) + trimmed
		formatted = append(formatted, indentedLine)

		// Increase indent for opening braces
		if strings.HasSuffix(trimmed, "{") {
			indent++
		}
	}

	return strings.Join(formatted, "\n"), nil
}

func minifyPHPCode(code string) (string, error) {
	// Basic PHP minification - remove extra whitespace and comments
	// Remove single-line comments
	re1 := regexp.MustCompile(`//.*$`)
	code = re1.ReplaceAllString(code, "")

	// Remove multi-line comments
	re2 := regexp.MustCompile(`/\*[\s\S]*?\*/`)
	code = re2.ReplaceAllString(code, "")

	// Remove extra whitespace
	lines := strings.Split(code, "\n")
	var minified []string

	for _, line := range lines {
		trimmed := strings.TrimSpace(line)
		if trimmed != "" {
			minified = append(minified, trimmed)
		}
	}

	return strings.Join(minified, " "), nil
}

func formatJavaScriptCode(code string) (string, error) {
	// Basic JavaScript formatting
	var buffer bytes.Buffer
	indent := 0
	inString := false
	stringChar := byte(0)

	for i := 0; i < len(code); i++ {
		char := code[i]

		// Handle string literals
		if !inString && (char == '"' || char == '\'' || char == '`') {
			inString = true
			stringChar = char
			buffer.WriteByte(char)
			continue
		} else if inString && char == stringChar {
			inString = false
			buffer.WriteByte(char)
			continue
		} else if inString {
			buffer.WriteByte(char)
			continue
		}

		switch char {
		case '{':
			buffer.WriteByte(char)
			buffer.WriteByte('\n')
			indent++
			buffer.WriteString(strings.Repeat("  ", indent))
		case '}':
			buffer.WriteByte('\n')
			indent--
			buffer.WriteString(strings.Repeat("  ", indent))
			buffer.WriteByte(char)
		case ';':
			buffer.WriteByte(char)
			if i+1 < len(code) && code[i+1] != '}' {
				buffer.WriteByte('\n')
				buffer.WriteString(strings.Repeat("  ", indent))
			}
		case ' ', '\t', '\n', '\r':
			if buffer.Len() > 0 && buffer.Bytes()[buffer.Len()-1] != ' ' {
				buffer.WriteByte(' ')
			}
		default:
			buffer.WriteByte(char)
		}
	}

	return strings.TrimSpace(buffer.String()), nil
}

func minifyJavaScriptCode(code string) (string, error) {
	// Basic JavaScript minification
	var buffer bytes.Buffer
	inString := false
	stringChar := byte(0)

	for i := 0; i < len(code); i++ {
		char := code[i]

		// Handle string literals
		if !inString && (char == '"' || char == '\'' || char == '`') {
			inString = true
			stringChar = char
			buffer.WriteByte(char)
			continue
		} else if inString && char == stringChar {
			inString = false
			buffer.WriteByte(char)
			continue
		} else if inString {
			buffer.WriteByte(char)
			continue
		}

		// Skip whitespace outside strings
		if char == ' ' || char == '\t' || char == '\n' || char == '\r' {
			// Only add space if necessary for syntax
			if buffer.Len() > 0 {
				lastChar := buffer.Bytes()[buffer.Len()-1]
				if isAlphaNumeric(lastChar) && i+1 < len(code) && isAlphaNumeric(code[i+1]) {
					buffer.WriteByte(' ')
				}
			}
			continue
		}

		buffer.WriteByte(char)
	}

	return buffer.String(), nil
}

func isAlphaNumeric(char byte) bool {
	return (char >= 'a' && char <= 'z') ||
		(char >= 'A' && char <= 'Z') ||
		(char >= '0' && char <= '9') ||
		char == '_' || char == '$'
}
