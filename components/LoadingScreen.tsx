'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const messages = [
  'Increase Bandwidth, Reduce Latency',
];

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Wait for page to fully load
    const checkPageLoad = () => {
      if (document.readyState === 'complete') {
        // Give a minimum display time
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      } else {
        window.addEventListener('load', () => {
          setTimeout(() => {
            setIsLoading(false);
          }, 2000);
        });
      }
    };

    checkPageLoad();
  }, []);

  useEffect(() => {
    const currentMessage = messages[currentMessageIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      // Typing - faster
      if (displayText.length < currentMessage.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentMessage.slice(0, displayText.length + 1));
        }, 50); // Faster typing
      } else {
        // Finished typing, wait then start deleting
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 1500);
      }
    } else {
      // Deleting - faster
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(currentMessage.slice(0, displayText.length - 1));
        }, 30); // Faster deleting
      } else {
        // Finished deleting, move to next message
        setIsDeleting(false);
        setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentMessageIndex]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
        >
          <div className="text-center">
            <motion.p
              key={currentMessageIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-lg text-white/80 font-light tracking-wide"
            >
              {displayText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="ml-1"
              >
                |
              </motion.span>
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
