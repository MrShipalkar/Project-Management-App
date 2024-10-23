import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import AddTaskModal from '../addTaskModal/AddTaskModal'; 
import './Board.css';
import Collapse from '../../assets/collapse.png';
import Add from '../../assets/add.png';
import Addpeople from '../../assets/Addpeople.png';
import Dropdown from '../../assets/down.png';
import TaskCard from '../taskCard/TaskCard'; 

const Board = () => {
    const [userName, setUserName] = useState('');
    const [error, setError] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
    const [selectedOption, setSelectedOption] = useState('This week'); 
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false); 
    const [tasks, setTasks] = useState([]); 

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const token = localStorage.getItem('auth-token');
                if (!token) {
                    throw new Error('No token available');
                }

                const res = await axios.get('http://localhost:5000/api/users/profile', {
                    headers: {
                        'auth-token': token,
                    },
                });

                setUserName(res.data.name);
            } catch (error) {
                setError('Error fetching user details');
            }
        };

        fetchUserName();
    }, []);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem('auth-token');
                if (!token) {
                    throw new Error('No token found');
                }

                const res = await axios.get('http://localhost:5000/api/tasks', {
                    headers: {
                        'auth-token': token,
                    },
                });
                setTasks(res.data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
                setError('Error fetching tasks');
            }
        };

        fetchTasks();
    }, []);

    const handleStatusChange = (updatedTask) => {
        setTasks((prevTasks) => 
            prevTasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
        );
    };

    const handleDeleteTask = (deletedTaskId) => {
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== deletedTaskId));
    };

    const filterTasksByStatus = (status) => {
        return tasks.filter(task => task.status === status);
    };

    return (
        <div className="board-container">
            <header className="board-header">
                <div>
                    <h2>Welcome! {userName || 'User'} </h2>
                </div>
                <div>
                    <p>{new Date().toDateString()}</p>
                </div>
            </header>

            {error && <p className="error-message">{error}</p>}

            <div className="board-title">
                <div className="board-title-name">
                    <h3>Board</h3>
                    <div className="add-people-btn">
                        <img src={Addpeople} alt="Add People" /> Add People
                    </div>
                </div>
                <div className="dropdown-container">
                    <p className="this-week" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                        {selectedOption} <span><img src={Dropdown} alt="Dropdown Icon" /></span>
                    </p>
                    {isDropdownOpen && (
                        <ul className="dropdown">
                            <li onClick={() => setSelectedOption('Today')}>Today</li>
                            <li onClick={() => setSelectedOption('This Week')}>This Week</li>
                            <li onClick={() => setSelectedOption('This Month')}>This Month</li>
                        </ul>
                    )}
                </div>
            </div>

            <div className="board-columns">
                <div className="board-column">
                    <div className="column-header">
                        <h3>Backlog</h3>
                        <button className="icon-btn">
                            <img src={Collapse} alt="Collapse" />
                        </button>
                    </div>
                    {filterTasksByStatus('backlog').map(task => (
                        <TaskCard
                            key={task._id}
                            taskId={task._id}
                            priority={task.priority}
                            title={task.title}
                            checklist={task.checklist}
                            dueDate={task.dueDate}
                            column="backlog"
                            onStatusChange={handleStatusChange}
                            onDeleteTask={handleDeleteTask} 
                        />
                    ))}
                </div>

                <div className="board-column">
                    <div className="column-header">
                        <h3>To do</h3>
                        <div>
                            <button className="add-task-btn" onClick={() => setIsAddTaskModalOpen(true)}>
                                <img src={Add} alt="Add Task" />
                            </button>
                            <button className="icon-btn">
                                <img src={Collapse} alt="Collapse" />
                            </button>
                        </div>
                    </div>
                    {filterTasksByStatus('to-do').map(task => (
                        <TaskCard
                            key={task._id}
                            taskId={task._id}
                            priority={task.priority}
                            title={task.title}
                            checklist={task.checklist}
                            dueDate={task.dueDate}
                            column="to-do"
                            onStatusChange={handleStatusChange}
                            onDeleteTask={handleDeleteTask} 
                        />
                    ))}
                </div>

                <div className="board-column">
                    <div className="column-header">
                        <h3>In progress</h3>
                        <button className="icon-btn">
                            <img src={Collapse} alt="Collapse" />
                        </button>
                    </div>
                    {filterTasksByStatus('in-progress').map(task => (
                        <TaskCard
                            key={task._id}
                            taskId={task._id}
                            priority={task.priority}
                            title={task.title}
                            checklist={task.checklist}
                            dueDate={task.dueDate}
                            column="progress"
                            onStatusChange={handleStatusChange}
                            onDeleteTask={handleDeleteTask} 
                        />
                    ))}
                </div>

                <div className="board-column">
                    <div className="column-header">
                        <h3>Done</h3>
                        <button className="icon-btn">
                            <img src={Collapse} alt="Collapse" />
                        </button>
                    </div>
                    {filterTasksByStatus('done').map(task => (
                        <TaskCard
                            key={task._id}
                            taskId={task._id}
                            priority={task.priority}
                            title={task.title}
                            checklist={task.checklist}
                            dueDate={task.dueDate}
                            column="done"
                            onStatusChange={handleStatusChange}
                            onDeleteTask={handleDeleteTask} 
                        />
                    ))}
                </div>
            </div>

            <AddTaskModal
                isOpen={isAddTaskModalOpen}
                onClose={() => setIsAddTaskModalOpen(false)}
            />
        </div>
    );
};

export default Board;
