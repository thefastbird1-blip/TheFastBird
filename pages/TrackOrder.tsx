import React, { useState, useEffect } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { FaSearch, FaSpinner, FaTimesCircle } from 'react-icons/fa';
import { StatusUpdate, Order } from '../types';
import Modal from '../components/Modal';

const TrackOrder: React.FC = () => {
    const { t } = useLocalization();
    const [trackingCode, setTrackingCode] = useState('');
    const [shipmentStatus, setShipmentStatus] = useState<StatusUpdate[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
    const [adminInput, setAdminInput] = useState('');
    const [saveSuccess, setSaveSuccess] = useState('');

    useEffect(() => {
        if (currentOrder) {
            setAdminInput(currentOrder.adminMessage || '');
            setSaveSuccess('');
        }
    }, [currentOrder]);

    const handleSaveAdminMessage = () => {
        if (!currentOrder || !adminInput.trim()) return;

        try {
            const allOrders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
            const orderIndex = allOrders.findIndex(order => order.trackingCode === currentOrder.trackingCode);

            if (orderIndex !== -1) {
                const updatedOrder = { ...allOrders[orderIndex], adminMessage: adminInput };
                allOrders[orderIndex] = updatedOrder;
                localStorage.setItem('orders', JSON.stringify(allOrders));
                setCurrentOrder(updatedOrder);
                setSaveSuccess(t('trackOrder.adminSaveSuccess'));
                setTimeout(() => setSaveSuccess(''), 3000);
            }
        } catch (e) {
            console.error("Failed to save admin message:", e);
        }
    };

    const handleTrackOrder = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setShipmentStatus(null);
        setCurrentOrder(null);
        setIsLoading(true);

        const trimmedCode = trackingCode.trim();
        const codeRegex = /^TKT\d{6}$/;
        if (!codeRegex.test(trimmedCode)) {
            setError(t('trackOrder.errorInvalid'));
            setIsLoading(false);
            return;
        }

        setTimeout(() => {
            try {
                const allOrders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
                const foundOrder = allOrders.find(order => order.trackingCode === trimmedCode);

                if (foundOrder) {
                    if (!foundOrder.firstTrack) {
                        // First time tracking
                        setModalMessage(t('trackOrder.firstTrackMessage'));
                        setIsModalOpen(true);
                        
                        // Update the order in localStorage
                        const orderIndex = allOrders.findIndex(order => order.trackingCode === trimmedCode);
                        if (orderIndex !== -1) {
                            allOrders[orderIndex].firstTrack = true;
                            localStorage.setItem('orders', JSON.stringify(allOrders));
                        }
                    } else if (foundOrder.adminMessage) {
                        // Subsequent track with an admin message
                        setModalMessage(foundOrder.adminMessage);
                        setIsModalOpen(true);
                    } else {
                        // Subsequent track without admin message -> show timeline and controls
                        setShipmentStatus(foundOrder.statusUpdates);
                        setCurrentOrder(foundOrder);
                    }
                } else {
                    setError(t('trackOrder.errorNotFound'));
                }
            } catch (e) {
                console.error("Error reading from localStorage:", e);
                setError(t('trackOrder.errorNotFound'));
            } finally {
                setIsLoading(false);
            }
        }, 1000);
    };
    
    const closeModal = () => {
        setIsModalOpen(false);
        setModalMessage('');
    };

    return (
        <>
        <div className="py-12 md:py-20 bg-gray-50">
            <div className="container mx-auto px-6 max-w-3xl">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-dark">{t('trackOrder.title')}</h1>
                    <p className="mt-4 text-lg text-gray-600">{t('trackOrder.subtitle')}</p>
                </div>
                <div className="bg-white p-8 rounded-lg shadow-xl">
                    <form onSubmit={handleTrackOrder}>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <input
                                type="text"
                                value={trackingCode}
                                onChange={(e) => setTrackingCode(e.target.value)}
                                placeholder={t('trackOrder.placeholder')}
                                className="flex-grow w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-dark text-lg tracking-wider"
                                disabled={isLoading}
                                aria-label={t('trackOrder.title')}
                            />
                            <button
                                type="submit"
                                className="w-full sm:w-auto flex items-center justify-center bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-600 transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                                disabled={!trackingCode || isLoading}
                            >
                                {isLoading ? (
                                    <FaSpinner className="animate-spin h-5 w-5" />
                                ) : (
                                    <>
                                        <FaSearch className="h-5 w-5 mr-2 rtl:mr-0 rtl:ml-2" />
                                        <span>{t('trackOrder.button')}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {isLoading && (
                        <div className="text-center mt-8 text-gray-600">
                            <p>{t('trackOrder.loading')}</p>
                        </div>
                    )}
                    
                    {error && (
                        <div className="mt-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center justify-center gap-3">
                           <FaTimesCircle />
                           <span>{error}</span>
                        </div>
                    )}
                </div>

                {shipmentStatus && currentOrder && (
                    <div className="mt-10 bg-white p-8 rounded-lg shadow-xl">
                        <h2 className="text-2xl font-bold text-primary mb-6 border-b pb-4">{t('trackOrder.statusTitle')}: <span className="text-dark font-mono">{currentOrder.trackingCode}</span></h2>
                        <div className="relative pl-4 border-l-2 border-primary rtl:pl-0 rtl:pr-4 rtl:border-l-0 rtl:border-r-2">
                            {shipmentStatus.map((update, index) => (
                                <div key={index} className="mb-8 relative">
                                    <div className={`absolute -left-[23px] rtl:-left-auto rtl:-right-[23px] top-1.5 w-4 h-4 rounded-full ${update.isCompleted ? 'bg-primary' : 'bg-gray-300'} border-4 border-white`}></div>
                                    <p className={`font-bold text-lg ${update.isCompleted ? 'text-dark' : 'text-gray-500'}`}>{update.status}</p>
                                    <p className="text-sm text-gray-500">{update.date}</p>
                                    <p className="text-sm text-gray-500">{update.location}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {currentOrder && !currentOrder.adminMessage && (
                     <div className="mt-10 bg-blue-50 border border-blue-200 p-8 rounded-lg shadow-xl">
                         <h3 className="text-xl font-bold text-primary mb-2">{t('trackOrder.adminControlsTitle')}</h3>
                         <p className="text-gray-600 mb-4 text-sm">{t('trackOrder.adminControlsDesc')}</p>
                         <div className="space-y-3">
                             <label htmlFor="adminMessage" className="block text-gray-700 font-medium">{t('trackOrder.adminMessageLabel')}</label>
                             <textarea
                                 id="adminMessage"
                                 value={adminInput}
                                 onChange={(e) => setAdminInput(e.target.value)}
                                 placeholder={t('trackOrder.adminMessagePlaceholder')}
                                 rows={3}
                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-dark"
                             />
                             <button
                                 onClick={handleSaveAdminMessage}
                                 className="bg-accent text-white font-bold py-2 px-6 rounded-lg hover:bg-orange-600 transition-colors shadow-md"
                             >
                                 {t('trackOrder.adminSaveButton')}
                             </button>
                             {saveSuccess && <p className="text-green-600 text-sm mt-2">{saveSuccess}</p>}
                         </div>
                     </div>
                )}

            </div>
        </div>
        
        <Modal isOpen={isModalOpen} onClose={closeModal}>
            <div className="text-center p-4">
                 <h2 className="text-2xl font-bold text-primary mb-4">{t('trackOrder.statusTitle')}</h2>
                 <p className="text-gray-700 text-lg">{modalMessage}</p>
                 <button onClick={closeModal} className="mt-6 px-8 py-2 bg-primary text-white rounded-lg hover:bg-blue-600">
                    OK
                 </button>
            </div>
        </Modal>

        {/* Dummy react-icons components to satisfy TS */}
        <div style={{ display: 'none' }}>
            <FaSearch />
            <FaSpinner />
            <FaTimesCircle />
        </div>
        </>
    );
};

export default TrackOrder;