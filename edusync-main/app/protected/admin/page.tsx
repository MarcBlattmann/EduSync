'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { User, ChangeRequest } from '@/types/supabase';
import './admin.css';

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'users' | 'changes'>('users');

  useEffect(() => {
    const checkAdminAccess = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('Unauthorized access');
        setLoading(false);
        return;
      }

      // Check if user is admin in profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        setError('Unauthorized access');
        setLoading(false);
        return;
      }

      setCurrentUserEmail(user.email ?? 'No email available');

      // Fetch all users with their profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Fetch all change requests
      const { data: requests } = await supabase
        .from('change_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      setUsers(profiles || []);
      setChangeRequests(requests || []);
      setLoading(false);
    };

    checkAdminAccess();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) {
      setError(error.message);
    } else {
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    }
  };

  const handleChangeRequest = async (requestId: number, status: 'approved' | 'rejected') => {
    const supabase = createClient();
    
    try {
      const request = changeRequests.find(r => r.id === requestId);
      if (!request) return;

      // Decode the title to handle spaces and special characters
      const decodedTitle = decodeURIComponent(request.title);

      if (status === 'approved') {
        // Update the search suggestion content
        const { error: contentError } = await supabase
          .from('search_suggestions')
          .upsert({ 
            title: decodedTitle,
            content: request.suggested_content,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'title',  // This ensures we update based on title
            ignoreDuplicates: false // This ensures we update existing records
          });

        if (contentError) throw contentError;
      }

      // Update the change request status
      const { error: statusError } = await supabase
        .from('change_requests')
        .update({ status })
        .eq('id', requestId);

      if (statusError) throw statusError;

      // Update local state
      setChangeRequests(changeRequests.map(req =>
        req.id === requestId ? { ...req, status } : req
      ));

      // Show success message
      alert(status === 'approved' ? 'Changes approved and applied!' : 'Changes rejected.');

    } catch (error: any) {
      console.error('Error processing change request:', error);
      setError(error.message);
      alert('Error processing change request. Please try again.');
    }
  };

  const handleDelete = async (requestId: number) => {
    if (!confirm('Are you sure you want to delete this change request?')) return;
    
    const supabase = createClient();
    
    try {
      const { error } = await supabase
        .from('change_requests')
        .delete()
        .eq('id', requestId);

      if (error) throw error;

      // Update local state to remove the deleted request
      setChangeRequests(changeRequests.filter(req => req.id !== requestId));
      alert('Change request deleted successfully.');
    } catch (error: any) {
      console.error('Error deleting change request:', error);
      alert('Error deleting change request. Please try again.');
    }
  };

  if (loading) return <div className="admin-loading">Loading...</div>;
  if (error) return <div className="admin-error">Error: {error}</div>;

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      <div className="admin-info">
        <p>Logged in as: {currentUserEmail}</p>
      </div>
      
      <div className="admin-tabs">
        <button 
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          User Management
        </button>
        <button 
          className={`tab ${activeTab === 'changes' ? 'active' : ''}`}
          onClick={() => setActiveTab('changes')}
        >
          Change Requests
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="admin-section">
          <h2>User Management</h2>
          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.email}</td>
                    <td>
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      >
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'changes' && (
        <div className="admin-section">
          <h2>Change Requests</h2>
          <div className="changes-table">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {changeRequests.map((request) => (
                  <tr key={request.id}>
                    <td>{decodeURIComponent(request.title)}</td>
                    <td className="status-column">{request.status}</td>
                    <td className="date-column">{new Date(request.created_at).toLocaleDateString()}</td>
                    <td className="actions-column">
                      {request.status === 'pending' && (
                        <div className="action-buttons">
                          <button
                            className="approve-button"
                            onClick={() => handleChangeRequest(request.id, 'approved')}
                          >
                            Approve
                          </button>
                          <button
                            className="reject-button"
                            onClick={() => handleChangeRequest(request.id, 'rejected')}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      <div className="action-buttons">
                        {request.status === 'approved' && (
                          <button
                            className="delete-button"
                            onClick={() => handleDelete(request.id)}
                          >
                            Delete
                          </button>
                        )}
                        <button
                          className="view-button"
                          onClick={() => {
                            alert(
                              `Original Content:\n${request.original_content}\n\n` +
                              `Suggested Content:\n${request.suggested_content}`
                            );
                          }}
                        >
                          View Changes
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
