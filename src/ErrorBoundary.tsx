import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message || 'An unexpected error occurred.' };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ROI Calculator render error:', error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-nhm-background text-center px-6">
          <div className="max-w-md space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-nhm-navy text-white font-bold text-lg">
              !
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-900">We hit a snag</h1>
              <p className="text-nhm-textSecondary">
                Something went wrong while loading the ROI calculator. Please refresh the page to try again. If the issue
                persists, double-check your browser console for details or contact support.
              </p>
              <p className="text-sm text-nhm-textSecondary">Technical detail: {this.state.message}</p>
            </div>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg bg-nhm-navy text-white font-semibold hover:bg-nhm-navy/90"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
