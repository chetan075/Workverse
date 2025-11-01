'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MessageCircle, 
  Send, 
  Paperclip, 
  MoreVertical,
  Search,
  Plus,
  Video,
  Phone,
  User,
  Clock,
  Check,
  CheckCheck,
  Smile,
  Image,
  File,
  X,
  ArrowLeft
} from 'lucide-react';
import { 
  fetchChatConversations, 
  fetchConversationMessages, 
  sendMessage, 
  createConversation,
  markMessageAsRead,
  uploadChatFile,
  fetchMe,
  createSSEConnection
} from '@/lib/api';

interface Message {
  id: string;
  content: string;
  type: 'text' | 'file' | 'image';
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  createdAt: string;
  readBy: string[];
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
}

interface Conversation {
  id: string;
  title?: string;
  participants: Array<{
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'CLIENT' | 'FREELANCER';
    isOnline: boolean;
    lastSeen?: string;
  }>;
  lastMessage?: {
    content: string;
    senderId: string;
    createdAt: string;
    type: 'text' | 'file' | 'image';
  };
  unreadCount: number;
  projectId?: string;
  projectTitle?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ChatPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showConversationList, setShowConversationList] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sseConnectionRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowConversationList(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    loadInitialData();
    setupSSEConnection();
    
    return () => {
      if (sseConnectionRef.current) {
        sseConnectionRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const user = await fetchMe();
      setCurrentUser(user);
      
      // Load conversations with mock data
      const mockConversations: Conversation[] = [
        {
          id: '1',
          participants: [
            {
              id: '1',
              name: 'Sarah Johnson',
              email: 'sarah@techcorp.com',
              avatar: '',
              role: 'CLIENT',
              isOnline: true
            },
            {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              isOnline: true
            }
          ],
          lastMessage: {
            content: 'The latest designs look great! Can we schedule a call to discuss the next phase?',
            senderId: '1',
            createdAt: '2025-11-01T14:30:00Z',
            type: 'text'
          },
          unreadCount: 2,
          projectId: 'proj_001',
          projectTitle: 'E-commerce Website Redesign',
          createdAt: '2025-10-28T10:00:00Z',
          updatedAt: '2025-11-01T14:30:00Z'
        },
        {
          id: '2',
          participants: [
            {
              id: '2',
              name: 'Mike Chen',
              email: 'mike@startup.com',
              avatar: '',
              role: 'CLIENT',
              isOnline: false,
              lastSeen: '2025-11-01T12:00:00Z'
            },
            {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              isOnline: true
            }
          ],
          lastMessage: {
            content: 'Thanks for the quick turnaround!',
            senderId: user.id,
            createdAt: '2025-11-01T10:15:00Z',
            type: 'text'
          },
          unreadCount: 0,
          projectId: 'proj_002',
          projectTitle: 'Mobile App Development',
          createdAt: '2025-10-25T14:20:00Z',
          updatedAt: '2025-11-01T10:15:00Z'
        },
        {
          id: '3',
          participants: [
            {
              id: '3',
              name: 'Emily Rodriguez',
              email: 'emily@design.co',
              avatar: '',
              role: 'FREELANCER',
              isOnline: true
            },
            {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              isOnline: true
            }
          ],
          lastMessage: {
            content: 'I sent over the logo concepts. Let me know what you think!',
            senderId: '3',
            createdAt: '2025-10-31T16:45:00Z',
            type: 'text'
          },
          unreadCount: 1,
          createdAt: '2025-10-30T09:30:00Z',
          updatedAt: '2025-10-31T16:45:00Z'
        }
      ];
      
      setConversations(mockConversations);
      
      // Auto-select first conversation on desktop
      if (!isMobile && mockConversations.length > 0) {
        setSelectedConversation(mockConversations[0]);
        loadMessages(mockConversations[0].id);
      }
      
    } catch (error) {
      console.error('Error loading chat data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupSSEConnection = () => {
    sseConnectionRef.current = createSSEConnection(
      (data: any) => {
        // Handle real-time messages
        if (data.type === 'new_message') {
          if (selectedConversation && data.conversationId === selectedConversation.id) {
            setMessages(prev => [...prev, data.message]);
          }
          // Update conversation list
          setConversations(prev => prev.map(conv => 
            conv.id === data.conversationId 
              ? { ...conv, lastMessage: data.message, unreadCount: conv.unreadCount + 1 }
              : conv
          ));
        }
      },
      (error) => {
        console.error('SSE connection error:', error);
      }
    );
  };

  const loadMessages = async (conversationId: string) => {
    try {
      setMessagesLoading(true);
      
      // Mock messages data
      const mockMessages: Message[] = [
        {
          id: '1',
          content: 'Hi! I\'ve reviewed your project proposal and I\'m very interested in working with you.',
          type: 'text',
          senderId: conversationId === '1' ? '1' : '2',
          senderName: conversationId === '1' ? 'Sarah Johnson' : 'Mike Chen',
          createdAt: '2025-10-28T10:30:00Z',
          readBy: ['1', '2']
        },
        {
          id: '2',
          content: 'Great! I\'d love to discuss the details further. When would be a good time for a call?',
          type: 'text',
          senderId: currentUser?.id || 'user',
          senderName: currentUser?.name || 'You',
          createdAt: '2025-10-28T11:15:00Z',
          readBy: ['1', '2']
        },
        {
          id: '3',
          content: 'How about tomorrow at 2 PM? I can share my screen to show you some initial concepts.',
          type: 'text',
          senderId: conversationId === '1' ? '1' : '2',
          senderName: conversationId === '1' ? 'Sarah Johnson' : 'Mike Chen',
          createdAt: '2025-10-28T12:00:00Z',
          readBy: ['1', '2']
        },
        {
          id: '4',
          content: 'Perfect! Looking forward to it.',
          type: 'text',
          senderId: currentUser?.id || 'user',
          senderName: currentUser?.name || 'You',
          createdAt: '2025-10-28T12:30:00Z',
          readBy: ['1', '2']
        }
      ];
      
      if (conversationId === '1') {
        mockMessages.push({
          id: '5',
          content: 'The latest designs look great! Can we schedule a call to discuss the next phase?',
          type: 'text',
          senderId: '1',
          senderName: 'Sarah Johnson',
          createdAt: '2025-11-01T14:30:00Z',
          readBy: ['1']
        });
      }
      
      setMessages(mockMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation || sendingMessage) return;
    
    try {
      setSendingMessage(true);
      
      const newMessage: Message = {
        id: Date.now().toString(),
        content: messageText.trim(),
        type: 'text',
        senderId: currentUser.id,
        senderName: currentUser.name,
        createdAt: new Date().toISOString(),
        readBy: [currentUser.id]
      };
      
      // Optimistically add message
      setMessages(prev => [...prev, newMessage]);
      setMessageText('');
      
      // Update conversation
      setConversations(prev => prev.map(conv => 
        conv.id === selectedConversation.id 
          ? { 
              ...conv, 
              lastMessage: {
                content: newMessage.content,
                senderId: newMessage.senderId,
                createdAt: newMessage.createdAt,
                type: newMessage.type
              },
              updatedAt: newMessage.createdAt
            }
          : conv
      ));
      
      // In real implementation, send to backend
      // await sendMessage(selectedConversation.id, { content: messageText.trim() });
      
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!selectedConversation) return;
    
    try {
      setSendingMessage(true);
      
      // In real implementation, upload file first
      // const uploadResult = await uploadChatFile(file, selectedConversation.id);
      
      const newMessage: Message = {
        id: Date.now().toString(),
        content: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'file',
        senderId: currentUser.id,
        senderName: currentUser.name,
        createdAt: new Date().toISOString(),
        readBy: [currentUser.id],
        fileUrl: URL.createObjectURL(file), // Mock URL
        fileName: file.name,
        fileSize: file.size
      };
      
      setMessages(prev => [...prev, newMessage]);
      setSelectedFile(null);
      
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return formatTime(dateString);
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find(p => p.id !== currentUser?.id);
  };

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    loadMessages(conversation.id);
    
    if (isMobile) {
      setShowConversationList(false);
    }
    
    // Mark messages as read
    setConversations(prev => prev.map(conv => 
      conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv
    ));
  };

  const filteredConversations = conversations.filter(conv => {
    const otherParticipant = getOtherParticipant(conv);
    return otherParticipant?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           conv.projectTitle?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex h-screen bg-white shadow-lg overflow-hidden">
          {/* Conversations List */}
          {(showConversationList || !isMobile) && (
            <div className={`${isMobile ? 'w-full' : 'w-1/3'} border-r border-gray-200 flex flex-col`}>
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-xl font-bold text-gray-900">Messages</h1>
                  <button
                    onClick={() => setShowNewChatModal(true)}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    title="Start new conversation"
                    aria-label="Start new conversation"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <MessageCircle className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No conversations yet</h3>
                    <p className="text-gray-500 mt-1">Start a new conversation to get chatting!</p>
                    <button
                      onClick={() => setShowNewChatModal(true)}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Start New Chat
                    </button>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => {
                    const otherParticipant = getOtherParticipant(conversation);
                    const isSelected = selectedConversation?.id === conversation.id;
                    
                    return (
                      <div
                        key={conversation.id}
                        onClick={() => handleConversationSelect(conversation)}
                        className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                          isSelected ? 'bg-blue-50 border-blue-200' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                              {otherParticipant?.avatar ? (
                                <img 
                                  src={otherParticipant.avatar} 
                                  alt={otherParticipant.name}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                              ) : (
                                <User className="h-6 w-6 text-gray-600" />
                              )}
                            </div>
                            {otherParticipant?.isOnline && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-medium text-gray-900 truncate">
                                {otherParticipant?.name}
                              </h3>
                              <span className="text-xs text-gray-500">
                                {formatDate(conversation.lastMessage?.createdAt || conversation.updatedAt)}
                              </span>
                            </div>
                            
                            {conversation.projectTitle && (
                              <p className="text-xs text-blue-600 truncate">
                                {conversation.projectTitle}
                              </p>
                            )}
                            
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-sm text-gray-500 truncate">
                                {conversation.lastMessage?.senderId === currentUser?.id && (
                                  <span className="mr-1">You: </span>
                                )}
                                {conversation.lastMessage?.content}
                              </p>
                              {conversation.unreadCount > 0 && (
                                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                                  {conversation.unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Chat Window */}
          {(!showConversationList || !isMobile) && (
            <div className={`${isMobile ? 'w-full' : 'flex-1'} flex flex-col`}>
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {isMobile && (
                          <button
                            onClick={() => setShowConversationList(true)}
                            className="p-1 text-gray-500 hover:text-gray-700"
                            title="Back to conversations"
                            aria-label="Back to conversations"
                          >
                            <ArrowLeft className="h-5 w-5" />
                          </button>
                        )}
                        
                        <div className="relative">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            {getOtherParticipant(selectedConversation)?.avatar ? (
                              <img 
                                src={getOtherParticipant(selectedConversation)!.avatar} 
                                alt={getOtherParticipant(selectedConversation)!.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <User className="h-5 w-5 text-gray-600" />
                            )}
                          </div>
                          {getOtherParticipant(selectedConversation)?.isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {getOtherParticipant(selectedConversation)?.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {getOtherParticipant(selectedConversation)?.isOnline 
                              ? 'Online' 
                              : `Last seen ${formatDate(getOtherParticipant(selectedConversation)?.lastSeen || '')}`
                            }
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button 
                          className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                          title="Voice call"
                          aria-label="Start voice call"
                        >
                          <Phone className="h-5 w-5" />
                        </button>
                        <button 
                          className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                          title="Video call"
                          aria-label="Start video call"
                        >
                          <Video className="h-5 w-5" />
                        </button>
                        <button 
                          className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                          title="More options"
                          aria-label="More options"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    
                    {selectedConversation.projectTitle && (
                      <div className="mt-2 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-lg inline-block">
                        Project: {selectedConversation.projectTitle}
                      </div>
                    )}
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-200px)]">
                    {messagesLoading ? (
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    ) : (
                      messages.map((message, index) => {
                        const isOwn = message.senderId === currentUser?.id;
                        const showAvatar = !isOwn && (index === 0 || messages[index - 1].senderId !== message.senderId);
                        
                        return (
                          <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                              {showAvatar && (
                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                                  <User className="h-4 w-4 text-gray-600" />
                                </div>
                              )}
                              
                              <div className={`px-4 py-2 rounded-lg ${
                                isOwn 
                                  ? 'bg-blue-600 text-white' 
                                  : 'bg-gray-100 text-gray-900'
                              } ${!showAvatar && !isOwn ? 'ml-10' : ''}`}>
                                {message.type === 'text' && (
                                  <p className="text-sm">{message.content}</p>
                                )}
                                
                                {message.type === 'image' && (
                                  <div>
                                    <img 
                                      src={message.fileUrl} 
                                      alt={message.fileName}
                                      className="max-w-full h-auto rounded"
                                    />
                                    <p className="text-xs mt-1 opacity-75">{message.fileName}</p>
                                  </div>
                                )}
                                
                                {message.type === 'file' && (
                                  <div className="flex items-center space-x-2">
                                    <File className="h-4 w-4" />
                                    <div>
                                      <p className="text-sm font-medium">{message.fileName}</p>
                                      <p className="text-xs opacity-75">
                                        {message.fileSize ? `${(message.fileSize / 1024).toFixed(1)} KB` : ''}
                                      </p>
                                    </div>
                                  </div>
                                )}
                                
                                <div className={`flex items-center justify-between mt-1 ${
                                  isOwn ? 'text-blue-100' : 'text-gray-500'
                                }`}>
                                  <span className="text-xs">{formatTime(message.createdAt)}</span>
                                  {isOwn && (
                                    <div className="ml-2">
                                      {message.readBy.length > 1 ? (
                                        <CheckCheck className="h-3 w-3" />
                                      ) : (
                                        <Check className="h-3 w-3" />
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="border-t border-gray-200 p-4">
                    {selectedFile && (
                      <div className="mb-3 p-2 bg-gray-50 rounded-lg flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {selectedFile.type.startsWith('image/') ? (
                            <Image className="h-4 w-4 text-gray-500" />
                          ) : (
                            <File className="h-4 w-4 text-gray-500" />
                          )}
                          <span className="text-sm text-gray-700">{selectedFile.name}</span>
                        </div>
                        <button
                          onClick={() => setSelectedFile(null)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                    
                    <div className="flex items-end space-x-2">
                      <div className="flex-1">
                        <div className="flex items-end space-x-2">
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                            title="Attach file"
                            aria-label="Attach file"
                          >
                            <Paperclip className="h-5 w-5" />
                          </button>
                          
                          <div className="flex-1 relative">
                            <input
                              type="text"
                              value={messageText}
                              onChange={(e) => setMessageText(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                              placeholder="Type a message..."
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                              disabled={sendingMessage}
                            />
                          </div>
                          
                          <button 
                            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                            title="Add emoji"
                            aria-label="Add emoji"
                          >
                            <Smile className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      
                      <button
                        onClick={selectedFile ? () => handleFileUpload(selectedFile) : handleSendMessage}
                        disabled={(!messageText.trim() && !selectedFile) || sendingMessage}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        title={selectedFile ? "Send file" : "Send message"}
                        aria-label={selectedFile ? "Send file" : "Send message"}
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      hidden
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedFile(file);
                        }
                      }}
                      accept="image/*,.pdf,.doc,.docx,.txt,.zip"
                    />
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900">Select a conversation</h3>
                    <p className="text-gray-500 mt-1">Choose a conversation from the list to start chatting</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">New Conversation</h3>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="text-gray-500 hover:text-gray-700"
                title="Close modal"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search users
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Type a name or email..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="max-h-48 overflow-y-auto">
                <div className="space-y-2">
                  {/* Mock users */}
                  {[
                    { id: '4', name: 'Alex Thompson', email: 'alex@example.com', role: 'CLIENT' },
                    { id: '5', name: 'Maria Garcia', email: 'maria@design.co', role: 'FREELANCER' },
                    { id: '6', name: 'John Smith', email: 'john@startup.io', role: 'CLIENT' }
                  ].map((user) => (
                    <div
                      key={user.id}
                      onClick={() => {
                        // Create new conversation
                        setShowNewChatModal(false);
                      }}
                      className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                    >
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                          user.role === 'CLIENT' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}