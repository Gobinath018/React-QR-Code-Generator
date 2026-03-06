import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';
import { FiDownload, FiCopy, FiCheck, FiLink } from 'react-icons/fi';
import { BiPalette, BiExpand } from 'react-icons/bi';
import confetti from 'canvas-confetti';
import { useSoundEffect } from '../hooks/useSoundEffect';

const QRGenerator = () => {
  const [inputValue, setInputValue] = useState('');
  const [qrValue, setQrValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [settings, setSettings] = useState({
    fgColor: '#000000',
    bgColor: '#FFFFFF',
    size: 256,
  });
  const [showToast, setShowToast] = useState(false);

  const playClick = useSoundEffect('/sounds/click.mp3');
  const playSuccess = useSoundEffect('/sounds/success.mp3');

  const generateQR = () => {
    if (!inputValue.trim()) return;
    
    playClick();
    setIsGenerating(true);
    
    setTimeout(() => {
      setQrValue(inputValue);
      setIsGenerating(false);
      playSuccess();
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 1500);
  };

  const downloadQR = (format) => {
    playClick();
    const svg = document.getElementById('qr-code');
    if (!svg) return;

    if (format === 'svg') {
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'qrcode.svg';
      link.click();
    } else {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = settings.size;
        canvas.height = settings.size;
        ctx.fillStyle = settings.bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = 'qrcode.png';
        link.click();
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(new XMLSerializer().serializeToString(svg));
    }
  };

  const copyToClipboard = async () => {
    if (!qrValue) return;
    
    try {
      await navigator.clipboard.writeText(qrValue);
      setCopied(true);
      setShowToast(true);
      setTimeout(() => {
        setCopied(false);
        setShowToast(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <section id="generator" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Create Your <span className="text-gradient">QR Code</span>
          </h2>
          <p className="text-gray-300 text-lg">
            Enter any text, URL, email, or phone number below
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="glassmorphism rounded-2xl p-6"
          >
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Enter Text / URL / Email / Phone
              </label>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition-colors text-white placeholder-gray-500"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={generateQR}
              disabled={!inputValue.trim()}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <span className="relative z-10">Generate QR Code</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"
                initial={{ x: '100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>

            {/* Customization Options */}
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <BiPalette className="text-purple-400" />
                Customize
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">QR Color</label>
                  <input
                    type="color"
                    value={settings.fgColor}
                    onChange={(e) => setSettings({ ...settings, fgColor: e.target.value })}
                    className="w-full h-10 rounded cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Background</label>
                  <input
                    type="color"
                    value={settings.bgColor}
                    onChange={(e) => setSettings({ ...settings, bgColor: e.target.value })}
                    className="w-full h-10 rounded cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-2 flex items-center gap-2">
                  <BiExpand />
                  Size: {settings.size}px
                </label>
                <input
                  type="range"
                  min="128"
                  max="512"
                  step="16"
                  value={settings.size}
                  onChange={(e) => setSettings({ ...settings, size: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>
          </motion.div>

          {/* QR Code Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="glassmorphism rounded-2xl p-6 flex flex-col items-center"
          >
            <div className="relative mb-6">
              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="w-[256px] h-[256px] flex items-center justify-center"
                  >
                    <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  </motion.div>
                ) : qrValue ? (
                  <motion.div
                    key="qr"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                    <div className="relative bg-white p-4 rounded-lg">
                      <QRCode
                        id="qr-code"
                        value={qrValue}
                        size={settings.size}
                        fgColor={settings.fgColor}
                        bgColor={settings.bgColor}
                        level="H"
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-[256px] h-[256px] bg-white/5 rounded-lg flex items-center justify-center border-2 border-dashed border-white/20"
                  >
                    <FiLink size={48} className="text-gray-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {qrValue && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => downloadQR('png')}
                  className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  title="Download PNG"
                >
                  <FiDownload size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => downloadQR('svg')}
                  className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  title="Download SVG"
                >
                  <FiDownload size={20} className="rotate-180" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={copyToClipboard}
                  className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors relative"
                  title="Copy Link"
                >
                  {copied ? <FiCheck size={20} className="text-green-400" /> : <FiCopy size={20} />}
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Toast Notification */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
            >
              <div className="flex items-center gap-2">
                <FiCheck />
                <span>Copied to clipboard!</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default QRGenerator;