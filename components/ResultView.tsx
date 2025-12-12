import React from 'react';
import { ExternalLink, ShieldCheck, FileText, AlertCircle, Globe } from 'lucide-react';
import { SearchResult } from '../types';

interface ResultViewProps {
  result: SearchResult;
}

export const ResultView: React.FC<ResultViewProps> = ({ result }) => {
  
  // Helper to process bold text (**text**)
  const processBold = (text: string): React.ReactNode[] => {
    return text.split(/\*\*(.*?)\*\*/g).map((part, i) => 
      i % 2 === 1 ? <strong key={i} className="font-bold text-slate-900">{part}</strong> : part
    );
  };

  // Helper to process Links ([text](url) OR raw https://...)
  const formatContent = (text: string): React.ReactNode[] => {
    // Regex matches:
    // Group 1 (Markdown Link): [Title](url) -> captures [2]:Title, [3]:Url
    // Group 4 (Raw URL): https://...
    const regex = /(\[([^\]]+)\]\(([^)]+)\))|(https?:\/\/[^\s,)]+)/g;
    
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Push text before the match (processed for bold)
      if (match.index > lastIndex) {
        elements.push(...processBold(text.substring(lastIndex, match.index)));
      }

      if (match[1]) { 
        // Case: Markdown Link [Title](url)
        // Render as a styled "chip"
        elements.push(
          <a
            key={match.index}
            href={match[3]}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-baseline gap-1 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md text-sm font-semibold transition-colors border border-emerald-200 mx-1 align-middle no-underline"
            title={match[3]}
          >
            {match[2]}
            <ExternalLink className="w-3 h-3 self-center" />
          </a>
        );
      } else if (match[4]) { 
        // Case: Raw URL
        // Render as a clean text link, truncated if long
        const url = match[4];
        const displayUrl = url.length > 35 ? url.substring(0, 32) + '...' : url;
        elements.push(
          <a
            key={match.index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-medium hover:underline decoration-blue-200 underline-offset-2 break-all mx-1"
          >
            {displayUrl}
          </a>
        );
      }
      lastIndex = regex.lastIndex;
    }

    // Push remaining text
    if (lastIndex < text.length) {
      elements.push(...processBold(text.substring(lastIndex)));
    }

    return elements;
  };

  // Main render loop for paragraphs and lists
  const renderText = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (!line.trim()) return <div key={index} className="h-4" />; // Spacer
      
      // Handle Lists
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        return (
          <li key={index} className="ml-4 list-disc text-slate-700 leading-relaxed mb-2 pl-2 marker:text-emerald-400">
            {formatContent(line.trim().substring(2))}
          </li>
        );
      }
      
      // Handle Headers
      if (line.trim().startsWith('###')) {
          return <h4 key={index} className="text-lg font-bold text-slate-800 mt-6 mb-3">{line.replace(/^#+\s*/, '')}</h4>;
      }

      if (line.trim().startsWith('##')) {
          return <h3 key={index} className="text-xl font-bold text-slate-900 mt-8 mb-4 border-b border-slate-100 pb-2">{line.replace(/^#+\s*/, '')}</h3>;
      }

      // Standard Paragraph
      return (
        <p key={index} className="text-slate-700 leading-relaxed mb-4">
          {formatContent(line)}
        </p>
      );
    });
  };

  // Helper to extract domain for "brief info"
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return 'Web Resource';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* AI Analysis Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center">
          <FileText className="w-5 h-5 text-emerald-600 mr-2" />
          <h2 className="font-semibold text-slate-900">Analysis & Findings</h2>
        </div>
        <div className="p-6 md:p-8">
          <div className="prose prose-slate max-w-none text-base">
            {renderText(result.markdown)}
          </div>
        </div>
      </div>

      {/* Verified Sources Links */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
          <ShieldCheck className="w-5 h-5 text-emerald-600 mr-2" />
          Verified Links & Resources
        </h3>
        
        {result.sources.length === 0 ? (
           <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start">
             <AlertCircle className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
             <p className="text-sm text-amber-800">
               No direct verified links were returned by the search tool. Please refer to the names mentioned in the analysis above and search manually if needed.
             </p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.sources.map((source, idx) => (
              <a
                key={idx}
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between bg-white rounded-lg border border-slate-200 p-5 hover:border-emerald-500 hover:shadow-md transition-all duration-200 h-full"
              >
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
                      <Globe className="w-3 h-3 mr-1" />
                      {getDomain(source.uri)}
                    </span>
                  </div>
                  <h4 className="font-bold text-lg text-emerald-700 group-hover:text-emerald-800 mb-2 leading-snug">
                    {source.title}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono break-all line-clamp-2 mb-4">
                    {source.uri}
                  </p>
                </div>
                
                <div className="flex items-center text-sm font-semibold text-slate-600 group-hover:text-emerald-600 transition-colors pt-4 border-t border-slate-100 mt-auto">
                  Access Resource <ExternalLink className="w-4 h-4 ml-1.5" />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};