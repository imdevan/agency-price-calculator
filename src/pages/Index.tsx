
import Calculator from '@/components/Calculator';
import { Link } from 'lucide-react';

const Index = () => {
  return (
    <>
      <a 
        href="https://devanhuapaya.com/" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="dev-link fixed top-4 left-4 flex items-center gap-1.5 text-sm font-medium z-50 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 border border-transparent hover:border-purple-300"
      >
        <Link size={14} className="text-purple-500" />
        <span>made by dev</span>
      </a>
      <Calculator />
    </>
  );
};

export default Index;
