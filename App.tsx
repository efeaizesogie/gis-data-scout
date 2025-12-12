import React, { useState } from 'react';
import { Header } from './components/Header';
import { SearchForm } from './components/SearchForm';
import { ResultView } from './components/ResultView';
import { searchDataSources } from './services/geminiService';
import { SearchParams, SearchResult } from './types';
import { Compass } from 'lucide-react';

export default function App() {
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (params: SearchParams) => {
    setIsSearching(true);
    setError(null);
    setResult(null);

    try {
      const data = await searchDataSources(params);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Search & Intro */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
               {/* Decorative background element */}
               <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-emerald-500 rounded-full opacity-20 blur-2xl"></div>
               
               <h2 className="text-2xl font-bold mb-2">Find Data Faster</h2>
               <p className="text-slate-300 mb-6 leading-relaxed">
                 Stop spending hours browsing broken portals. Describe what you need, and let AI scout the most accurate GIS data for your analysis.
               </p>
               <div className="flex items-center text-sm text-emerald-400 font-medium">
                 <Compass className="w-4 h-4 mr-2" />
                 <span>Powered by Gemini 2.5 & Google Search</span>
               </div>
            </div>

            <SearchForm onSearch={handleSearch} isSearching={isSearching} />
            
            {!result && !isSearching && (
              <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                 <h3 className="font-semibold text-slate-900 mb-3">Popular Searches</h3>
                 <ul className="space-y-3">
                   {['Lidar data for San Francisco', 'Population density Tokyo 2023', 'Soil type shapefile Brazil', 'Historical Imagery London'].map((item, i) => (
                     <li key={i} className="flex items-center text-sm text-slate-600 cursor-pointer hover:text-emerald-600 transition-colors">
                       <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mr-2"></span>
                       {item}
                     </li>
                   ))}
                 </ul>
              </div>
            )}
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-8">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 flex items-start mb-6">
                <span className="font-bold mr-2">Error:</span> {error}
              </div>
            )}

            {result ? (
              <ResultView result={result} />
            ) : (
              !isSearching && (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                   <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                     <Compass className="w-12 h-12 text-slate-300" />
                   </div>
                   <h3 className="text-lg font-medium text-slate-600">Ready to Scout</h3>
                   <p className="max-w-md mt-2">Enter your data requirements on the left to generate a curated list of sources.</p>
                </div>
              )
            )}
            
            {isSearching && (
               <div className="space-y-6 animate-pulse">
                 <div className="h-64 bg-slate-200 rounded-xl w-full"></div>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="h-20 bg-slate-200 rounded-lg"></div>
                   <div className="h-20 bg-slate-200 rounded-lg"></div>
                 </div>
               </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-8">
         <div className="max-w-7xl mx-auto px-4 text-center text-sm">
           <p>&copy; {new Date().getFullYear()} GIS Data Scout. Optimized for Geospatial Professionals.</p>
         </div>
      </footer>
    </div>
  );
}