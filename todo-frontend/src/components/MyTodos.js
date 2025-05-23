import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';

const MyTodos = ({ username, onLogout }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [newTodoTime, setNewTodoTime] = useState('');

  const formatDate = (date) => date.toISOString().split('T')[0]; 

  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTime, setEditTime] = useState('');

  useEffect(() => {
    if (username) fetchTodos();
  }, [selectedDate]);

  const fetchTodos = async () => {
    try {
      const dateStr = formatDate(selectedDate);
      const res = await axios.get(`http://localhost:8080/api/users/${username}/todos/${formatDate(selectedDate)}`);
      setTodos(res.data);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    }
  };

  const addTodo = async () => {
    if (!newTodoTitle.trim()) return;
    try {
      const dueDateTime = new Date(`${formatDate(selectedDate)}T${newTodoTime || '00:00'}`);
      const res = await axios.post(`http://localhost:8080/api/users/${username}/todos`, {
        title: newTodoTitle,
        description: newTodoDescription,
        dueDateTime: `${formatDate(selectedDate)}T${newTodoTime || '00:00'}`,
        isDone: false
      });
      setTodos([...todos, res.data]);
      setNewTodoTitle('');
      setNewTodoDescription('');
      setNewTodoTime('');
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  const markAsComplete = async (id, isDone) => {
    try {
      await axios.patch(`http://localhost:8080/api/todos/${id}`, { isDone });
      setTodos(todos.map(todo => todo.id === id ? { ...todo, isDone } : todo));
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/todos/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const saveEdit = async (id) => {
    const originalTodo = todos.find((todo) => todo.id === id);

    // ✅ Fix: format selectedDate to ISO string
    const formattedDate = new Date(selectedDate).toISOString().split('T')[0]; // YYYY-MM-DD
    const dueDateTime = `${formattedDate}T${editTime}:00`; // ISO format: 2025-05-23T12:00:00

    const updatedTodo = {
      title: editTitle,
      description: editDescription,
      dueDateTime: dueDateTime,
      isDone: originalTodo?.isDone || false,  // fallback to false if undefined
    };

    console.log("Sending updates:", updatedTodo); // optional but helpful
    console.log("Edit time selected:", editTime);
    console.log("Selected date:", selectedDate);

    try {
      const response = await fetch(`http://localhost:8080/api/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTodo),
      });
      console.log("Response:", response);
      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Backend error response:", errorBody);
        throw new Error('Failed to update todo');
      }

      const updatedTodos = todos.map((todo) =>
        todo.id === id ? { ...todo, ...updatedTodo } : todo
      );
      setTodos(updatedTodos);
      setEditingTodoId(null);
    } catch (err) {
      console.error(err);
    }
  };




  {/* Frontend */}
  return (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '90px',
      backgroundColor: 'white',
      borderRadius: '500px',
      boxShadow: '0 0 20px rgba(0,0,0,0.1)'
    }}
  >
  <div style={{ maxWidth: '1000px', width: '50%' }}>
    <h2>{username}'s To-Do List</h2>
    <button onClick={onLogout} style={{ marginBottom: '20px' }}>Log Out</button>

    {/* Row layout for calendar and task list */}
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '40px' }}>
      
      {/* Left side Calendar and Add Todo Form */}
      <div style={{ flex: '1' }}>
        <Calendar onChange={setSelectedDate} value={selectedDate} />
        
        {/* Add Todo Form below Calendar */}
        <div style={{ marginTop: '20px' }}>
          <h3>Add New Task</h3>
          <input
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            placeholder="Todo Title"
            style={{ display: 'block', marginBottom: '10px', width: '100%' }}
          />
          <input
            type="time"
            value={newTodoTime}
            onChange={(e) => setNewTodoTime(e.target.value)}
            style={{ display: 'block', marginBottom: '10px', width: '50%' }}
          />
          <textarea
            value={newTodoDescription}
            onChange={(e) => setNewTodoDescription(e.target.value)}
            placeholder="Optional Description"
            style={{ display: 'block', marginBottom: '10px', width: '100%' }}
          />
          <button onClick={addTodo}>Add Todo</button>
        </div>
      </div>

      {/* Right side: Task List */}
      <div style={{ flex: '2' }}>
        <h3>Tasks for {formatDate(selectedDate)}</h3>
        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
          {todos.length === 0 ? (
            <li style={{ fontStyle: 'italic', color: 'gray' }}>No tasks for today</li>
          ) : (
            [...todos]
              .sort((a, b) => new Date(a.dueDateTime) - new Date(b.dueDateTime))
              .map((todo) => (
                <li key={todo.id} style={{ marginBottom: '15px' }}>
                  {editingTodoId === todo.id ? (
                    <>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        style={{ display: 'block', marginBottom: '5px', width: '50%' }}
                      />
                      <input
                        type="time"
                        value={editTime}
                        onChange={(e) => setEditTime(e.target.value)}
                        style={{ display: 'block', marginBottom: '5px', width: '30%' }}
                      />
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        style={{ display: 'block', marginBottom: '5px', width: '50%' }}
                      />
                      <button onClick={() => saveEdit(todo.id)} style={{ marginRight: '5px' }}>Save</button>
                      <button onClick={() => setEditingTodoId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <strong>{todo.title}</strong> {todo.isDone ? '✅' : ''}
                      <br />
                      {todo.description && <span>{todo.description}<br /></span>}
                      {todo.dueDateTime && (
                        <span>
                          Time: {new Date(todo.dueDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          <br />
                        </span>
                      )}
                      <button onClick={() => markAsComplete(todo.id, !todo.isDone)}>
                        {todo.isDone ? 'Undo' : 'Complete'}
                      </button>
                      <button
                        onClick={() => {
                          setEditingTodoId(todo.id);
                          setEditTitle(todo.title);
                          setEditDescription(todo.description);
                          setEditTime(todo.dueDateTime?.slice(11, 16) || '');
                        }}
                        style={{ marginLeft: '10px' }}
                      >
                        Edit
                      </button>
                      <button onClick={() => deleteTodo(todo.id)} style={{ marginLeft: '10px' }}>Delete</button>
                    </>
                  )}
                </li>
              ))
          )}
        </ul>

      </div>
    </div>
  </div>
  </div>
  );

};

export default MyTodos;
