'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import './page.css';

// Define proper types for the params
type SearchPageProps = {
  params: Promise<{ query: string }>;
}

export default function SearchPage({ params }: SearchPageProps) {
  const searchParams = useSearchParams();
  const resolvedParams = React.use(params);
  const query = resolvedParams.query;
  
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState('');
  const [savedContent, setSavedContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const title = decodeURIComponent(query);

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

  const handleSubmitChangeRequest = async (originalContent: string, suggestedContent: string) => {
    try {
      setIsSubmitting(true);
      const supabase = createClient();
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw new Error('Authentication required');
      if (!user) throw new Error('User not found');

      const { error: insertError } = await supabase
        .from('change_requests')
        .insert({
          content_id: query,
          user_id: user.id,
          title: query,
          original_content: originalContent,
          suggested_content: suggestedContent,
          content_type: 'search_result',
          status: 'pending'
        })
        .single();

      if (insertError) throw new Error(insertError.message);

      alert('Change request submitted successfully!');
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error submitting change request:', {
        name: error.name,
        message: error.message,
        code: error?.code,
        details: error?.details
      });
      alert(`Failed to submit change request: ${error.message}`);
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
                onClick={() => handleSubmitChangeRequest(savedContent, editableContent)} 
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
