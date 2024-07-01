import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputUser1, setInputUser1] = useState('');
  const [inputUser2, setInputUser2] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = () => {
    fetch('http://localhost/adet-chat/api/api.php')
      .then(response => response.json())
      .then(data => {
        setMessages(data);
      })
      .catch(error => console.error('Error fetching messages:', error));
  };

  const handleSendMessageUser1 = () => {
    if (inputUser1.trim()) {
      const newMessage = { text: inputUser1, sender: 'user1' };
      saveMessage(newMessage);
      setInputUser1('');
    }
  };

  const handleSendMessageUser2 = () => {
    if (inputUser2.trim()) {
      const newMessage = { text: inputUser2, sender: 'user2' };
      saveMessage(newMessage);
      setInputUser2('');
    }
  };

  const saveMessage = (message) => {
    fetch('http://localhost/adet-chat/api/api.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          fetchMessages();
        } else {
          console.error('Error saving message:', data.message);
        }
      })
      .catch(error => console.error('Error saving message:', error));
  };

  const handleKeyPressUser1 = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSendMessageUser1();
    }
  };

  const handleKeyPressUser2 = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSendMessageUser2();
    }
  };

  const handleClearChat = () => {
    fetch('http://localhost/adet-chat/api/api.php', {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setMessages([]);
        } else {
          console.error('Error clearing chat:', data.message);
        }
      })
      .catch(error => console.error('Error clearing chat:', error));
  };

  const user1Messages = messages.filter(message => message.sender === 'user1');
  const user2Messages = messages.filter(message => message.sender === 'user2');

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-header">
              <h5>User 1 Window</h5>
            </div>
            <div className="card-body chat-container">
              {messages.map((message, index) => (
                <div key={index} className={`message-container ${message.sender === 'user1' ? 'text-right' : 'text-left'}`}>
                  <div className={`message ${message.sender === 'user1' ? 'sent' : 'received'}`}>
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="card-footer d-flex">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Type a message..."
                value={inputUser1}
                onChange={(e) => setInputUser1(e.target.value)}
                onKeyPress={handleKeyPressUser1}
              />
              <button className="btn btn-primary me-2" onClick={handleSendMessageUser1}>
                Send
              </button>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card">
            <div className="card-header">
              <h5>User 2 Window</h5>
            </div>
            <div className="card-body chat-container">
              {messages.map((message, index) => (
                <div key={index} className={`message-container ${message.sender === 'user2' ? 'text-right' : 'text-left'}`}>
                  <div className={`message ${message.sender === 'user2' ? 'sent' : 'received'}`}>
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="card-footer d-flex">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Type a message..."
                value={inputUser2}
                onChange={(e) => setInputUser2(e.target.value)}
                onKeyPress={handleKeyPressUser2}
              />
              <button className="btn btn-primary me-2" onClick={handleSendMessageUser2}>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col">
          <div className="card">
            <div className="card-footer d-flex justify-content-center">
              <button className="btn btn-danger" onClick={handleClearChat}>
                Clear Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
