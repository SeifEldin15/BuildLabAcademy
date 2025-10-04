'use client';

import { useState, useEffect } from 'react';

interface Verification {
  id: string;
  email: string;
  full_name: string;
  school_name: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  discount_code: string;
  discount_percentage: number;
  created_at: string;
  verified_at?: string;
  expires_at?: string;
  user_name: string;
}

interface AdminStats {
  verifications: {
    pending_count: number;
    verified_count: number;
    rejected_count: number;
    total_count: number;
    recent_count: number;
  };
  usage: {
    total_usage: number;
    total_discount_amount: number;
    unique_users: number;
  };
  topSchools: Array<{
    school_name: string;
    count: number;
  }>;
}

export default function StudentAdminPage() {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminKey, setAdminKey] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const authenticate = () => {
    if (adminKey === process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY) {
      setAuthenticated(true);
      fetchVerifications();
      fetchStats();
    } else {
      alert('Invalid admin key');
    }
  };

  const fetchVerifications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        adminKey,
        limit: limit.toString(),
        offset: (page * limit).toString(),
      });
      
      if (filter !== 'all') {
        params.append('status', filter);
      }

      const response = await fetch(`/api/student-discount/admin?${params}`);
      if (response.ok) {
        const data = await response.json();
        setVerifications(data.verifications);
        setTotal(data.total);
      }
    } catch (error) {
      console.error('Failed to fetch verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/student-discount/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminKey })
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const performAction = async (verificationId: string, action: string, notes?: string) => {
    try {
      const response = await fetch('/api/student-discount/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          verificationId,
          adminKey,
          notes
        })
      });

      if (response.ok) {
        await fetchVerifications();
        await fetchStats();
      } else {
        const error = await response.json();
        alert(error.error || 'Action failed');
      }
    } catch (error) {
      console.error('Action failed:', error);
      alert('Action failed');
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetchVerifications();
    }
  }, [filter, page, authenticated]);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-center mb-6">Student Admin Portal</h1>
          <div className="space-y-4">
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Enter admin key"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={authenticate}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Access Admin Panel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Student Verification Admin</h1>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Total Applications</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.verifications.total_count}</p>
              <p className="text-sm text-gray-500">{stats.verifications.recent_count} in last 30 days</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Pending Review</h3>
              <p className="text-3xl font-bold text-yellow-600">{stats.verifications.pending_count}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Verified Students</h3>
              <p className="text-3xl font-bold text-green-600">{stats.verifications.verified_count}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Total Savings</h3>
              <p className="text-3xl font-bold text-purple-600">
                ${parseFloat(stats.usage.total_discount_amount.toString()).toFixed(0)}
              </p>
              <p className="text-sm text-gray-500">{stats.usage.total_usage} discount uses</p>
            </div>
          </div>
        )}

        {/* Top Schools */}
        {stats && stats.topSchools.length > 0 && (
          <div className="bg-white rounded-lg shadow mb-8 p-6">
            <h2 className="text-xl font-semibold mb-4">Top Schools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.topSchools.map((school, index) => (
                <div key={school.school_name} className="flex items-center space-x-3">
                  <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                  <div>
                    <p className="font-medium">{school.school_name}</p>
                    <p className="text-sm text-gray-500">{school.count} students</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-8 p-6">
          <div className="flex flex-wrap gap-4 items-center">
            <h2 className="text-xl font-semibold">Verifications</h2>
            <div className="flex space-x-2">
              {['all', 'pending', 'verified', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => { setFilter(status); setPage(0); }}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    filter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Verifications Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading verifications...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        School
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applied
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {verifications.map((verification) => (
                      <tr key={verification.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {verification.full_name}
                            </div>
                            <div className="text-sm text-gray-500">{verification.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {verification.school_name || 'Not specified'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            verification.verification_status === 'verified'
                              ? 'bg-green-100 text-green-800'
                              : verification.verification_status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {verification.verification_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(verification.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          {verification.verification_status === 'pending' && (
                            <>
                              <button
                                onClick={() => performAction(verification.id, 'approve')}
                                className="text-green-600 hover:text-green-900"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => performAction(verification.id, 'reject')}
                                className="text-red-600 hover:text-red-900"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {verification.verification_status === 'verified' && (
                            <button
                              onClick={() => performAction(verification.id, 'reset')}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Reset
                            </button>
                          )}
                          {verification.verification_status === 'rejected' && (
                            <button
                              onClick={() => performAction(verification.id, 'approve')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Approve
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {total > limit && (
                <div className="bg-white px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {page * limit + 1} to {Math.min((page + 1) * limit, total)} of {total} results
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setPage(Math.max(0, page - 1))}
                      disabled={page === 0}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={(page + 1) * limit >= total}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
