
import Calculator from '@/components/Calculator';
import { Link } from 'lucide-react';

const Index = () => {
  return (
    <>
      <a 
        href="https://devanhuapaya.com/" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="dev-link fixed top-4 left-4 flex items-center gap-1.5 text-sm font-medium z-50 outline-link-bottom"
      >
        <Link size={14} />
        <span>made by dev</span>
      </a>
      <Calculator />
    </>
  );
};

export default Index;
