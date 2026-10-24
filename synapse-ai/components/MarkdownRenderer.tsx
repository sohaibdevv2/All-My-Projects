import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const renderableContent = content.endsWith('▌') ? content.slice(0, -1) : content;
  const showCursor = content.endsWith('▌');

  const parts = renderableContent.split(/(```[\s\S]*?```)/g);

  const formattedContent = parts.map((part, index) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      const codeContent = part.substring(3, part.length - 3).trim();
      const languageMatch = codeContent.match(/^[a-zA-Z]+\n/);
      const language = languageMatch ? languageMatch[0].trim() : 'code';
      const code = languageMatch ? codeContent.substring(languageMatch[0].length) : codeContent;

      return (
        <div key={index} className="not-prose bg-gray-900 rounded-lg my-2 relative">
          <div className="text-xs text-gray-400 bg-black/20 px-3 py-1 rounded-t-lg flex justify-between items-center">
            <span>{language}</span>
          </div>
          <pre className="p-3 text-sm text-gray-200 overflow-x-auto">
            <code>{code}</code>
          </pre>
        </div>
      );
    } else {
      const htmlPart = part
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code class="bg-gray-700 text-red-400 rounded px-1.5 py-0.5 font-mono text-sm">$1</code>')
        .replace(/\n/g, '<br />');
      return <span key={index} dangerouslySetInnerHTML={{ __html: htmlPart }} />;
    }
  });

  return (
    <div className="prose prose-sm max-w-none">
        {formattedContent}
        {showCursor && <span className="inline-block animate-pulse">▌</span>}
    </div>
  );
};

export default MarkdownRenderer;