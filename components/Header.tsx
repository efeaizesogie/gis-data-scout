import React from 'react';
import { Globe, Map, Layers } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-500 rounded-lg">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">GIS Data Scout</h1>
            <p className="text-xs text-slate-400">Intelligent Data Sourcing Assistant</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm font-medium text-slate-300">
           <div className="hidden md:flex items-center space-x-1">
             <Map className="w-4 h-4" />
             <span>Sources</span>
           </div>
           <div className="hidden md:flex items-center space-x-1">
             <Layers className="w-4 h-4" />
             <span>Analysis</span>
           </div>
        </div>
      </div>
    </header>
  );
};