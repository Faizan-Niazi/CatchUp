import React from 'react';
import { Zap, Shield, CheckCircle, TrendingUp, Clock, CreditCard, Mail, Star, Users } from 'lucide-react';

const LandingPageView = ({ onLoginClick }) => {
  return (
    <div className="landing-page" style={{ 
      minHeight: '100vh', 
      background: 'var(--bg)',
      color: 'var(--text)',
      fontFamily: 'inherit',
      overflowX: 'hidden'
    }}>
      
      {/* Navbar */}
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '24px 48px',
        maxWidth: '1280px',
        margin: '0 auto'
      }}>
        <div className="logo">
          <Zap className="logo-icon" size={36} color="var(--primary)" strokeWidth={3} />
          <span style={{ fontSize: '1.8rem', color: 'var(--text)' }}>CatchUp</span>
        </div>
        
        <div className="nav-links-desktop" style={{ display: 'flex', gap: '32px', fontWeight: 500, color: 'var(--text-muted)' }}>
          <a href="#product" style={{ transition: 'color 0.2s', textDecoration: 'none', color: 'inherit' }} className="nav-link-hover">Product</a>
          <a href="#features" style={{ transition: 'color 0.2s', textDecoration: 'none', color: 'inherit' }} className="nav-link-hover">Features</a>
          <a href="#outcomes" style={{ transition: 'color 0.2s', textDecoration: 'none', color: 'inherit' }} className="nav-link-hover">Outcomes</a>
          <a href="#reviews" style={{ transition: 'color 0.2s', textDecoration: 'none', color: 'inherit' }} className="nav-link-hover">Reviews</a>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={onLoginClick}
            style={{ background: 'transparent', border: 'none', color: 'var(--text)', fontWeight: 600, cursor: 'pointer', padding: '8px 16px' }}
          >
            Sign in
          </button>
          <button 
            onClick={onLoginClick}
            style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)' }}
            className="btn-hover-scale"
          >
            Get started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main style={{ 
        maxWidth: '1280px', 
        margin: '0 auto', 
        padding: '80px 48px 60px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        
        {/* Decorative Background Gradient Mesh */}
        <div style={{
          position: 'absolute',
          top: '-150px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80vw',
          height: '600px',
          background: 'radial-gradient(circle at 50% 50%, rgba(28, 154, 89, 0.25) 0%, rgba(16, 185, 129, 0.15) 30%, rgba(0,0,0,0) 70%)',
          zIndex: -1,
          filter: 'blur(60px)'
        }}></div>

        <h1 style={{ 
          fontSize: '4.5rem', 
          fontWeight: 800, 
          lineHeight: 1.1, 
          letterSpacing: '-0.03em',
          maxWidth: '900px',
          marginBottom: '24px',
          color: 'var(--text)'
        }}>
          Never let a pending deal <br/> slip through the cracks.
        </h1>
        
        <p style={{ 
          fontSize: '1.2rem', 
          color: 'var(--text-muted)', 
          maxWidth: '600px',
          marginBottom: '40px',
          lineHeight: 1.6
        }}>
          CatchUp acts as your personal financial assistant. It tracks pending invoices, automates follow-up emails, and lets clients pay instantly.
        </p>

        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          width: '100%',
          maxWidth: '450px',
          marginBottom: '60px'
        }}>
          <div style={{
            display: 'flex', 
            gap: '8px', 
            alignItems: 'center',
            background: 'var(--surface)',
            padding: '8px',
            borderRadius: '50px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            border: '1px solid var(--border)',
            width: '100%'
          }}>
            <input 
              type="email" 
              placeholder="name@company.com" 
              style={{ 
                flex: 1, 
                border: 'none', 
                background: 'transparent', 
                padding: '12px 24px', 
                fontSize: '1rem', 
                outline: 'none',
                color: 'var(--text)',
                fontFamily: 'inherit'
              }} 
            />
            <button 
              onClick={onLoginClick}
              style={{ 
                background: 'var(--primary)', 
                color: '#fff', 
                border: 'none', 
                padding: '12px 24px', 
                borderRadius: '50px', 
                fontWeight: 600, 
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'transform 0.2s'
              }}
              className="btn-hover-scale"
            >
              Start for free
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            <CheckCircle size={14} color="var(--success)" /> No credit card required. It's totally free.
          </div>
        </div>

        {/* CSS Dashboard Mockup */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '1000px', height: '400px', marginTop: '20px' }}>
          <div style={{ 
            position: 'absolute', 
            top: '40px', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            width: '80%', 
            height: '360px', 
            background: 'var(--surface)', 
            borderRadius: '16px',
            border: '1px solid var(--border)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            display: 'flex'
          }}>
            {/* Mock Sidebar */}
            <div style={{ width: '220px', borderRight: '1px solid var(--border)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', background: 'var(--surface)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Zap size={20} color="var(--primary)" strokeWidth={3} />
                <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>CatchUp</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem', background: 'rgba(28, 154, 89, 0.1)', padding: '8px 12px', borderRadius: '8px' }}>
                <TrendingUp size={16} /> Dashboard
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.85rem', padding: '8px 12px' }}>
                <Users size={16} /> Pipeline
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.85rem', padding: '8px 12px' }}>
                <CheckCircle size={16} /> Tasks
              </div>
            </div>
            
            {/* Mock Content */}
            <div style={{ flex: 1, padding: '24px', background: 'var(--bg)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>Overview</div>
                <div style={{ background: 'var(--primary)', color: 'white', padding: '6px 16px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 600 }}>+ Add Lead</div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Mock Card 1 */}
                <div style={{ background: 'var(--surface)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>Revenue Recovered</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)' }}>$45,200</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                    <TrendingUp size={12} color="var(--primary)" /> +12% this month
                  </div>
                </div>
                {/* Mock Card 2 */}
                <div style={{ background: 'var(--surface)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>Pending Follow-ups</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>14 Active</div>
                  <div style={{ width: '100%', height: '6px', background: 'var(--bg)', borderRadius: '50px', marginTop: '12px' }}>
                    <div style={{ width: '60%', height: '100%', background: 'var(--secondary)', borderRadius: '50px' }}></div>
                  </div>
                </div>
              </div>

              {/* Mock Table */}
              <div style={{ background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', flex: 1, padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '16px' }}>Recent Activity</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Mail size={14} color="#3b82f6" /></div>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Follow-up sent to TechFlow</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Attempt 2 • Automated</div>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>$4,500</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(28, 154, 89, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircle size={14} color="var(--success)" /></div>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Payment from AcmeCorp</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Stripe • Paid</div>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>$12,500</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Card 1 */}
          <div style={{
            position: 'absolute',
            top: '10%',
            right: '2%',
            background: 'var(--surface)',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid var(--border)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
            width: '280px',
            zIndex: 10,
            animation: 'float 6s ease-in-out infinite'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: 'rgba(28, 154, 89, 0.15)', padding: '8px', borderRadius: '50%' }}>
                <CheckCircle size={20} color="var(--success)" />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Invoice Paid!</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Acme Corp via Stripe</div>
              </div>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>$12,500.00</div>
          </div>

          {/* Floating Card 2 */}
          <div style={{
            position: 'absolute',
            bottom: '40px',
            left: '2%',
            background: 'var(--surface)',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid var(--border)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
            width: '260px',
            zIndex: 10,
            animation: 'float 7s ease-in-out infinite reverse'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Mail size={18} color="var(--secondary)" />
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Automated Follow-up Sent</div>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>"Hi John, checking in on the..."</div>
          </div>
        </div>
      </main>

      {/* Trusted By Section */}
      <section style={{ 
        borderTop: '1px solid rgba(28, 154, 89, 0.2)', 
        borderBottom: '1px solid rgba(28, 154, 89, 0.2)', 
        background: 'rgba(28, 154, 89, 0.03)',
        padding: '40px 0',
        marginBottom: '80px'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '32px' }}>
            Trusted by freelancers and agencies worldwide
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '64px', flexWrap: 'wrap', color: 'var(--primary)', opacity: 0.8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '1.2rem' }}><Shield size={24}/> AcmeCorp</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '1.2rem' }}><Zap size={24}/> TechFlow</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '1.2rem' }}><TrendingUp size={24}/> GrowthMetrics</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '1.2rem' }}><CheckCircle size={24}/> Velocity</div>
          </div>
        </div>
      </section>

      {/* Outcomes & Features Section */}
      <section id="features" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 48px 120px' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px' }}>Work smarter, not harder.</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            CatchUp replaces your spreadsheets, calendar reminders, and awkward "just checking in" emails with a seamless, automated pipeline.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          {/* Feature 1 */}
          <div style={{ background: 'var(--surface)', padding: '40px', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <div style={{ background: 'var(--bg)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <Mail size={24} color="var(--primary)" />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '12px' }}>Automated Drip Emails</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Set your follow-up delay, customize your templates, and let CatchUp chase down unpaid invoices while you sleep.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div style={{ background: 'var(--surface)', padding: '40px', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <div style={{ background: 'var(--bg)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <CreditCard size={24} color="var(--primary)" />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '12px' }}>1-Click Stripe Payments</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Generate custom, secure Stripe payment links directly from your dashboard and drop them into your emails.
            </p>
          </div>

          {/* Feature 3 */}
          <div style={{ background: 'var(--surface)', padding: '40px', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <div style={{ background: 'var(--bg)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <TrendingUp size={24} color="var(--primary)" />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '12px' }}>AI Revenue Forecasting</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Know exactly how much money is sitting in your pipeline and get AI-driven predictions on expected monthly payouts.
            </p>
          </div>
        </div>
      </section>

      {/* Outcomes Metrics Banner */}
      <section id="outcomes" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #1C9A59 100%)', color: 'var(--bg)', padding: '80px 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '8px' }}>$2M+</div>
            <div style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)' }}>Revenue recovered for users</div>
          </div>
          <div>
            <div style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '8px' }}>+34%</div>
            <div style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)' }}>Increase in paid invoices</div>
          </div>
          <div>
            <div style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '8px' }}>2.5x</div>
            <div style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)' }}>Faster average payout time</div>
          </div>
          <div>
            <div style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '8px' }}>10hrs</div>
            <div style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)' }}>Saved weekly on follow-ups</div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" style={{ maxWidth: '1280px', margin: '0 auto', padding: '120px 48px' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px' }}>Loved by freelancers</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            See how professionals are taking back their time and revenue with CatchUp.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          {[
            { name: 'Sarah Jenkins', role: 'Freelance Designer', quote: 'CatchUp is a lifesaver. I used to hate sending reminder emails to clients. Now the system does it for me and I actually get paid faster!' },
            { name: 'David Chen', role: 'Agency Owner', quote: 'The Stripe integration is brilliant. I can just copy a payment link, and the dashboard tracks exactly who hasn\'t paid yet. Highly recommend.' },
            { name: 'Elena Rodriguez', role: 'Consultant', quote: 'The AI forecasting gives me so much peace of mind. I finally know exactly what my cash flow looks like for the next month.' }
          ].map((review, i) => (
            <div key={i} style={{ background: 'var(--surface)', padding: '32px', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', color: '#f59e0b' }}>
                <Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" />
              </div>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '24px', fontStyle: 'italic' }}>"{review.quote}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Users size={20} color="var(--text-muted)"/></div>
                <div>
                  <div style={{ fontWeight: 700 }}>{review.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{review.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '80px 48px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '24px' }}>Ready to get paid faster?</h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '40px' }}>Join hundreds of professionals using CatchUp for free.</p>
        <button 
          onClick={onLoginClick}
          style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '16px 32px', borderRadius: '50px', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)' }}
          className="btn-hover-scale"
        >
          Create your free account
        </button>
      </footer>

      {/* Global styles for this page only */}
      <style>{`
        .nav-link-hover:hover { color: var(--text) !important; }
        .btn-hover-scale:hover { transform: translateY(-2px); }
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
};

export default LandingPageView;
