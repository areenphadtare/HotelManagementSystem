import React, { useState } from 'react'

const services = [
  { id: 1, name: 'Room Cleaning', icon: '🧹', description: 'Professional room cleaning and tidying' },
  { id: 2, name: 'Linen Change', icon: '🛏️', description: 'Fresh bedding and towel replacement' },
  { id: 3, name: 'Laundry Service', icon: '👔', description: 'Professional laundry and ironing' },
  { id: 4, name: 'Maintenance Request', icon: '🔧', description: 'Report and request repairs' },
  { id: 5, name: 'Room Supplies', icon: '📦', description: 'Toiletries and amenity replenishment' },
  { id: 6, name: 'Express Cleaning', icon: '⚡', description: 'Quick 30-minute room refresh' },
]

export default function Housekeeping() {
  const [selectedService, setSelectedService] = useState(null)
  const [requests, setRequests] = useState([])
  const [description, setDescription] = useState('')

  const handleRequestService = () => {
    if (selectedService && description.trim()) {
      const newRequest = {
        id: Date.now(),
        service: selectedService.name,
        description,
        status: 'Pending',
        createdAt: new Date().toLocaleDateString(),
      }
      setRequests([newRequest, ...requests])
      setSelectedService(null)
      setDescription('')
    }
  }

  return (
    <div>
      <h2 className="fade-up">Housekeeping Services</h2>
      <p className="muted" style={{ marginBottom: '2rem' }}>Request cleaning, maintenance, and other housekeeping services</p>

      {/* Services Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {services.map(service => (
          <div
            key={service.id}
            onClick={() => setSelectedService(service)}
            style={{
              padding: '1.5rem',
              background: selectedService?.id === service.id 
                ? 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.1))'
                : 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
              border: selectedService?.id === service.id 
                ? '2px solid #7c3aed'
                : '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 200ms ease',
              textAlign: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(124,58,237,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{service.icon}</div>
            <h3 style={{ margin: '0.5rem 0', fontSize: '1.1rem', color: '#e8f0fe' }}>{service.name}</h3>
            <p style={{ margin: '0.5rem 0', color: 'var(--muted)', fontSize: '0.9rem' }}>{service.description}</p>
          </div>
        ))}
      </div>

      {/* Request Form */}
      {selectedService && (
        <div className="card fade-up" style={{ marginBottom: '2rem', maxWidth: '600px' }}>
          <h3>{selectedService.name}</h3>
          <p className="muted">{selectedService.description}</p>
          <div style={{ marginTop: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: '#7c3aed' }}>Additional Details</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please describe your request..."
              style={{
                width: '100%',
                height: '120px',
                padding: '0.75rem',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                color: 'inherit',
                fontFamily: 'inherit',
                resize: 'vertical',
              }}
            />
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button
                className="btn"
                onClick={handleRequestService}
                disabled={!description.trim()}
              >
                Submit Request
              </button>
              <button
                className="btn secondary"
                onClick={() => {
                  setSelectedService(null)
                  setDescription('')
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Requests List */}
      {requests.length > 0 && (
        <div>
          <h3 style={{ marginTop: '2rem', marginBottom: '1.5rem' }}>Your Requests</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {requests.map(req => (
              <div
                key={req.id}
                className="card"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  padding: '1.5rem',
                }}
              >
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#e8f0fe' }}>{req.service}</h4>
                  <p style={{ margin: '0.5rem 0', color: 'var(--muted)', fontSize: '0.95rem' }}>{req.description}</p>
                  <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>{req.createdAt}</p>
                </div>
                <span
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(16,185,129,0.2)',
                    border: '1px solid rgba(16,185,129,0.3)',
                    borderRadius: '6px',
                    color: 'var(--success)',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                  }}
                >
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {requests.length === 0 && !selectedService && (
        <div
          style={{
            padding: '3rem',
            textAlign: 'center',
            color: 'var(--muted)',
          }}
        >
          <p>Select a service above to submit a housekeeping request</p>
        </div>
      )}
    </div>
  )
}
