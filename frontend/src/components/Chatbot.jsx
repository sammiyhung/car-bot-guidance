import React, { useState, useEffect, useRef } from 'react';

function Chatbot() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Toggle chat window
  const chatEndRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message;
    setChatHistory([...chatHistory, { sender: 'user', text: userMessage }]);
    setMessage('');
    setIsTyping(true);

    fetch('/api/chatbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage }),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsTyping(false);
        setChatHistory([...chatHistory, { sender: 'user', text: userMessage }, { sender: 'bot', text: data.reply }]);
        scrollToBottom();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  return (
    <>
      {/* Fixed bot icon */}
      <div
        className="fixed bottom-6 right-6 bg-blue-900 text-white p-4 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Bot icon (you can replace this SVG with any other bot icon if needed) */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {/* Bot head (circular shape) */}
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
          
          {/* Eyes (two small circles) */}
          <circle cx="9" cy="10" r="1" fill="currentColor" />
          <circle cx="15" cy="10" r="1" fill="currentColor" />
          
          {/* Mouth (curved line for smile) */}
          <path d="M9 14c.5 1 2 1 3 1s2.5 0 3-1" stroke="currentColor" strokeWidth="1.5" fill="none" />

          {/* Antenna (small rectangle on top of the head) */}
          <line x1="12" y1="4" x2="12" y2="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="2" r="0.5" fill="currentColor" />
        </svg>
      </div>

      {/* Chat overlay panel */}
      {isOpen && (
        <div className="fixed top-10 right-5 w-full md:w-1/3 h-3/4 bg-white shadow-lg p-4 flex flex-col rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white text-center p-2 bg-black w-full rounded-md">Chat with our Bot</h2>
          </div>

          <div className="flex-grow overflow-y-auto mb-4">
            {chatHistory.map((chat, index) => (
              <div key={index} className={`mb-2 flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    chat.sender === 'user' ? 'bg-blue-900 text-white' : 'bg-gray-300'
                  }`}
                >
                  {chat.text.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="mb-2 flex justify-start">
                <div className="max-w-xs px-4 py-2 rounded-lg bg-gray-200">
                  <div className="flex space-x-2">
                    <div className="dot bg-gray-400 w-2 h-2 rounded-full animate-pulse"></div>
                    <div className="dot bg-gray-400 w-2 h-2 rounded-full animate-pulse"></div>
                    <div className="dot bg-gray-400 w-2 h-2 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <form className="flex items-center" onSubmit={handleSubmit}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border border-gray-300 rounded-lg"
            />
            <button
              type="submit"
              className="ml-2 p-2 bg-black text-white rounded-lg hover:bg-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default Chatbot;
