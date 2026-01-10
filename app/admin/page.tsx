'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Download, Trash2, Loader2, Lock, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubscriberData {
  count: number;
  subscribers: string[];
}

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<SubscriberData | null>(null);
  const [error, setError] = useState('');
  const [showKey, setShowKey] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey.trim()) {
      setError('Please enter an admin key');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/subscribe?key=${encodeURIComponent(adminKey)}`);
      
      if (response.ok) {
        const subscriberData = await response.json();
        setData(subscriberData);
        setIsAuthenticated(true);
        localStorage.setItem('admin_key', adminKey);
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || 'Invalid admin key';
        const hint = errorData.hint || '';
        
        // Show specific error messages with hints
        if (errorMessage.includes('not configured')) {
          setError('Admin authentication is not configured on the server. Please contact the administrator.');
        } else if (errorMessage.includes('Invalid admin key') || errorMessage.includes('Unauthorized')) {
          const fullMessage = hint ? `${errorMessage}. ${hint}` : errorMessage;
          setError(fullMessage);
          console.error('Admin login failed:', { error: errorMessage, hint });
        } else {
          setError(errorMessage);
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError('Failed to connect. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubscribers = async () => {
    const savedKey = localStorage.getItem('admin_key') || adminKey;
    if (!savedKey) return;

    try {
      const response = await fetch(`/api/subscribe?key=${encodeURIComponent(savedKey)}`);
      if (response.ok) {
        const subscriberData = await response.json();
        setData(subscriberData);
      }
    } catch (err) {
      console.error('Failed to fetch subscribers:', err);
    }
  };

  useEffect(() => {
    const savedKey = localStorage.getItem('admin_key');
    if (savedKey) {
      setAdminKey(savedKey);
      fetchSubscribers().then(() => {
        setIsAuthenticated(true);
      });
    }
  }, []);

  const handleDelete = async (email: string) => {
    if (!confirm(`Are you sure you want to remove ${email}?`)) return;

    const savedKey = localStorage.getItem('admin_key') || adminKey;
    try {
      const response = await fetch('/api/subscribe', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, key: savedKey }),
      });

      if (response.ok) {
        // Refresh the list
        await fetchSubscribers();
      } else {
        alert('Failed to delete email');
      }
    } catch (err) {
      alert('Failed to delete email');
    }
  };

  const handleExport = () => {
    if (!data || !data.subscribers.length) return;

    const csv = data.subscribers.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_key');
    setIsAuthenticated(false);
    setAdminKey('');
    setData(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border border-bg-card/50 rounded-lg p-8"
        >
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-bg-card mb-4">
              <Lock className="h-6 w-6 text-text-muted" />
            </div>
            <h1 className="text-2xl font-light text-text-primary mb-2">
              Admin Access
            </h1>
            <p className="text-sm text-text-muted font-light">
              Enter your admin key to view subscribers
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
              <input
                type={showKey ? 'text' : 'password'}
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Enter admin key"
                className="w-full pl-10 pr-10 py-3 bg-bg-primary border border-bg-card/50 rounded-lg text-text-primary placeholder:text-text-muted font-light text-sm focus:outline-none focus:border-text-muted/50 transition-colors"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-500 font-light text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                'w-full py-3 border border-bg-card/50 rounded-lg text-sm font-light transition-colors flex items-center justify-center gap-2',
                isLoading
                  ? 'bg-bg-card text-text-muted cursor-not-allowed'
                  : 'bg-bg-card hover:bg-bg-card/80 text-text-primary hover:border-text-muted/50 cursor-pointer'
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Access Admin Panel</span>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-light text-text-primary mb-2">
              Email Subscribers
            </h1>
            <p className="text-sm text-text-muted font-light">
              Manage your mailing list
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-bg-card/50 rounded-lg text-sm font-light text-text-muted hover:text-text-primary hover:border-text-muted/50 transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        {data && (
          <div className="border border-bg-card/50 rounded-lg p-6 mb-8 bg-bg-card/30">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-bg-card flex items-center justify-center">
                  <Mail className="h-5 w-5 text-text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-light text-text-primary">
                    {data.count}
                  </p>
                  <p className="text-xs text-text-muted font-light">
                    Total Subscribers
                  </p>
                </div>
              </div>
              <button
                onClick={handleExport}
                disabled={!data.count}
                className={cn(
                  'px-4 py-2 border border-bg-card/50 rounded-lg text-sm font-light transition-colors flex items-center gap-2',
                  data.count
                    ? 'bg-bg-card hover:bg-bg-card/80 text-text-primary hover:border-text-muted/50 cursor-pointer'
                    : 'bg-bg-card/50 text-text-muted cursor-not-allowed'
                )}
              >
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        )}

        {/* Email List */}
        {data && data.subscribers.length > 0 ? (
          <div className="border border-bg-card/50 rounded-lg overflow-hidden">
            <div className="divide-y divide-bg-card/50">
              {data.subscribers.map((email, index) => (
                <motion.div
                  key={email}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 hover:bg-bg-card/30 transition-colors group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="h-8 w-8 rounded-full bg-bg-card flex items-center justify-center flex-shrink-0">
                      <Mail className="h-4 w-4 text-text-muted" />
                    </div>
                    <p className="text-sm md:text-base font-light text-text-primary truncate">
                      {email}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(email)}
                    className="p-2 text-text-muted hover:text-red-500 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                    title="Delete email"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="border border-bg-card/50 rounded-lg p-12 text-center">
            <Mail className="h-12 w-12 text-text-muted mx-auto mb-4 opacity-50" />
            <p className="text-base font-light text-text-secondary">
              No subscribers yet
            </p>
            <p className="text-sm text-text-muted font-light mt-2">
              Subscribers will appear here once they sign up
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

