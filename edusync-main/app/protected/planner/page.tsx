'use client'

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import "./page.css";
import { createClient } from '@/utils/supabase/client';

// Types
type ItemType = 'homework' | 'exam' | 'presentation' | 'other';

interface PlannerItem {
  id: number;
  title: string;
  date: string;
  type: ItemType;
  user_id: string;
}

interface EditModalProps {
  item: PlannerItem;
  onClose: () => void;
  onSave: (updatedItem: PlannerItem) => void;
}

// Utility functions
const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

// Main Planner component
const Planner: React.FC = () => {
  const [items, setItems] = useState<PlannerItem[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [editingItem, setEditingItem] = useState<PlannerItem | null>(null);
  const supabase = createClient();

  // Fetch items from Supabase
  const fetchItems = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('planner_items')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    fetchItems();

    // Subscribe to changes
    const channel = supabase
      .channel('planner_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'planner_items',
        },
        async (payload) => {
          await fetchItems(); // Refresh the data when changes occur
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  // Add item to Supabase
  const addItem = async (newItem: Omit<PlannerItem, 'id' | 'user_id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('planner_items')
        .insert([{ ...newItem, user_id: user.id }]);

      if (error) throw error;
      await fetchItems(); // Refresh the data after adding
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  // Delete item from Supabase
  const deleteItem = async (id: number) => {
    try {
      const { error } = await supabase
        .from('planner_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchItems(); // Refresh the data after deleting
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  // Update item in Supabase
  const updateItem = async (updatedItem: PlannerItem) => {
    try {
      const { error } = await supabase
        .from('planner_items')
        .update({
          title: updatedItem.title,
          date: updatedItem.date,
          type: updatedItem.type
        })
        .eq('id', updatedItem.id);

      if (error) throw error;
      await fetchItems();
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const getItemsForDay = (day: number, month: number, year: number) => {
    // Format date to match exactly with the stored format
    const paddedMonth = (month + 1).toString().padStart(2, '0');
    const paddedDay = day.toString().padStart(2, '0');
    const dateString = `${year}-${paddedMonth}-${paddedDay}`;
    return items.filter(item => item.date === dateString);
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const itemId = parseInt(result.draggableId);
    // Use the droppableId directly as it's already in the correct format
    const destinationDate = result.destination.droppableId;

    const itemToMove = items.find(item => item.id === itemId);
    if (!itemToMove) return;

    // Update optimistically with the exact date string
    const updatedItems = items.map(item => 
      item.id === itemId ? { ...item, date: destinationDate } : item
    );
    setItems(updatedItems);

    try {
      const { error } = await supabase
        .from('planner_items')
        .update({ date: destinationDate })
        .eq('id', itemId);

      if (error) throw error;
    } catch (error) {
      console.error('Error moving item:', error);
      setItems(items);
    }
  };

  // AddItemForm subcomponent
  const AddItemForm: React.FC<{ addItem: (item: Omit<PlannerItem, 'id' | 'user_id'>) => void }> = ({ addItem }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [type, setType] = useState<ItemType>('homework');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (title && date) {
        addItem({ title, date, type });
        setTitle('');
        setDate('');
        setType('homework');
      }
    };

    return (
      <form onSubmit={handleSubmit} className="add-item-form">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value as ItemType)}
        >
          <option value="homework">Homework</option>
          <option value="exam">Exam</option>
          <option value="presentation">Presentation</option>
          <option value="other">Other</option>
        </select>
        <button type="submit">Add Item</button>
      </form>
    );
  };

  // Edit Modal Component
  const EditModal: React.FC<EditModalProps> = ({ item, onClose, onSave }) => {
    const [title, setTitle] = useState(item.title);
    const [date, setDate] = useState(item.date);
    const [type, setType] = useState<ItemType>(item.type);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave({ ...item, title, date, type });
    };

    return (
      <div className="modal-overlay">
        <div className="modal">
          <form onSubmit={handleSubmit}>
            <h3>Edit Item</h3>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ItemType)}
            >
              <option value="homework">Homework</option>
              <option value="exam">Exam</option>
              <option value="presentation">Presentation</option>
              <option value="other">Other</option>
            </select>
            <div className="modal-buttons">
              <button type="submit">Save</button>
              <button type="button" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Calendar subcomponent
  const Calendar: React.FC<{ items: PlannerItem[] }> = ({ items }) => {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

    const navigateMonth = (direction: 'prev' | 'next') => {
      const newDate = new Date(currentDate);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      setCurrentDate(newDate);
    };

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="calendar">
          <div className="calendar-header">
            <button className="month-nav" onClick={() => navigateMonth('prev')} aria-label="Previous month">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h2>{currentDate.toLocaleString('default', { month: 'long' })} {currentYear}</h2>
            <button className="month-nav" onClick={() => navigateMonth('next')} aria-label="Next month">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <div className="calendar-grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="calendar-day-header">{day}</div>
            ))}
            {blanks.map(blank => (
              <div key={`blank-${blank}`} className="calendar-day empty"></div>
            ))}
            {days.map(day => {
              const paddedMonth = (currentMonth + 1).toString().padStart(2, '0');
              const paddedDay = day.toString().padStart(2, '0');
              const dayDate = `${currentYear}-${paddedMonth}-${paddedDay}`;
              
              return (
                <Droppable droppableId={dayDate} key={`day-${day}`}>
                  {(provided) => (
                    <div
                      className="calendar-day"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <span className="day-number">{day}</span>
                      {getItemsForDay(day, currentMonth, currentYear).map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id.toString()}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`calendar-item ${item.type} ${snapshot.isDragging ? 'dragging' : ''}`}
                              onClick={(e) => {
                                if (!snapshot.isDragging) {
                                  setEditingItem(item);
                                }
                              }}
                            >
                              {item.title}
                              <button 
                                className="delete-button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteItem(item.id);
                                }}
                              >
                                ×
                              </button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              );
            })}
          </div>
        </div>
      </DragDropContext>
    );
  };

  return (
    <div className="planner">
      <h1>Planner</h1>
      <AddItemForm addItem={addItem} />
      <Calendar items={items} />
      {editingItem && (
        <EditModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={updateItem}
        />
      )}
    </div>
  );
};

export default Planner;

