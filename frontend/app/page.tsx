"use client";
import React, { useState, useEffect } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism.css";
// Import only core language support for Prism (these are more reliably available)
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-go";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";

const LANGUAGES = ["JavaScript", "TypeScript", "Go", "JSON", "CSS", "HTML"];

// Language to Prism mapping (using fallbacks for reliability)
const PRISM_LANGUAGE_MAP: { [key: string]: string } = {
  "JavaScript": "javascript",
  "TypeScript": "typescript", 
  "Go": "go",
  "JSON": "json",
  "CSS": "css",
  "HTML": "markup" // HTML uses 'markup' in Prism.js core
};

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const [isMobile, setIsMobile] = useState(false);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("JSON");
  const [mode, setMode] = useState("format");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{req: any, res: any}[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<number | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [collapsedFields, setCollapsedFields] = useState<Set<string>>(new Set());
  const [jsonEditMode, setJsonEditMode] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 700);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  useEffect(() => {
    Prism.highlightAll();
  }, [output, input, language, darkMode]);
  useEffect(() => {
    const saved = sessionStorage.getItem("snippetHistory");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleFormatMinify = async () => {
    setLoading(true);
    setOutput("");
    const endpoint = mode === "format" ? "/api/v1/format" : "/api/v1/minify";
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    try {
      const reqBody = { code: input, language };
      const res = await fetch(`${apiUrl}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqBody),
      });
      const data = await res.json();
      setOutput(data.code || data.error || "");
      // Save request/response to history
      const newHistory = [{ req: reqBody, res: data }, ...history].slice(0, 10);
      setHistory(newHistory);
      sessionStorage.setItem("snippetHistory", JSON.stringify(newHistory));
    } catch (e) {
      setOutput("Error connecting to backend");
    }
    setLoading(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Get the appropriate Prism language class
  const getPrismLanguage = (lang: string) => {
    const prismLang = PRISM_LANGUAGE_MAP[lang] || "javascript";
    // Verify the language is loaded, fallback to javascript if not
    return Prism.languages[prismLang] ? prismLang : "javascript";
  };

  // Enhanced syntax-highlighted display component
  const SyntaxHighlightedOutput = ({ code, language }: { code: string, language: string }) => {
    const prismLang = getPrismLanguage(language);
    
    useEffect(() => {
      Prism.highlightAll();
    }, [code, language]);

    return (
      <div style={{ position: "relative" }}>
        <pre 
          style={{
            width: "100%",
            fontFamily: "Fira Mono, Menlo, Monaco, Consolas, monospace",
            fontSize: 14,
            padding: 20,
            borderRadius: 12,
            border: `2px solid ${borderColor}`,
            minHeight: 850,
            height: 850,
            boxSizing: "border-box",
            background: codeBg,
            color: codeColor,
            overflow: "auto",
            margin: 0,
            boxShadow: `inset 0 2px 4px ${shadowColor}`,
            lineHeight: 1.5
          }}
        >
          <code className={`language-${prismLang}`}>
            {code || `// ${mode === "format" ? "Formatted" : "Minified"} ${language} code will appear here...\n// Click "${mode === "format" ? "🚀 Format" : "⚡ Minify"}" to process your code`}
          </code>
        </pre>
        
        {/* Language indicator */}
        <div style={{
          position: "absolute",
          top: 8,
          right: 8,
          background: darkMode ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.9)",
          color: darkMode ? "#fff" : "#333",
          padding: "4px 8px",
          borderRadius: 6,
          fontSize: 12,
          fontWeight: 600,
          border: `1px solid ${borderColor}`,
          backdropFilter: "blur(4px)"
        }}>
          {language}
        </div>
      </div>
    );
  };

  const getAllJsonPaths = (obj: any, basePath: string = 'root', paths: string[] = []): string[] => {
    if (typeof obj !== 'object' || obj === null) {
      return paths;
    }

    paths.push(basePath);

    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        getAllJsonPaths(item, `${basePath}[${index}]`, paths);
      });
    } else {
      Object.keys(obj).forEach(key => {
        getAllJsonPaths(obj[key], basePath === 'root' ? key : `${basePath}.${key}`, paths);
      });
    }

    return paths;
  };

  const toggleFieldCollapse = (fieldPath: string) => {
    const newCollapsedFields = new Set(collapsedFields);
    if (newCollapsedFields.has(fieldPath)) {
      newCollapsedFields.delete(fieldPath);
    } else {
      newCollapsedFields.add(fieldPath);
    }
    setCollapsedFields(newCollapsedFields);
  };

  const renderJsonWithCollapse = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      return renderJsonObject(parsed, 'root');
    } catch (e) {
      return jsonString; // Return original if not valid JSON
    }
  };

  const renderJsonObject = (obj: any, path: string): any => {
    if (typeof obj !== 'object' || obj === null) {
      return JSON.stringify(obj);
    }

    if (Array.isArray(obj)) {
      const isCollapsed = collapsedFields.has(path);
      return (
        <div key={path} style={{ marginLeft: path !== 'root' ? 20 : 0 }}>
          <span 
            onClick={() => toggleFieldCollapse(path)}
            style={{ cursor: 'pointer', userSelect: 'none', color: '#0066cc' }}
          >
            {isCollapsed ? '► ' : '▼ '}[{isCollapsed ? `${obj.length} items` : ''}
          </span>
          {!isCollapsed && (
            <div>
              {obj.map((item, index) => (
                <div key={index} style={{ marginLeft: 20 }}>
                  <span style={{ color: '#666' }}>{index}: </span>
                  {renderJsonObject(item, `${path}[${index}]`)}
                  {index < obj.length - 1 && ','}
                </div>
              ))}
            </div>
          )}
          {!isCollapsed && ']'}
          {isCollapsed && ']'}
        </div>
      );
    }

    const isCollapsed = collapsedFields.has(path);
    const keys = Object.keys(obj);
    
    return (
      <div key={path} style={{ marginLeft: path !== 'root' ? 20 : 0 }}>
        <span 
          onClick={() => toggleFieldCollapse(path)}
          style={{ cursor: 'pointer', userSelect: 'none', color: '#0066cc' }}
        >
          {isCollapsed ? '► ' : '▼ '}{'{'}
          {isCollapsed && <span style={{ color: '#666' }}> {keys.length} fields </span>}
        </span>
        {!isCollapsed && (
          <div>
            {keys.map((key, index) => (
              <div key={key} style={{ marginLeft: 20 }}>
                <span style={{ color: '#d73a49' }}>"{key}"</span>
                <span>: </span>
                {renderJsonObject(obj[key], path ? `${path}.${key}` : key)}
                {index < keys.length - 1 && ','}
              </div>
            ))}
          </div>
        )}
        {!isCollapsed && '}'}
        {isCollapsed && '}'}
      </div>
    );
  };

  const background = mounted && darkMode ? "#0a0a0a" : "#f8fafc";
  const color = mounted && darkMode ? "#ededed" : "#1a202c";
  const codeBg = mounted && darkMode ? "#1a1a1a" : "#ffffff";
  const codeColor = mounted && darkMode ? "#ededed" : "#2d3748";
  const cardBg = mounted && darkMode ? "#1a1a1a" : "#ffffff";
  const borderColor = mounted && darkMode ? "#333" : "#e2e8f0";
  const shadowColor = mounted && darkMode ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.08)";
  
  return (
    <div
      style={{
        minHeight: "100vh",
        background: darkMode 
          ? `linear-gradient(135deg, ${background} 0%, #111 100%)`
          : `linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)`,
        color: color,
        padding: "24px 16px",
        transition: "all 0.3s ease"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ 
            fontSize: 32,
            fontWeight: 700,
            background: "linear-gradient(135deg, #007acc 0%, #0056b3 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: 4
          }}>
            Developer Snippet Formatter & Minifier
          </h1>
          <p style={{ 
            fontSize: 16, 
            opacity: 0.7,
            margin: 0
          }}>
            Format, minify, and beautify your code instantly
          </p>
        </div>
        <button 
          onClick={() => setDarkMode(d => !d)} 
          style={{
            padding: "12px 20px",
            borderRadius: 12,
            border: `1px solid ${borderColor}`,
            background: cardBg,
            color: color,
            fontSize: 14,
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: `0 2px 8px ${shadowColor}`,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontWeight: 500
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = `0 4px 12px ${shadowColor}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = `0 2px 8px ${shadowColor}`;
          }}
        >
          <span style={{ fontSize: 18 }}>{darkMode ? "🌙" : "☀️"}</span>
          {darkMode ? "Dark" : "Light"} Mode
        </button>
      </div>
      {/* History Dropdown */}
      {history.length > 0 && (
        <div style={{ 
          marginBottom: 24,
          padding: 16,
          background: cardBg,
          borderRadius: 12,
          border: `1px solid ${borderColor}`,
          boxShadow: `0 2px 8px ${shadowColor}`
        }}>
          <label htmlFor="history" style={{ 
            fontWeight: 600, 
            marginRight: 12,
            color: color
          }}>
            Recent History:
          </label>
          <select
            id="history"
            value={selectedHistory ?? ""}
            onChange={e => {
              const idx = Number(e.target.value);
              setSelectedHistory(idx);
              if (history[idx]) {
                setInput(history[idx].req.code);
                setLanguage(history[idx].req.language);
                setMode(history[idx].req.mode || "format");
                setOutput(history[idx].res.output || history[idx].res.error || "");
              }
            }}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: `1px solid ${borderColor}`,
              background: cardBg,
              color: color,
              fontSize: 14,
              minWidth: 300,
              cursor: "pointer"
            }}
          >
            <option value="">Select a recent snippet...</option>
            {history.slice(0, 5).map((h, i) => (
              <option key={i} value={i}>
                {h.req.language} | {h.req.code.slice(0, 30)}{h.req.code.length > 30 ? "..." : ""}
              </option>
            ))}
          </select>
        </div>
      )}
      <div
        style={{
          display: "flex",
          gap: 24,
          justifyContent: "center",
          flexDirection: "row",
          maxWidth: "1400px",
          margin: "0 auto",
          alignItems: "flex-start" // Ensures both panels start at the same height
        }}
      >
        {/* Left Panel: Input */}
        <div style={{ 
          flex: leftPanelCollapsed ? "0 0 40px" : "1 1 50%", 
          maxWidth: leftPanelCollapsed ? "40px" : "700px",
          minWidth: leftPanelCollapsed ? "40px" : "600px"
        }}>
          <div style={{ 
            marginBottom: 16, 
            minHeight: 120, // Increased for consistency
            padding: 16,
            background: cardBg,
            borderRadius: 12,
            border: `1px solid ${borderColor}`,
            boxShadow: `0 2px 8px ${shadowColor}`
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <label htmlFor="language" style={{ fontWeight: 600, color: color }}>Language:</label>
                <select
                  id="language"
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 8,
                    border: `1px solid ${borderColor}`,
                    background: cardBg,
                    color: color,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
              <button 
                onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: `1px solid ${borderColor}`,
                  background: cardBg,
                  color: color,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontSize: 16,
                  fontWeight: 600
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = darkMode ? "#333" : "#f0f0f0";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = cardBg;
                }}
              >
                {leftPanelCollapsed ? "►" : "◄"}
              </button>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button 
                onClick={() => setInput("")}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: `1px solid ${borderColor}`,
                  background: "transparent",
                  color: color,
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontWeight: 500
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = darkMode ? "#333" : "#f0f0f0";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                Clear
              </button>
              <button 
                onClick={() => handleCopy(input)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: `1px solid ${borderColor}`,
                  background: "transparent",
                  color: color,
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontWeight: 500
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = darkMode ? "#333" : "#f0f0f0";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                Copy Input
              </button>
            </div>
          </div>
          {!leftPanelCollapsed && (
            <div style={{ position: "relative" }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                style={{
                  width: "100%",
                  fontFamily: "Fira Mono, Menlo, Monaco, Consolas, monospace",
                  fontSize: 16,
                  padding: 20,
                  borderRadius: 12,
                  border: `2px solid ${borderColor}`,
                  minHeight: 850,
                  height: 850,
                  boxSizing: "border-box",
                  background: codeBg,
                  color: codeColor,
                  transition: "all 0.2s ease",
                  boxShadow: `inset 0 2px 4px ${shadowColor}`,
                  resize: "none",
                  outline: "none"
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#007acc";
                  e.currentTarget.style.boxShadow = `inset 0 2px 4px ${shadowColor}, 0 0 0 3px rgba(0, 122, 204, 0.1)`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = borderColor;
                  e.currentTarget.style.boxShadow = `inset 0 2px 4px ${shadowColor}`;
                }}
                rows={16}
                placeholder={`Paste your ${language} code here...`}
              />
              
              {/* Language indicator for input */}
              <div style={{
                position: "absolute",
                top: 8,
                right: 8,
                background: darkMode ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.9)",
                color: darkMode ? "#fff" : "#333",
                padding: "4px 8px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                border: `1px solid ${borderColor}`,
                backdropFilter: "blur(4px)"
              }}>
                Input: {language}
              </div>
            </div>
          )}
        </div>
        {/* Right Panel: Output */}
        <div style={{ 
          flex: rightPanelCollapsed ? "0 0 40px" : "1 1 50%", 
          maxWidth: rightPanelCollapsed ? "40px" : "700px",
          minWidth: rightPanelCollapsed ? "40px" : "600px"
        }}>
          <div style={{ 
            marginBottom: 16, 
            minHeight: 120, // Increased for consistency
            padding: 16,
            background: cardBg,
            borderRadius: 12,
            border: `1px solid ${borderColor}`,
            boxShadow: `0 2px 8px ${shadowColor}`
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                <select
                  value={mode}
                  onChange={e => setMode(e.target.value)}
                  style={{ 
                    padding: "8px 16px",
                    borderRadius: 8,
                    border: `1px solid ${borderColor}`,
                    background: cardBg,
                    color: color,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: "pointer"
                  }}
                >
                  <option value="format">Format</option>
                  <option value="minify">Minify</option>
                </select>
                <button 
                  onClick={handleFormatMinify} 
                  style={{
                    padding: "10px 20px",
                    borderRadius: 8,
                    border: "none",
                    background: "linear-gradient(135deg, #007acc 0%, #0056b3 100%)",
                    color: "#fff",
                    fontSize: 14,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    fontWeight: 600,
                    boxShadow: `0 2px 8px rgba(0, 122, 204, 0.3)`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = `0 4px 12px rgba(0, 122, 204, 0.4)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = `0 2px 8px rgba(0, 122, 204, 0.3)`;
                  }}
                >
                  {loading ? "Processing..." : "Format/Minify"}
                </button>
                <button 
                  onClick={() => handleCopy(output)} 
                  style={{
                    padding: "8px 16px",
                    borderRadius: 8,
                    border: `1px solid ${borderColor}`,
                    background: "transparent",
                    color: color,
                    fontSize: 13,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    fontWeight: 500
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = darkMode ? "#333" : "#f0f0f0";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  Copy Output
                </button>
                {mode === "minify" && (
                  <button 
                    onClick={() => handleCopy(`// CDN-ready snippet\n${output}`)} 
                    style={{
                      padding: "8px 16px",
                      borderRadius: 8,
                      border: `1px solid ${borderColor}`,
                      background: "transparent",
                      color: color,
                      fontSize: 13,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      fontWeight: 500
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = darkMode ? "#333" : "#f0f0f0";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    Copy CDN-ready
                  </button>
                )}
              </div>
              <button 
                onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: `1px solid ${borderColor}`,
                  background: cardBg,
                  color: color,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontSize: 16,
                  fontWeight: 600
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = darkMode ? "#333" : "#f0f0f0";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = cardBg;
                }}
              >
                {rightPanelCollapsed ? "◄" : "►"}
              </button>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button 
                onClick={() => setJsonEditMode(!jsonEditMode)}
                style={{
                  padding: "6px 12px",
                  fontSize: 12,
                  borderRadius: 6,
                  border: `1px solid ${borderColor}`,
                  background: jsonEditMode ? "#007acc" : "transparent",
                  color: jsonEditMode ? "#fff" : color,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontWeight: 500
                }}
                onMouseEnter={(e) => {
                  if (!jsonEditMode) {
                    e.currentTarget.style.background = darkMode ? "#333" : "#f0f0f0";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!jsonEditMode) {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                {jsonEditMode ? 'View Mode' : 'Edit Mode'}
              </button>
              {!jsonEditMode && (
                <button 
                  onClick={() => {
                    if (collapsedFields.size > 0) {
                      setCollapsedFields(new Set());
                    } else {
                      try {
                        const parsed = JSON.parse(output);
                        const allPaths = getAllJsonPaths(parsed);
                        setCollapsedFields(new Set(allPaths));
                      } catch (e) {
                        setCollapsedFields(new Set(['root']));
                      }
                    }
                  }}
                  style={{
                    padding: "6px 12px",
                    fontSize: 12,
                    borderRadius: 6,
                    border: `1px solid ${borderColor}`,
                    background: "transparent",
                    color: color,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    fontWeight: 500
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = darkMode ? "#333" : "#f0f0f0";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {collapsedFields.size > 0 ? 'Expand All' : 'Collapse All'}
                </button>
              )}
            </div>
          </div>
          {!rightPanelCollapsed && (
            <div style={{ position: 'relative' }}>
              {language === 'JSON' && output && !jsonEditMode ? (
                <div 
                  style={{
                    width: "100%",
                    fontFamily: "Fira Mono, Menlo, Monaco, Consolas, monospace",
                    fontSize: 14,
                    padding: 20,
                    borderRadius: 12,
                    border: `2px solid ${borderColor}`,
                    minHeight: 850,
                    height: 850,
                    boxSizing: "border-box",
                    background: codeBg,
                    color: codeColor,
                    overflow: "auto",
                    whiteSpace: "pre-wrap",
                    boxShadow: `inset 0 2px 4px ${shadowColor}`
                  }}
                >
                  {renderJsonWithCollapse(output)}
                </div>
              ) : (
                <SyntaxHighlightedOutput code={output} language={language} />
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <div style={{
        textAlign: "center",
        marginTop: 48,
        paddingTop: 24,
        borderTop: `1px solid ${borderColor}`,
        opacity: 0.7,
        fontSize: 14,
        color: color
      }}>
        Made with ❤️ by Vikash
      </div>
    </div>
  );
}
