import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Phone, Mail, Minimize2, Maximize2 } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import toast from 'react-hot-toast';

const ChatWidget: React.FC = () => {
  const { conversations, createConversation, sendMessage, totalUnreadCount } = useChat();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
  });
  const [showCustomerForm, setShowCustomerForm] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations, currentConversation]);

  const handleStartChat = async () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.subject) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const conversation = await createConversation({
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        subject: customerInfo.subject,
        priority: 'medium',
      });

      setCurrentConversation(conversation.id);
      setShowCustomerForm(false);
      
      // Send initial message
      await sendMessage({
        conversation_id: conversation.id,
        sender_type: 'customer',
        sender_name: customerInfo.name,
        message_text: `Hi, I'd like to discuss: ${customerInfo.subject}`,
        message_type: 'text',
      });

      toast.success('Chat started! We\'ll respond shortly.');
    } catch (error) {
      toast.error('Failed to start chat. Please try again.');
      console.error('Error starting chat:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !currentConversation) return;

    try {
      await sendMessage({
        conversation_id: currentConversation,
        sender_type: 'customer',
        sender_name: customerInfo.name,
        message_text: messageText,
        message_type: 'text',
      });

      setMessageText('');
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const currentConv = conversations.find(c => c.id === currentConversation);

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-40"
      >
        <MessageCircle className="w-6 h-6" />
        {totalUnreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
            {totalUnreadCount}
          </span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl z-50 transition-all duration-300 ${
          isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
        }`}>
          {/* Header */}
          <div className="bg-blue-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">WillPhil Motors</h3>
                <p className="text-blue-100 text-sm">We're here to help!</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white/80 hover:text-white transition-colors"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <div className="flex flex-col h-[536px]">
              {showCustomerForm ? (
                /* Customer Info Form */
                <div className="p-6 space-y-4">
                  <div className="text-center mb-6">
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">Start a Conversation</h4>
                    <p className="text-gray-600 text-sm">We'll get back to you within minutes!</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="+254 7XX XXX XXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                    <select
                      value={customerInfo.subject}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">Select a topic</option>
                      <option value="Vehicle Inquiry">Vehicle Inquiry</option>
                      <option value="Import Process">Import Process</option>
                      <option value="Pricing Information">Pricing Information</option>
                      <option value="Documentation Help">Documentation Help</option>
                      <option value="General Support">General Support</option>
                    </select>
                  </div>

                  <button
                    onClick={handleStartChat}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    Start Chat
                  </button>

                  <div className="text-center pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-2">Or contact us directly:</p>
                    <div className="flex justify-center space-x-4">
                      <a href="tel:+254700123456" className="flex items-center space-x-1 text-blue-500 hover:text-blue-600 text-sm">
                        <Phone className="w-4 h-4" />
                        <span>Call</span>
                      </a>
                      <a href="mailto:info@willphilmotors.co.ke" className="flex items-center space-x-1 text-blue-500 hover:text-blue-600 text-sm">
                        <Mail className="w-4 h-4" />
                        <span>Email</span>
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                /* Chat Messages */
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {currentConv?.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender_type === 'customer' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-2xl ${
                            message.sender_type === 'customer'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.message_text}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender_type === 'customer' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {new Date(message.created_at).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!messageText.trim()}
                        className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white p-2 rounded-lg transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChatWidget;