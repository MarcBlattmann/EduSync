'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useSnackbar } from '@/context/SnackbarContext';
import './ChangeRequest.css';

interface ChangeRequestProps {
  contentId: string;
  originalContent: string;
  onClose: () => void;
}

export default function ChangeRequest({ contentId, originalContent, onClose }: ChangeRequestProps) {
  const [suggestedContent, setSuggestedContent] = useState(originalContent);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();
  const { showSnackbar } = useSnackbar();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        showSnackbar('You must be logged in to submit changes', 'error');
        return;
      }

      const { error } = await supabase
        .from('change_requests')
        .insert({
          content_id: contentId,
          user_id: user.id,
          original_content: originalContent,
          suggested_content: suggestedContent,
          reason: reason,
          status: 'pending'
        });

      if (error) throw error;

      showSnackbar('Change request submitted successfully', 'success');
      onClose();
    } catch (error: any) {
      showSnackbar('Failed to submit change request. Please try again.', 'error');
      console.error('Change request error:', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="change-request-container">
      <h3>Submit Change Request</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Suggested Changes:</label>
          <textarea
            value={suggestedContent}
            onChange={(e) => setSuggestedContent(e.target.value)}
            required
            rows={5}
          />
        </div>
        <div className="form-group">
          <label>Reason for Changes:</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            rows={3}
            placeholder="Please explain why this change is needed..."
          />
        </div>
        <div className="button-group">
          <button 
            type="button" 
            onClick={onClose}
            className="cancel-button"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="submit-button"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
