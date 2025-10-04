'use client';

import { useState, useEffect } from 'react';

interface Registration {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: string;
  has_paid_holding_fee: boolean;
  amount_paid: number;
  age_range: string;
  current_occupation: string;
  programming_experience: string;
  motivation: string;
  how_did_you_hear: string;
  contact_count: number;
  last_contacted_at: string;
  created_at: string;
  cohort_name: string;
  early_bird_discount: number;
  contact_attempts: number;
}

interface Statistics {
  total_interested: number;
  paid_holding_fees: number;
  contacted: number;
  closed_deals: number;
  total_revenue: number;
}

export default function BootcampAdmin() {
  const [adminSecret, setAdminSecret] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);
  const [filterStatus, setFilterStatus] = useState('');

  // Contact Log Form
  const [contactForm, setContactForm] = useState({
    contactType: 'phone',
    contactedBy: '',
    notes: '',
    outcome: '',
    nextAction: '',
    nextContactDate: ''
  });

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const url = `/api/bootcamp/admin?adminSecret=${adminSecret}&cohortId=1${filterStatus ? `&status=${filterStatus}` : ''}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setRegistrations(data.registrations);
        setStatistics(data.statistics);
        setAuthenticated(true);
      } else {
        alert('Authentication failed');
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
      alert('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRegistrations();
  };

  const handleAddContactLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReg) return;

    try {
      const response = await fetch('/api/bootcamp/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminSecret,
          registrationId: selectedReg.id,
          ...contactForm
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('Contact log added successfully');
        setContactForm({
          contactType: 'phone',
          contactedBy: '',
          notes: '',
          outcome: '',
          nextAction: '',
          nextContactDate: ''
        });
        setSelectedReg(null);
        fetchRegistrations();
      }
    } catch (error) {
      console.error('Error adding contact log:', error);
      alert('Error adding contact log');
    }
  };

  const handleAssignCloser = async (regId: number, closerName: string) => {
    try {
      const response = await fetch('/api/bootcamp/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminSecret,
          registrationId: regId,
          assignedCloser: closerName
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('Closer assigned successfully');
        fetchRegistrations();
      }
    } catch (error) {
      console.error('Error assigning closer:', error);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Bootcamp Admin Login</h1>
          <form onSubmit={handleLogin}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Secret Key
            </label>
            <input
              type="password"
              value={adminSecret}
              onChange={(e) => setAdminSecret(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
              placeholder="Enter admin secret key"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bootcamp Registrations Dashboard</h1>
          <button
            onClick={() => fetchRegistrations()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600">Total Interested</p>
              <p className="text-3xl font-bold text-blue-600">{statistics.total_interested}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600">Paid Holding Fee</p>
              <p className="text-3xl font-bold text-green-600">{statistics.paid_holding_fees}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600">Contacted</p>
              <p className="text-3xl font-bold text-yellow-600">{statistics.contacted}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600">Closed Deals</p>
              <p className="text-3xl font-bold text-purple-600">{statistics.closed_deals}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-green-600">${statistics.total_revenue ? parseFloat(String(statistics.total_revenue)).toFixed(0) : '0'}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setTimeout(() => fetchRegistrations(), 100);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Statuses</option>
            <option value="interested">Interested</option>
            <option value="holding-paid">Holding Fee Paid</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
        </div>

        {/* Registrations Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Holding Fee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contacts</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {registrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {reg.first_name} {reg.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{reg.age_range}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reg.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reg.phone || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${reg.status === 'closed' ? 'bg-green-100 text-green-800' : ''}
                        ${reg.status === 'holding-paid' ? 'bg-blue-100 text-blue-800' : ''}
                        ${reg.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${reg.status === 'interested' ? 'bg-gray-100 text-gray-800' : ''}
                        ${reg.status === 'withdrawn' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {reg.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {reg.has_paid_holding_fee ? (
                        <span className="text-green-600 font-semibold">✓ Paid ${reg.amount_paid}</span>
                      ) : (
                        <span className="text-gray-400">Not paid</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reg.contact_attempts || 0} attempts
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedReg(reg)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Registration Details Modal */}
        {selectedReg && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedReg.first_name} {selectedReg.last_name}
                </h2>
                <button
                  onClick={() => setSelectedReg(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Contact Information */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Contact Information</h3>
                  <p className="text-sm text-gray-600">Email: {selectedReg.email}</p>
                  <p className="text-sm text-gray-600">Phone: {selectedReg.phone || 'N/A'}</p>
                  <p className="text-sm text-gray-600">Age: {selectedReg.age_range}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Status</h3>
                  <p className="text-sm text-gray-600">Current Status: {selectedReg.status}</p>
                  <p className="text-sm text-gray-600">
                    Holding Fee: {selectedReg.has_paid_holding_fee ? '✓ Paid' : '✗ Not Paid'}
                  </p>
                  <p className="text-sm text-gray-600">Contact Attempts: {selectedReg.contact_attempts}</p>
                </div>
              </div>

              {/* Demographics */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Demographics</h3>
                <p className="text-sm text-gray-600">Occupation: {selectedReg.current_occupation}</p>
                <p className="text-sm text-gray-600">Experience: {selectedReg.programming_experience}</p>
                <p className="text-sm text-gray-600">How They Heard: {selectedReg.how_did_you_hear}</p>
              </div>

              {/* Motivation */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Motivation</h3>
                <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                  {selectedReg.motivation || 'No motivation provided'}
                </p>
              </div>

              {/* Add Contact Log */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Add Contact Log</h3>
                <form onSubmit={handleAddContactLog} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Type</label>
                      <select
                        value={contactForm.contactType}
                        onChange={(e) => setContactForm({ ...contactForm, contactType: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        required
                      >
                        <option value="phone">Phone Call</option>
                        <option value="email">Email</option>
                        <option value="video-call">Video Call</option>
                        <option value="in-person">In Person</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contacted By</label>
                      <input
                        type="text"
                        value={contactForm.contactedBy}
                        onChange={(e) => setContactForm({ ...contactForm, contactedBy: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Your name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={contactForm.notes}
                      onChange={(e) => setContactForm({ ...contactForm, notes: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      rows={3}
                      placeholder="What was discussed..."
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Outcome</label>
                      <select
                        value={contactForm.outcome}
                        onChange={(e) => setContactForm({ ...contactForm, outcome: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        required
                      >
                        <option value="">Select outcome...</option>
                        <option value="interested">Still Interested</option>
                        <option value="needs-follow-up">Needs Follow-up</option>
                        <option value="closed-deal">Closed Deal!</option>
                        <option value="not-interested">Not Interested</option>
                        <option value="no-answer">No Answer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Next Contact Date</label>
                      <input
                        type="date"
                        value={contactForm.nextContactDate}
                        onChange={(e) => setContactForm({ ...contactForm, nextContactDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold"
                  >
                    Add Contact Log
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
