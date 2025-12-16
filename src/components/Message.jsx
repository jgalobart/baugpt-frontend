import { User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

function Message({ message }) {
  const isUser = message.role === 'user';
  
  // Extract text from content
  const getText = () => {
    if (typeof message.content === 'string') {
      return message.content;
    }
    if (Array.isArray(message.content)) {
      const textContent = message.content.find(c => c.type === 'text');
      return textContent?.text || '';
    }
    return '';
  };

  // Extract images from content
  const getImages = () => {
    if (message.images && message.images.length > 0) {
      return message.images;
    }
    return [];
  };

  const text = getText();
  const images = getImages();

  return (
    <div className={`py-6 ${isUser ? 'bg-user-msg' : 'bg-assistant-msg'}`}>
      <div className="max-w-3xl mx-auto flex gap-4">
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-sm flex items-center justify-center ${
          isUser ? 'bg-blue-600' : 'bg-green-600'
        }`}>
          {isUser ? <User size={20} /> : <Bot size={20} />}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Images */}
          {images.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={`data:${img.mimeType};base64,${img.data}`}
                  alt={`Uploaded ${idx + 1}`}
                  className="max-w-xs max-h-64 rounded-lg object-contain border border-gray-600"
                />
              ))}
            </div>
          )}

          {/* Text with Markdown */}
          {text && (
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                  p: ({ children }) => <p className="mb-2">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                  h1: ({ children }) => <h1 className="text-2xl font-bold mb-2">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl font-bold mb-2">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-lg font-bold mb-2">{children}</h3>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-gray-500 pl-4 italic my-2">
                      {children}
                    </blockquote>
                  ),
                  a: ({ children, href }) => (
                    <a href={href} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                      {children}
                    </a>
                  ),
                }}
              >
                {text}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Message;
