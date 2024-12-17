import { useState } from 'react'
import CreateFarmModal from './CreateFarmModal'
import { Leaf } from "lucide-react";

const Header: React.FC = () => {
  const [isFarmModalOpen, setIsFarmModalOpen] = useState<boolean>(false);
  return (
    <header className="bg-indigo-950">
      <nav aria-label="Global" className="mx-auto flex container items-center justify-between p-6">
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <Leaf className="h-8 w-8 mr-3 text-orange-400" />
            <span className="text-white text-xl font-bold">Farm Flow</span>
          </a>
        </div>

        <button
          data-testid="button-new-farm"
          onClick={() => setIsFarmModalOpen(true)}
          className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-950 bg-orange-400 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          <Leaf className="mr-2 h-4 w-4" />
          New Farm
        </button>
      </nav>
      <CreateFarmModal
        isOpen={isFarmModalOpen}
        onClose={() => setIsFarmModalOpen(false)}
      />
    </header>
  )
}

export default Header