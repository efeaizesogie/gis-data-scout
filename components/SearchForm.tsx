import React, { useState } from 'react';
import { Search, MapPin, Database, HelpCircle, BookOpen, Layers } from 'lucide-react';
import { DataType, PaperType, SearchParams, SearchMode } from '../types';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  isSearching: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isSearching }) => {
  const [mode, setMode] = useState<SearchMode>('DATA');
  const [dataType, setDataType] = useState<string>(DataType.VECTOR);
  const [paperType, setPaperType] = useState<string>(PaperType.ALL);
  const [location, setLocation] = useState('');
  const [question, setQuestion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question) {
      onSearch({ 
        mode, 
        dataType: mode === 'DATA' ? dataType : paperType, 
        location, 
        question 
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setMode('DATA')}
          className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center space-x-2 transition-colors
            ${mode === 'DATA' 
              ? 'bg-white text-emerald-600 border-b-2 border-emerald-500' 
              : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            }`}
        >
          <Database className="w-4 h-4" />
          <span>Find GIS Data</span>
        </button>
        <button
          onClick={() => setMode('RESEARCH')}
          className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center space-x-2 transition-colors
            ${mode === 'RESEARCH' 
              ? 'bg-white text-blue-600 border-b-2 border-blue-500' 
              : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Find Research Papers</span>
        </button>
      </div>

      <div className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Data Type / Paper Type Selection */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-bold text-slate-800">
                {mode === 'DATA' ? (
                  <>
                    <Layers className="w-4 h-4 mr-2 text-emerald-600" />
                    Data Format
                  </>
                ) : (
                  <>
                    <BookOpen className="w-4 h-4 mr-2 text-blue-600" />
                    Paper Type
                  </>
                )}
              </label>
              <select
                value={mode === 'DATA' ? dataType : paperType}
                onChange={(e) => mode === 'DATA' ? setDataType(e.target.value) : setPaperType(e.target.value)}
                className="w-full rounded-lg border-slate-400 bg-slate-50 border px-4 py-3 text-slate-900 focus:border-emerald-500 focus:ring-emerald-500 text-sm transition-shadow font-medium"
              >
                {mode === 'DATA' 
                  ? Object.values(DataType).map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))
                  : Object.values(PaperType).map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))
                }
              </select>
            </div>

            {/* Location Input */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-bold text-slate-800">
                <MapPin className={`w-4 h-4 mr-2 ${mode === 'DATA' ? 'text-emerald-600' : 'text-blue-600'}`} />
                Location of Interest {mode === 'RESEARCH' && <span className="text-slate-400 font-normal ml-1">(Optional)</span>}
              </label>
              <input
                type="text"
                required={mode === 'DATA'}
                placeholder={mode === 'DATA' ? "e.g. Nairobi, Kenya or Amazon Basin" : "e.g. Urban areas, Global, or Specific City"}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-lg border-slate-400 bg-slate-50 border px-4 py-3 text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500 text-sm transition-shadow font-medium"
              />
            </div>
          </div>

          {/* Specific Question/Need */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-bold text-slate-800">
              <HelpCircle className={`w-4 h-4 mr-2 ${mode === 'DATA' ? 'text-emerald-600' : 'text-blue-600'}`} />
              {mode === 'DATA' ? 'Specific Data Need / Question' : 'Research Topic / Question'}
            </label>
            <textarea
              required
              rows={3}
              placeholder={mode === 'DATA' 
                ? "e.g. I need recent flood extent polygons for hydrological analysis." 
                : "e.g. Using remote sensing to detect informal settlements."
              }
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full rounded-lg border-slate-400 bg-slate-50 border px-4 py-3 text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500 text-sm transition-shadow resize-none font-medium"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSearching}
              className={`w-full flex items-center justify-center rounded-lg px-8 py-3 text-base font-bold text-white shadow-md transition-all duration-200 
                ${isSearching 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : mode === 'DATA'
                    ? 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg active:bg-emerald-800'
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:bg-blue-800'
                }`}
            >
              {isSearching ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {mode === 'DATA' ? 'Scouting Data...' : 'Searching Papers...'}
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  {mode === 'DATA' ? 'Find Data Sources' : 'Find Research Papers'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};