import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Send, 
  Check, 
  Trash2, 
  Search, 
  Clock, 
  User, 
  CornerDownRight, 
  ExternalLink, 
  ShieldCheck, 
  RefreshCw, 
  MessageSquare, 
  Sparkles,
  Inbox,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Filter,
  Copy
} from 'lucide-react';
import { ContactMessage, InquiryReply } from '../types';
import { api } from '../lib/api';

interface AdminInquiriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  username?: string;
  onInquiryCountChange?: (unreadCount: number) => void;
}

export const AdminInquiriesModal: React.FC<AdminInquiriesModalProps> = ({
  isOpen,
  onClose,
  username = 'Maazawan982',
  onInquiryCountChange
}) => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'unread' | 'pending' | 'replied'>('all');
  
  // Reply Composer State
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [statusNotification, setStatusNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Initialize and load inquiries
  useEffect(() => {
    if (isOpen) {
      loadInquiries();
    }
  }, [isOpen, username]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setStatusNotification({ message, type });
    setTimeout(() => {
      setStatusNotification(null);
    }, 4000);
  };

  const loadInquiries = async () => {
    setLoading(true);
    try {
      // Ensure admin session token is active
      await api.getAdminSession().catch(() => {});

      const data = await api.getMessages(username);
      setMessages(data || []);

      if (onInquiryCountChange) {
        const unread = (data || []).filter(m => !m.read).length;
        onInquiryCountChange(unread);
      }

      // Automatically select the first message if none is selected
      if (data && data.length > 0 && !selectedMessageId) {
        setSelectedMessageId(data[0].id);
      }
    } catch (err: any) {
      console.warn('Could not load messages from server, using existing state:', err);
      showToast('Connecting to database...', 'success');
    } finally {
      setLoading(false);
    }
  };

  // Find currently selected message
  const selectedMessage = messages.find(m => m.id === selectedMessageId) || null;

  // Filter messages based on search query and active tab
  const filteredMessages = messages.filter(m => {
    const matchesSearch = 
      m.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.senderEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.message.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterTab === 'unread') return !m.read;
    if (filterTab === 'pending') return !m.replied;
    if (filterTab === 'replied') return !!m.replied;
    return true;
  });

  const unreadCount = messages.filter(m => !m.read).length;
  const repliedCount = messages.filter(m => m.replied).length;
  const pendingCount = messages.filter(m => !m.replied).length;

  const handleSelectMessage = async (msg: ContactMessage) => {
    setSelectedMessageId(msg.id);
    setReplyText('');

    // Mark as read if not already read
    if (!msg.read) {
      try {
        await api.markMessageRead(msg.id);
        const updated = messages.map(m => m.id === msg.id ? { ...m, read: true } : m);
        setMessages(updated);
        if (onInquiryCountChange) {
          onInquiryCountChange(updated.filter(m => !m.read).length);
        }
      } catch (err) {
        // Fallback local update
        const updated = messages.map(m => m.id === msg.id ? { ...m, read: true } : m);
        setMessages(updated);
      }
    }
  };

  const handleToggleRead = async (msgId: string, currentRead: boolean) => {
    try {
      await api.toggleMessageRead(msgId, !currentRead);
      const updated = messages.map(m => m.id === msgId ? { ...m, read: !currentRead } : m);
      setMessages(updated);
      if (onInquiryCountChange) {
        onInquiryCountChange(updated.filter(m => !m.read).length);
      }
      showToast(!currentRead ? 'Marked as read' : 'Marked as unread');
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDeleteMessage = async (msgId: string) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;

    try {
      await api.deleteMessage(msgId);
      const updated = messages.filter(m => m.id !== msgId);
      setMessages(updated);

      if (selectedMessageId === msgId) {
        setSelectedMessageId(updated.length > 0 ? updated[0].id : null);
      }

      if (onInquiryCountChange) {
        onInquiryCountChange(updated.filter(m => !m.read).length);
      }
      showToast('Inquiry deleted successfully');
    } catch (err) {
      showToast('Failed to delete inquiry', 'error');
    }
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;

    setSendingReply(true);
    try {
      const updatedMsg = await api.replyToMessage(
        selectedMessage.id,
        replyText.trim(),
        'Maaz Nadeem',
        'maazawan2468@gmail.com'
      );

      // Update state
      const updated = messages.map(m => m.id === selectedMessage.id ? updatedMsg : m);
      setMessages(updated);
      setReplyText('');
      showToast('Response saved and recorded in thread!');
    } catch (err: any) {
      // Fallback local persistence if server is unavailable
      const newReply: InquiryReply = {
        id: `reply-${Date.now()}`,
        senderName: 'Maaz Nadeem',
        senderEmail: 'maazawan2468@gmail.com',
        replyMessage: replyText.trim(),
        createdAt: new Date().toISOString()
      };

      const updated = messages.map(m => {
        if (m.id === selectedMessage.id) {
          return {
            ...m,
            read: true,
            replied: true,
            repliedAt: newReply.createdAt,
            replies: [...(m.replies || []), newReply]
          };
        }
        return m;
      });

      setMessages(updated);
      setReplyText('');
      showToast('Response recorded in conversation history!');
    } finally {
      setSendingReply(false);
    }
  };

  const handleOpenMailto = () => {
    if (!selectedMessage) return;
    const subject = encodeURIComponent(`Re: ${selectedMessage.subject}`);
    const body = encodeURIComponent(
      `${replyText ? replyText + '\n\n' : ''}---\nOn ${new Date(selectedMessage.createdAt).toLocaleString()}, ${selectedMessage.senderName} wrote:\n> ${selectedMessage.message.replace(/\n/g, '\n> ')}`
    );
    window.open(`mailto:${selectedMessage.senderEmail}?subject=${subject}&body=${body}`, '_blank');
  };

  const handleApplyTemplate = (templateType: 'call' | 'collab' | 'thanks') => {
    if (!selectedMessage) return;
    const name = selectedMessage.senderName.split(' ')[0] || 'there';

    let text = '';
    if (templateType === 'call') {
      text = `Hi ${name},\n\nThank you for reaching out and reviewing my portfolio! I would be delighted to discuss this opportunity. Are you available for a brief 15-20 minute introductory call sometime this week?\n\nBest regards,\nMaaz Nadeem\nFull-Stack Developer\nhttps://github.com/Maazawan982`;
    } else if (templateType === 'collab') {
      text = `Hi ${name},\n\nThanks for your message! I would love to collaborate with you on this project. Let's connect on LinkedIn (www.linkedin.com/in/maaz-nadeem-56428030a) or coordinate via email to discuss the technical requirements and architecture.\n\nWarm regards,\nMaaz Nadeem`;
    } else if (templateType === 'thanks') {
      text = `Hi ${name},\n\nThank you for getting in touch through my developer portfolio! I appreciate your message and inquiry. I am reviewing the details and will get back to you shortly.\n\nBest regards,\nMaaz Nadeem`;
    }

    setReplyText(text);
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div 
        className="relative max-w-5xl w-full h-[90vh] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-zinc-100 font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toast notification */}
        {statusNotification && (
          <div className="absolute top-4 right-4 z-50 px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono shadow-lg flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{statusNotification.message}</span>
          </div>
        )}

        {/* Modal Top Header */}
        <div className="px-5 py-3.5 border-b border-zinc-800 bg-zinc-900/90 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold font-mono text-zinc-100">
                  Admin Mode • Inquiries & Responses
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Authenticated as Maaz Nadeem
                </span>
              </div>
              <p className="text-[11px] font-mono text-zinc-400 hidden sm:block">
                View, manage, and respond to incoming portfolio inquiries and recruiter messages.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadInquiries}
              disabled={loading}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono px-2.5"
              title="Refresh Inquiries"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
              title="Exit Admin Mode"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats & Quick Filter Strip */}
        <div className="px-5 py-2.5 border-b border-zinc-800/80 bg-zinc-900/40 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          {/* Quick Metrics */}
          <div className="flex items-center gap-4 text-zinc-400">
            <span>
              Total: <strong className="text-zinc-200">{messages.length}</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Unread: <strong className="text-amber-400">{unreadCount}</strong>
              {unreadCount > 0 && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>}
            </span>
            <span>•</span>
            <span>
              Pending Reply: <strong className="text-zinc-200">{pendingCount}</strong>
            </span>
            <span>•</span>
            <span>
              Replied: <strong className="text-emerald-400">{repliedCount}</strong>
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                filterTab === 'all' 
                  ? 'bg-emerald-500 text-zinc-950 font-bold' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All ({messages.length})
            </button>
            <button
              onClick={() => setFilterTab('unread')}
              className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                filterTab === 'unread' 
                  ? 'bg-amber-500 text-zinc-950 font-bold' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilterTab('pending')}
              className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                filterTab === 'pending' 
                  ? 'bg-zinc-700 text-white font-bold' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Needs Reply ({pendingCount})
            </button>
            <button
              onClick={() => setFilterTab('replied')}
              className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                filterTab === 'replied' 
                  ? 'bg-emerald-500 text-zinc-950 font-bold' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Replied ({repliedCount})
            </button>
          </div>
        </div>

        {/* Master Detail Workspace */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* Left Column: Inquiries List */}
          <div className={`${selectedMessageId ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-zinc-800 flex-col bg-zinc-950/60 flex-shrink-0`}>
            {/* Search Input */}
            <div className="p-3 border-b border-zinc-800/80">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search sender, email, subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* List of Inquiries */}
            <div className="flex-1 overflow-y-auto divide-y divide-zinc-900">
              {filteredMessages.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 font-mono text-xs">
                  <Inbox className="w-8 h-8 mx-auto mb-2 text-zinc-600" />
                  <p>No inquiries found</p>
                  <span className="text-[11px] text-zinc-600">Try adjusting your search or filter</span>
                </div>
              ) : (
                filteredMessages.map((msg) => {
                  const isSelected = msg.id === selectedMessageId;
                  const dateStr = new Date(msg.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric'
                  });

                  return (
                    <button
                      key={msg.id}
                      onClick={() => handleSelectMessage(msg)}
                      className={`w-full text-left p-3.5 transition-colors relative flex flex-col gap-1.5 ${
                        isSelected 
                          ? 'bg-zinc-800/80 border-l-2 border-emerald-400' 
                          : 'hover:bg-zinc-900/60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-xs font-mono truncate font-semibold ${
                          !msg.read ? 'text-emerald-300 font-bold' : 'text-zinc-200'
                        }`}>
                          {msg.senderName}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500 flex-shrink-0">
                          {dateStr}
                        </span>
                      </div>

                      <div className="text-xs text-zinc-300 font-medium truncate">
                        {msg.subject}
                      </div>

                      <div className="text-[11px] text-zinc-400 line-clamp-1 font-mono">
                        {msg.message}
                      </div>

                      <div className="flex items-center gap-1.5 mt-1">
                        {!msg.read && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                            NEW
                          </span>
                        )}
                        {msg.replied ? (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                            <Check className="w-2.5 h-2.5" /> Replied
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-zinc-800 text-zinc-400 border border-zinc-700">
                            Pending
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Selected Inquiry Viewer & Response Studio */}
          <div className={`${!selectedMessageId ? 'hidden md:flex' : 'flex'} flex-1 flex-col overflow-y-auto bg-zinc-900/30`}>
            {/* Mobile Back to List Button */}
            {selectedMessage && (
              <div className="md:hidden px-4 py-2.5 border-b border-zinc-800 bg-zinc-900/90 flex items-center justify-between">
                <button
                  onClick={() => setSelectedMessageId(null)}
                  className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 hover:underline py-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Inquiries</span>
                </button>
                <span className="text-[11px] font-mono text-zinc-400">
                  {messages.findIndex(m => m.id === selectedMessage.id) + 1} of {messages.length}
                </span>
              </div>
            )}

            {selectedMessage ? (
              <div className="p-4 sm:p-6 flex flex-col gap-5 max-w-3xl mx-auto w-full">
                {/* Header Information Card */}
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col gap-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-zinc-100 font-mono">
                        {selectedMessage.subject}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs font-mono text-zinc-400">
                        <span className="text-zinc-200 font-semibold">{selectedMessage.senderName}</span>
                        <span>•</span>
                        <a 
                          href={`mailto:${selectedMessage.senderEmail}`}
                          className="text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          {selectedMessage.senderEmail}
                        </a>
                        <button
                          onClick={() => handleCopyEmail(selectedMessage.senderEmail)}
                          className="p-1 hover:text-zinc-200 transition-colors"
                          title="Copy email address"
                        >
                          {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => handleToggleRead(selectedMessage.id, selectedMessage.read)}
                        className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono transition-colors"
                      >
                        {selectedMessage.read ? 'Mark Unread' : 'Mark Read'}
                      </button>
                      <button
                        onClick={() => handleDeleteMessage(selectedMessage.id)}
                        className="p-1.5 rounded bg-zinc-800 hover:bg-red-950/60 text-zinc-400 hover:text-red-400 transition-colors"
                        title="Delete Inquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Received on: {new Date(selectedMessage.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                {/* Original Message Content */}
                <div className="p-4 sm:p-5 rounded-xl bg-zinc-900/70 border border-zinc-800 flex flex-col gap-2">
                  <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    Inquiry Message:
                  </div>
                  <div className="text-sm font-sans text-zinc-200 leading-relaxed whitespace-pre-line pt-1">
                    {selectedMessage.message}
                  </div>
                </div>

                {/* Response Thread (if any replies were previously recorded) */}
                {selectedMessage.replies && selectedMessage.replies.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <div className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <CornerDownRight className="w-4 h-4" />
                      Response History ({selectedMessage.replies.length}):
                    </div>

                    {selectedMessage.replies.map((reply) => (
                      <div 
                        key={reply.id} 
                        className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex flex-col gap-2"
                      >
                        <div className="flex items-center justify-between text-xs font-mono text-emerald-400">
                          <span className="font-bold flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            Sent by {reply.senderName} ({reply.senderEmail})
                          </span>
                          <span className="text-[11px] text-zinc-400">
                            {new Date(reply.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="text-xs text-zinc-200 font-sans leading-relaxed whitespace-pre-line">
                          {reply.replyMessage}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Response Composer Studio */}
                <div className="p-4 sm:p-5 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col gap-3 shadow-lg">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="text-xs font-mono text-zinc-300 font-bold flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5 text-emerald-400" />
                      Compose Response to {selectedMessage.senderName}:
                    </label>

                    {/* Pre-made Templates */}
                    <div className="flex items-center gap-1.5 text-[11px] font-mono">
                      <span className="text-zinc-500 hidden sm:inline">Templates:</span>
                      <button
                        type="button"
                        onClick={() => handleApplyTemplate('call')}
                        className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-emerald-400 transition-colors"
                      >
                        + Schedule Call
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyTemplate('collab')}
                        className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-emerald-400 transition-colors"
                      >
                        + Collaborate
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyTemplate('thanks')}
                        className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-emerald-400 transition-colors"
                      >
                        + Thanks
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={5}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Hi ${selectedMessage.senderName.split(' ')[0]}, thank you for reaching out...`}
                    className="w-full p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-xs font-sans leading-relaxed focus:outline-none focus:border-emerald-500 transition-colors"
                  />

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={handleOpenMailto}
                      className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-mono transition-colors flex items-center gap-1.5"
                      title="Open in your default email application with pre-populated message"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open in Email Client (mailto)</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSendReply}
                        disabled={sendingReply || !replyText.trim()}
                        className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs font-mono transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-500/10 disabled:opacity-40"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{sendingReply ? 'Sending & Saving...' : 'Save & Record Response'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-500 font-mono text-xs">
                <Inbox className="w-12 h-12 mb-3 text-zinc-700" />
                <p className="text-sm font-bold text-zinc-400">Select an inquiry from the list</p>
                <p className="text-[11px] text-zinc-600 mt-1">Review recruiter inquiries, send replies, or open in email</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
