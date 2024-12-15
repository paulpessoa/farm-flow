import { ReactNode } from 'react';

interface GenericModalProps {
    isOpen?: boolean;
    onClose?: () => void;
    children: ReactNode;
    title?: string;
    className?: string;
}

const GenericModal: React.FC<GenericModalProps> = ({
    isOpen = false,
    onClose = () => { },
    children,
    title = "Modal",
    className = ""
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/30"
                aria-hidden="true"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className={`relative w-full max-w-prose bg-white rounded-xl shadow-lg p-2 flex flex-col max-h-[90vh] ${className}`}
            >
                {/* Header */}
                <div className="flex justify-between items-center pb-3 px-6 pt-4 sticky top-0 bg-white z-10">
                    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div
                    className="overflow-y-auto flex-grow px-6 pb-6 
                        [&::-webkit-scrollbar]:w-2
                        [&::-webkit-scrollbar-track]:bg-gray-100
                        [&::-webkit-scrollbar-thumb]:bg-gray-300
                        [&::-webkit-scrollbar-thumb]:rounded-full
                        [&::-webkit-scrollbar-track]:rounded-full
                        hover:[&::-webkit-scrollbar-thumb]:bg-gray-400"
                >
                    {children}
                </div>
            </div>
        </div>
    );
};

export default GenericModal
