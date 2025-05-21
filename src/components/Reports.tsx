import React, { useEffect, useState } from 'react';
import { todoService, Todo } from '../services/todo';
import '../styles/Reports.css';
export {};

const Reports: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await todoService.getAll();
        setTodos(response);
        setError(null);
      } catch (err) {
        setError('Failed to load todos');
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  // Calculate statistics
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.status === 'completed').length;
  const pendingTodos = todos.filter(todo => todo.status === 'pending').length;
  const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  // Group todos by priority
  const priorityGroups = {
    high: todos.filter(todo => todo.priority === 'high'),
    medium: todos.filter(todo => todo.priority === 'medium'),
    low: todos.filter(todo => todo.priority === 'low')
  };

  // Group todos by creation date (last 7 days)
  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() - i);
    return date.toISOString().split('T')[0];
  });

  const todosByDate = last7Days.map(date => {
    return {
      date,
      count: todos.filter(todo => todo.created_at.startsWith(date)).length
    };
  }).reverse();

  return (
    <div className="reports-container">
      <h1>Todo Reports & Analytics</h1>
      
      {error && <p className="error-message">{error}</p>}
      
      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <>
          <div className="report-section summary-stats">
            <h2>Summary</h2>
            <div className="stats-container">
              <div className="stat-card">
                <h3>{totalTodos}</h3>
                <p>Total Tasks</p>
              </div>
              <div className="stat-card">
                <h3>{completedTodos}</h3>
                <p>Completed</p>
              </div>
              <div className="stat-card">
                <h3>{pendingTodos}</h3>
                <p>Pending</p>
              </div>
              <div className="stat-card">
                <h3>{completionRate}%</h3>
                <p>Completion Rate</p>
              </div>
            </div>
          </div>

          <div className="report-section">
            <h2>Priority Breakdown</h2>
            <div className="priority-breakdown">
              <div className="priority-group high">
                <h3>High Priority</h3>
                <p>{priorityGroups.high.length} tasks</p>
                {priorityGroups.high.length > 0 && (
                  <ul>
                    {priorityGroups.high.map(todo => (
                      <li key={todo.id} className={`todo-item ${todo.status}`}>
                        {todo.title}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="priority-group medium">
                <h3>Medium Priority</h3>
                <p>{priorityGroups.medium.length} tasks</p>
                {priorityGroups.medium.length > 0 && (
                  <ul>
                    {priorityGroups.medium.map(todo => (
                      <li key={todo.id} className={`todo-item ${todo.status}`}>
                        {todo.title}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="priority-group low">
                <h3>Low Priority</h3>
                <p>{priorityGroups.low.length} tasks</p>
                {priorityGroups.low.length > 0 && (
                  <ul>
                    {priorityGroups.low.map(todo => (
                      <li key={todo.id} className={`todo-item ${todo.status}`}>
                        {todo.title}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="report-section">
            <h2>Recent Activity</h2>
            <div className="activity-chart">
              {todosByDate.map(day => (
                <div key={day.date} className="day-column">
                  <div className="day-bar" style={{ height: `${day.count * 30}px` }}>
                    {day.count > 0 && <span className="count">{day.count}</span>}
                  </div>
                  <div className="day-label">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="report-section">
            <h2>All Tasks</h2>
            <table className="todos-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Created</th>
                  <th>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {todos.map(todo => (
                  <tr key={todo.id} className={todo.status}>
                    <td>{todo.title}</td>
                    <td>{todo.status}</td>
                    <td>{todo.priority}</td>
                    <td>{new Date(todo.created_at).toLocaleDateString()}</td>
                    <td>{new Date(todo.updated_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
