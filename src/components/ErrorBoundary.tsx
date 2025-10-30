import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { errorMonitor } from '../utils/errorMonitoring';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  level?: 'page' | 'component';
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorCount: number;
}

/**
 * Error Boundary Component
 * Catches React errors and provides graceful fallback UI
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { onError, level = 'page' } = this.props;

    // Capture error in monitoring system
    errorMonitor.captureError(error, {
      page: window.location.pathname,
      action: 'react_error_boundary',
      metadata: {
        componentStack: errorInfo.componentStack,
        level,
        errorCount: this.state.errorCount + 1,
      },
    });

    // Update state
    this.setState((prevState) => ({
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }

    // Log to console in development
    if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
      console.error('Error Boundary caught an error:', error);
      console.error('Component Stack:', errorInfo.componentStack);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReportError = () => {
    const { error, errorInfo } = this.state;
    const subject = encodeURIComponent('Estal Platform Error Report');
    const body = encodeURIComponent(
      `Error: ${error?.message}\n\nStack: ${error?.stack}\n\nComponent Stack: ${errorInfo?.componentStack}`
    );
    window.open(`mailto:support@estal.com?subject=${subject}&body=${body}`);
  };

  render() {
    const { hasError, error, errorCount } = this.state;
    const { children, fallback, level = 'page' } = this.props;

    if (!hasError) {
      return children;
    }

    // Use custom fallback if provided
    if (fallback) {
      return fallback;
    }

    // Component-level error (minimal UI)
    if (level === 'component') {
      return (
        <div className="p-4 border border-destructive/20 rounded-[16px] bg-destructive/5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-destructive mb-2">
                This component encountered an error
              </p>
              <p className="text-xs text-muted-foreground mb-3 truncate">
                {error?.message || 'Unknown error'}
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={this.handleReset}
                className="rounded-[12px] text-xs"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // Page-level error (full UI)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full rounded-[20px] shadow-xl border-destructive/20">
          <CardContent className="p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-destructive/10 mx-auto mb-6 flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-destructive" />
              </div>
              
              <h1 className="mb-3">Something went wrong</h1>
              
              <p className="text-muted-foreground mb-6">
                We're sorry, but something unexpected happened. Our team has been notified and
                we're working on a fix.
              </p>

              {/* Error Details (collapsible in production) */}
              {(typeof import.meta !== 'undefined' && import.meta.env?.DEV) && (
                <div className="mb-6 p-4 bg-muted rounded-[16px] text-left">
                  <p className="text-sm mb-2">
                    <strong>Error:</strong> {error?.message}
                  </p>
                  {error?.stack && (
                    <details className="text-xs text-muted-foreground">
                      <summary className="cursor-pointer hover:text-foreground mb-2">
                        View Stack Trace
                      </summary>
                      <pre className="overflow-x-auto whitespace-pre-wrap break-words">
                        {error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Error Statistics */}
              {errorCount > 1 && (
                <div className="mb-6 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-[16px]">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    This error has occurred {errorCount} times in this session. Consider
                    refreshing the page or returning home.
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={this.handleReset}
                className="rounded-[16px] gap-2"
                size="lg"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>

              <Button
                onClick={this.handleGoHome}
                variant="outline"
                className="rounded-[16px] gap-2"
                size="lg"
              >
                <Home className="w-4 h-4" />
                Go Home
              </Button>

              <Button
                onClick={this.handleReportError}
                variant="outline"
                className="rounded-[16px] gap-2"
                size="lg"
              >
                <Mail className="w-4 h-4" />
                Report Issue
              </Button>
            </div>

            {/* Support Info */}
            <div className="mt-8 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                If this problem persists, please contact our support team at{' '}
                <a
                  href="mailto:support@estal.com"
                  className="text-primary hover:underline"
                >
                  support@estal.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}

/**
 * Hook-based error boundary wrapper
 */
interface ErrorBoundaryWrapperProps {
  children: ReactNode;
  level?: 'page' | 'component';
  fallback?: ReactNode;
}

export const ErrorBoundaryWrapper: React.FC<ErrorBoundaryWrapperProps> = ({
  children,
  level = 'component',
  fallback,
}) => {
  return (
    <ErrorBoundary level={level} fallback={fallback}>
      {children}
    </ErrorBoundary>
  );
};
