import React, { useRef, useEffect, useState } from 'react';
import { Eye, EyeOff, ArrowRight, Zap, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from './ToastContext';

// ─── Dot Map (emerald theme) ─────────────────────────────────────────────────
const DotMap = () => {
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const routes = [
    { start: { x: 100, y: 150, delay: 0 },   end: { x: 200, y: 80,  delay: 2 },   color: '#10b981' },
    { start: { x: 200, y: 80,  delay: 2 },   end: { x: 260, y: 120, delay: 4 },   color: '#10b981' },
    { start: { x: 50,  y: 50,  delay: 1 },   end: { x: 150, y: 180, delay: 3 },   color: '#10b981' },
    { start: { x: 280, y: 60,  delay: 0.5 }, end: { x: 180, y: 180, delay: 2.5 }, color: '#10b981' },
  ];

  const generateDots = (width, height) => {
    const dots = [];
    const gap = 12;
    for (let x = 0; x < width; x += gap) {
      for (let y = 0; y < height; y += gap) {
        const inShape =
          (x < width * 0.25 && x > width * 0.05 && y < height * 0.4 && y > height * 0.1) ||
          (x < width * 0.25 && x > width * 0.15 && y < height * 0.8 && y > height * 0.4) ||
          (x < width * 0.45 && x > width * 0.3  && y < height * 0.35 && y > height * 0.15) ||
          (x < width * 0.5  && x > width * 0.35 && y < height * 0.65 && y > height * 0.35) ||
          (x < width * 0.7  && x > width * 0.45 && y < height * 0.5  && y > height * 0.1) ||
          (x < width * 0.8  && x > width * 0.65 && y < height * 0.8  && y > height * 0.6);
        if (inShape && Math.random() > 0.3) {
          dots.push({ x, y, radius: 1, opacity: Math.random() * 0.4 + 0.15 });
        }
      }
    }
    return dots;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
      canvas.width = width;
      canvas.height = height;
    });
    ro.observe(canvas.parentElement);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!dimensions.width || !dimensions.height) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dots = generateDots(dimensions.width, dimensions.height);
    let raf;
    let startTime = Date.now();

    function draw() {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      dots.forEach(d => {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16, 185, 129, ${d.opacity})`;
        ctx.fill();
      });

      const elapsed = (Date.now() - startTime) / 1000;
      routes.forEach(route => {
        const t = elapsed - route.start.delay;
        if (t <= 0) return;
        const p = Math.min(t / 3, 1);
        const x = route.start.x + (route.end.x - route.start.x) * p;
        const y = route.start.y + (route.end.y - route.start.y) * p;

        ctx.beginPath();
        ctx.moveTo(route.start.x, route.start.y);
        ctx.lineTo(x, y);
        ctx.strokeStyle = route.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath(); ctx.arc(route.start.x, route.start.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = route.color; ctx.fill();

        ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#34d399'; ctx.fill();

        ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(52, 211, 153, 0.3)'; ctx.fill();

        if (p === 1) {
          ctx.beginPath(); ctx.arc(route.end.x, route.end.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = route.color; ctx.fill();
        }
      });

      if (elapsed > 15) startTime = Date.now();
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, [dimensions]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};

// ─── Main Auth View ───────────────────────────────────────────────────────────
const AuthView = ({ onAuthSuccess, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = isLogin ? '/api/login' : '/api/register';
    const payload = isLogin ? { email, password } : { name, email, password };
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');
      addToast(isLogin ? 'Welcome back!' : 'Account created!', 'success');
      onAuthSuccess(data.token, data.user);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black p-4 relative">

      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[600px] w-[700px] rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>

      {/* Back button */}
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-8 left-8 flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-400 transition-colors duration-200 cursor-pointer z-10"
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45 }}
        className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl flex border border-zinc-800 shadow-2xl shadow-black/60"
      >
        {/* ── Left: Dot Map Panel ── */}
        <div className="hidden md:block w-1/2 h-[600px] relative overflow-hidden border-r border-zinc-800">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 to-black">
            <DotMap />
          </div>

          {/* Overlay text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-10 z-10">
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mb-5"
            >
              <div className="h-14 w-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                <Zap className="text-emerald-400 h-7 w-7" strokeWidth={2.5} />
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-3xl font-bold mb-3 text-center bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent"
            >
              CatchUp
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="text-sm text-center text-gray-500 max-w-xs leading-relaxed"
            >
              Recover unpaid invoices on autopilot. Sign in to your dashboard.
            </motion.p>

            {/* Stats pills */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.5 }}
              className="mt-8 flex flex-col gap-3 w-full max-w-[200px]"
            >
              {[
                { label: 'Revenue Recovered', value: '$2M+' },
                { label: 'Avg Payout Speed', value: '2.5x faster' },
                { label: 'Hours Saved / wk', value: '10 hrs' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between bg-zinc-900/60 border border-zinc-800 rounded-lg px-4 py-2">
                  <span className="text-xs text-gray-500">{label}</span>
                  <span className="text-xs font-bold text-emerald-400">{value}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ── Right: Form Panel ── */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center bg-zinc-950">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                {isLogin ? 'Welcome back' : 'Create account'}
              </h1>
              <p className="text-gray-500 text-sm">
                {isLogin ? 'Sign in to your CatchUp dashboard' : 'Start recovering revenue for free'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Name (register only) */}
              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    key="name-field"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-widest">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full h-11 rounded-lg border border-zinc-700 bg-zinc-900 px-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-widest">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full h-11 rounded-lg border border-zinc-700 bg-zinc-900 px-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-widest">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 rounded-lg border border-zinc-700 bg-zinc-900 px-4 pr-11 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 hover:text-emerald-400 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Forgot password (login only) */}
              {isLogin && (
                <div className="text-right">
                  <a href="#" className="text-xs text-gray-500 hover:text-emerald-400 transition-colors">
                    Forgot password?
                  </a>
                </div>
              )}

              {/* Submit button */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                className="pt-1"
              >
                <button
                  type="submit"
                  disabled={loading}
                  className="relative w-full h-11 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm overflow-hidden shadow-lg shadow-emerald-500/20 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <>
                      {isLogin ? 'Sign in' : 'Create account'}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                  {/* Shimmer on hover */}
                  {isHovered && !loading && (
                    <motion.span
                      initial={{ left: '-100%' }}
                      animate={{ left: '100%' }}
                      transition={{ duration: 0.9, ease: 'easeInOut' }}
                      className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      style={{ filter: 'blur(8px)' }}
                    />
                  )}
                </button>
              </motion.div>
            </form>

            {/* Toggle login / register */}
            <p className="text-center mt-6 text-sm text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors cursor-pointer"
              >
                {isLogin ? 'Sign up free' : 'Sign in'}
              </button>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthView;
