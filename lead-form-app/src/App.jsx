import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import LeadForm from './components/LeadForm';
import LandingPage from './components/LandingPage';

/* ── Error Boundary: prevents blank screen on any render crash ── */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('Realtor AI Error Boundary caught:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center gap-6 px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-2">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold">Something went wrong</h1>
          <p className="text-[#94a3b8] max-w-md">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-full font-semibold transition-colors"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-[#4f46e5]/30">

      {/* GLOBAL NAVBAR */}
      <nav className="fixed w-full z-50 top-0 transition-all duration-300 bg-[#0f172a]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4f46e5] to-[#8b5cf6] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            Realtor <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#ec4899]">AI</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-[#cbd5e1] hover:text-white transition-colors">Home</Link>
            <a href="/#features" className="text-sm font-medium text-[#cbd5e1] hover:text-white transition-colors">Features</a>
            <a href="/#how-it-works" className="text-sm font-medium text-[#cbd5e1] hover:text-white transition-colors">How It Works</a>
            <a href="/#pricing" className="text-sm font-medium text-[#cbd5e1] hover:text-white transition-colors">Pricing</a>
          </div>

          <a href="/#lead-form" className="hidden md:flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full font-semibold transition-all backdrop-blur-sm border border-white/5">
            Get Instant AI Call
          </a>
        </div>
      </nav>

      {/* ROUTING VIEW PORT — wrapped in Error Boundary */}
      <main className="pt-20">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<LandingPage />} />
          </Routes>
        </ErrorBoundary>
      </main>

    </div>
  );
}

export default App;

