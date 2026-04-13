"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  /** Optional fallback UI. If not provided, shows default error screen. */
  fallback?: ReactNode;
  /** Callback when error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[NEXI ErrorBoundary]", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--bg)",
            padding: 48,
            gap: 16,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "var(--radius-full)",
              background: "rgba(220, 38, 38, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--error)" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display), sans-serif",
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "var(--text)",
            }}
          >
            Something went wrong
          </h2>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--text-secondary)",
              textAlign: "center",
              maxWidth: 400,
              lineHeight: 1.6,
            }}
          >
            This screen encountered an error. Please try again or return to the dashboard.
          </p>
          {process.env.NODE_ENV === "development" && this.state.error && (
            <pre
              style={{
                fontSize: "0.6875rem",
                color: "var(--error)",
                background: "var(--bg-card)",
                padding: 12,
                borderRadius: "var(--radius-sm)",
                maxWidth: "100%",
                overflow: "auto",
                border: "1px solid var(--border)",
              }}
            >
              {this.state.error.message}
            </pre>
          )}
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button className="btn btn-ghost" onClick={this.handleReset}>
              Try Again
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                this.handleReset();
                // Navigate to dashboard - we can't use hooks here, so we reload
                window.location.href = window.location.pathname + "?screen=DSH-01";
              }}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
