import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Landing.css'
import Gallery from '../components/Gallery'

export default function Landing() {
  const navigate = useNavigate()
  const handleExplore = () => {
    const el = document.getElementById('gallery')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    else navigate('/app')
  }

  return (
    <div className="landing container fade-up">
      <div className="hero">
        <div className="copy">
          <h1>Welcome to Hotel Management</h1>
          <p>Book rooms, leave reviews, manage stays, and track facilities — safe and simple.</p>
          <div className="landing-actions">
            <Link to="/signup" className="btn">Get Started</Link>
            <Link to="/login" className="btn btn-secondary">Sign In</Link>
          </div>
        </div>
        <div className="visual">
          <div className="hero-card float">
            <div className="hero-image" />
            <div style={{paddingLeft:12}}>
              <h3 style={{margin:0}}>Deluxe Suite</h3>
              <p style={{marginTop:6, color:'var(--muted)'}}>Spacious room with top facilities — wifi, AC, TV and minibar.</p>
              <div style={{marginTop:8}}>
                <button className="btn small" onClick={handleExplore} aria-label="Explore rooms">Explore</button>
                <button className="btn secondary small" style={{marginLeft:8}} onClick={() => navigate('/app')}>View all rooms</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slideshow" aria-hidden="true">
        <span className="slide" style={{backgroundImage: "url('https://images.unsplash.com/photo-1501117716987-c8e5e6a58b0a?w=1600&q=80&auto=format&fit=crop')"}} />
        <span className="slide" style={{backgroundImage: "url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80&auto=format&fit=crop')"}} />
        <span className="slide" style={{backgroundImage: "url('https://images.unsplash.com/photo-1496412705862-e0088f16f791?w=1600&q=80&auto=format&fit=crop')"}} />
      </div>

      <section style={{marginTop:36}} className="fade-up">
        <h3>Why choose us?</h3>
        <div style={{display:'flex', gap:16, justifyContent:'center', marginTop:12, flexWrap:'wrap'}}>
          <div className="card" style={{width:260}}>
            <h4>Easy Booking</h4>
            <p className="muted">Search and book rooms with conflict-free dates enforced.</p>
          </div>
          <div className="card" style={{width:260}}>
            <h4>Trusted Reviews</h4>
            <p className="muted">Guests can leave reviews and share their stay experiences.</p>
          </div>
          <div className="card" style={{width:260}}>
            <h4>Secure Accounts</h4>
            <p className="muted">User accounts and booking history are tracked securely.</p>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section style={{marginTop:28}}>
        <h3 className="fade-up">Explore our rooms</h3>
      </section>

      <Gallery />

    <section className="features fade-up" style={{marginTop:32}}>
      <h3>Hotel Features</h3>
      <div className="feature-list">
        <div className="feature-item">🏊 Outdoor Pool</div>
        <div className="feature-item">🍽️ On-site Restaurant</div>
        <div className="feature-item">🏋️ Fitness Center</div>
        <div className="feature-item">🧺 Daily Housekeeping</div>
        <div className="feature-item">🛎️ 24/7 Reception</div>
      </div>
    </section>

    <section className="upcoming fade-up" style={{marginTop:20}}>
      <h3>Upcoming Features</h3>
      <ul>
        <li>Mobile check-in / check-out</li>
        <li>Loyalty & rewards program</li>
        <li>Advanced filtering & availability calendar</li>
        <li>Payment integration (Stripe/PayPal)</li>
      </ul>
    </section>

    </div>
  )
}
