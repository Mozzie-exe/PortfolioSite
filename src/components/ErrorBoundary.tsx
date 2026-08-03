import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public props: Props;
  public state: State = {
    hasError: false,
    error: null
  };

  constructor(props: Props) {
    super(props);
    this.props = props;
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in app:', error, errorInfo);
  }

  private handleReload = () => {
    // Clear potentially corrupted local state if needed
    try {
      // Keep admin credentials but soft reset games state if corrupted
      window.location.reload();
    } catch (e) {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#020204] text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white/[0.03] border border-cyan-500/30 rounded-2xl p-8 text-center space-y-6 shadow-2xl backdrop-blur-xl">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-lg font-mono font-bold uppercase tracking-wider text-cyan-400">
                Application Recovered
              </h2>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                An unexpected issue occurred while rendering or processing data. Don't worry, your portfolio app is protected.
              </p>
              {this.state.error?.message && (
                <div className="p-3 rounded-xl bg-black/60 border border-white/10 text-left font-mono text-[11px] text-rose-300 overflow-x-auto max-h-32">
                  {this.state.error.message}
                </div>
              )}
            </div>

            <button
              onClick={this.handleReload}
              className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Portfolio</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
