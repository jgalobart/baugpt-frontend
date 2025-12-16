import { useState, useRef } from 'react';
import { Send, Image as ImageIcon, X } from 'lucide-react';

const MAX_IMAGES = 10000;

function MessageInput({ onSend, disabled }) {
  const [message, setMessage] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Check if adding new images would exceed the limit
    const totalImages = images.length + files.length;
    if (totalImages > MAX_IMAGES) {
      setError(`Màxim ${MAX_IMAGES} imatges permeses. Tens ${images.length} imatges i estàs intentant afegir ${files.length} més.`);
      setTimeout(() => setError(''), 5000);
      return;
    }

    setError('');
    // Add new images to existing ones
    setImages([...images, ...files]);

    // Create previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, { file, preview: reader.result }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((!message.trim() && images.length === 0) || disabled) return;

    onSend(message, images);
    setMessage('');
    setImages([]);
    setImagePreviews([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-gray-700 bg-chat-bg">
      <div className="max-w-3xl mx-auto p-4">
        {/* Error Message */}
        {error && (
          <div className="mb-3 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        {/* Image Previews */}
        {imagePreviews.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {imagePreviews.map((img, index) => (
              <div key={index} className="relative group">
                <img
                  src={img.preview}
                  alt={`Preview ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-lg border border-gray-600"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  type="button"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            multiple
            className="hidden"
          />
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={disabled || images.length >= MAX_IMAGES}
            title={images.length >= MAX_IMAGES ? `Màxim ${MAX_IMAGES} imatges` : 'Afegir imatges'}
          >
            <ImageIcon size={20} />
          </button>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escriu un missatge..."
            className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-40"
            rows={1}
            disabled={disabled}
            style={{
              minHeight: '48px',
              height: 'auto',
            }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
            }}
          />

          <button
            type="submit"
            disabled={(!message.trim() && images.length === 0) || disabled}
            className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors flex-shrink-0"
          >
            <Send size={20} />
          </button>
        </form>

        <div className="text-xs text-gray-500 mt-2 text-center">
          Prem Enter per enviar, Shift+Enter per nova línia • Màxim {MAX_IMAGES} imatges ({images.length}/{MAX_IMAGES})
        </div>
      </div>
    </div>
  );
}

export default MessageInput;
