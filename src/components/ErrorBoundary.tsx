import { Component, type ReactNode, type ErrorInfo } from 'react'

interface Props { children: ReactNode }
interface State { error: Error | null }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-warm-950">
          <div className="bg-warm-900 p-10 rounded-2xl border border-warm-700/50 text-center max-w-md animate-scale-in">
            <span className="text-4xl mb-4 block" aria-hidden="true">🎄</span>
            <h2 className="font-display text-2xl text-crimson-400 mb-2">Algo salió mal</h2>
            <p className="text-cream-200/60 mb-6 text-sm">{this.state.error.message}</p>
            <button onClick={() => window.location.reload()}
              className="bg-crimson-600 hover:bg-crimson-500 text-cream-50 px-6 py-2.5 rounded-lg transition-colors cursor-pointer text-sm font-medium">
              Recargar página
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
