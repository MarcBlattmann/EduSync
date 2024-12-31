'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { use } from 'react';
import { createClient } from '@/utils/supabase/client';
import './page.css';

export default function SearchResults({ params }: { params: Promise<{ query: string }> }) {
  const searchParams = useSearchParams();
  const resolvedParams = use(params);
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState('');
  const [savedContent, setSavedContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const title = decodeURIComponent(resolvedParams.query);

  const fetchContent = useCallback(async () => {
    const supabase = createClient();
    const initialContent = decodeURIComponent(searchParams.get('content') || '');
    setEditableContent(initialContent);
    setSavedContent(initialContent);

    // Fetch existing content from database
    const { data, error } = await supabase
      .from('search_suggestions')
      .select('content')
      .eq('title', title)
      .single();

    if (data) {
      setEditableContent(data.content);
      setSavedContent(data.content);
    }
  }, [searchParams, title]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const handleSave = async () => {
    try {
      const supabase = createClient();
      // Check if entry exists
      const { data: existing } = await supabase
        .from('search_suggestions')
        .select('id')
        .eq('title', title)
        .single();

      if (existing) {
        // Update existing entry
        const { error } = await supabase
          .from('search_suggestions')
          .update({ content: editableContent })
          .eq('title', title);

        if (error) throw error;
      } else {
        // Create new entry
        const { error } = await supabase
          .from('search_suggestions')
          .insert([{ 
            title: title,
            content: editableContent,
            category: 'general' // or any default category you want
          }]);

        if (error) throw error;
      }
      
      setSavedContent(editableContent);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Failed to save content. Please try again.');
    }
  };

  const handleSubmitRequest = async () => {
    try {
      setIsSubmitting(true);
      const supabase = createClient();

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Submit change request
      const { error } = await supabase
        .from('change_requests')
        .insert([{
          title: title,
          current_content: savedContent,
          proposed_content: editableContent,
          user_id: user.id
        }]);

      if (error) throw error;
      
      setIsEditing(false);
      alert('Change request submitted successfully!');
    } catch (error) {
      console.error('Error submitting change request:', error);
      alert('Failed to submit change request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditableContent(savedContent);
    setIsEditing(false);
  };

  return (
    <div className="search-results">
      <div className="search-header">
        <h1>{title}</h1>
        <div className="edit-controls">
          {isEditing ? (
            <>
              <button 
                onClick={handleSubmitRequest} 
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Change Request'}
              </button>
              <button onClick={handleCancel} className="cancel-button">Cancel</button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="edit-button">
              Suggest Edit
            </button>
          )}
        </div>
      </div>
      {isEditing ? (
        <textarea
          className="content-editor"
          value={editableContent}
          onChange={(e) => setEditableContent(e.target.value)}
        />
      ) : (
        <div 
          className="search-content"
          dangerouslySetInnerHTML={{ __html: savedContent }}
        />
      )}
    </div>
  );
}
