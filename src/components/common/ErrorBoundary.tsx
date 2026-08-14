import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('AgroApp ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f3f3f3] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full border border-[#c1c8c2] shadow-xl text-center space-y-4">
            <div className="w-14 h-14 bg-[#ffdad6] text-[#ba1a1a] rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[32px]">agriculture</span>
            </div>
            
            <div className="space-y-1">
              <h2 className="font-heading font-bold text-lg text-[#012d1d]">
                Federal Ministry of Agriculture & Food Security
              </h2>
              <p className="text-xs text-[#717973]">
                AgroApp National Portal • Session Recovery
              </p>
            </div>

            <p className="text-xs text-[#414844] bg-[#f9f9f9] p-3 rounded-xl border border-[#e2e2e2]">
              The platform encountered a temporary display issue. Your saved farm records, listings, and wallet balance remain secure.
            </p>

            <button
              onClick={this.handleReset}
              className="w-full py-3 bg-[#012d1d] text-white font-heading font-bold text-xs rounded-full hover:bg-[#1b4332] active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              <span>Reload AgroApp Portal</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

