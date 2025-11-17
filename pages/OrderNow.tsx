import React, { useState, useEffect } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { useNavigate, useLocation } from 'react-router-dom';
import Modal from '../components/Modal';
import { content } from '../constants/content';
import { CalculatorContent, Content, StatusUpdate, Lang, Order } from '../types';

const mockStatuses = (t: (key: string) => string, lang: Lang) => {
    const statuses = [
        t('trackOrder.statusPlaced'),
        t('trackOrder.statusWarehouse'),
        t('trackOrder.statusTransit'),
        t('trackOrder.statusDelivery'),
        t('trackOrder.statusDelivered')
    ];
    const locations = ['Cairo', 'Giza', 'Alexandria', 'Tanta'];
    
    const randomProgress = Math.floor(Math.random() * statuses.length) + 1;
    const today = new Date();

    return Array.from({ length: randomProgress }, (_, i) => {
        const eventDate = new Date(today);
        eventDate.setDate(today.getDate() - (randomProgress - 1 - i));
        
        return {
            status: statuses[i],
            date: eventDate.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
            location: locations[Math.floor(Math.random() * locations.length)],
            isCompleted: true,
        };
    }).reverse();
};


const ShippingCalculator: React.FC = () => {
    const { t, lang } = useLocalization();
    const [from, setFrom] = useState('');
    const [weight, setWeight] = useState('');
    const [destination, setDestination] = useState('');
    const [serviceType, setServiceType] = useState('standard');
    const [estimatedCost, setEstimatedCost] = useState<number | null>(null);
    const [calcError, setCalcError] = useState('');

    // Fix: Correctly type the calculator content to access its properties safely.
    const calculatorContent = (content.orderNow as Content).calculator as CalculatorContent;
    const destinations = calculatorContent.destinations;
    const serviceTypes = calculatorContent.serviceTypes;

    const handleCalculate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!weight || !destination || !serviceType || !from) {
            setCalcError(t('orderNow.calculator.error'));
            setEstimatedCost(null);
            return;
        }

        const DESTINATION_BASE_FEES: { [key:string]: number } = {
            cairo: 70,
            giza: 70,
            alexandria: 90,
            tanta: 90,
            mansoura: 90,
        };

        const ADDITIONAL_KG_FEE = 6;

        const SERVICE_FEES: { [key: string]: number } = {
            standard: 0,
            express: 25,
        };

        const weightNum = parseFloat(weight);
        const baseFee = DESTINATION_BASE_FEES[destination] || 0;

        const additionalWeight = Math.max(0, Math.ceil(weightNum) - 1);
        const additionalWeightCost = additionalWeight * ADDITIONAL_KG_FEE;
        
        const serviceFee = SERVICE_FEES[serviceType] || 0;
        
        const totalCost = baseFee + additionalWeightCost + serviceFee;

        setEstimatedCost(totalCost);
        setCalcError('');
    };

    return (
        <div id="shipping-calculator" className="bg-white p-8 rounded-lg shadow-xl mb-10 scroll-mt-20">
            <h2 className="text-2xl font-bold text-primary border-b pb-4 mb-6">{t('orderNow.calculator.title')}</h2>
            <form onSubmit={handleCalculate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="calc-from" className="block text-gray-700 font-medium mb-2">{t('orderNow.calculator.fromLabel')}</label>
                        <select
                            id="calc-from"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-dark"
                        >
                            <option value="" disabled>{t('orderNow.selectType')}</option>
                            {destinations.map(dest => (
                                <option key={dest.value} value={dest.value}>
                                    {dest.name[lang]}
                                </option>
                            ))}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="calc-destination" className="block text-gray-700 font-medium mb-2">{t('orderNow.calculator.destinationLabel')}</label>
                        <select
                            id="calc-destination"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-dark"
                        >
                            <option value="" disabled>{t('orderNow.selectType')}</option>
                            {destinations.map(dest => (
                                <option key={dest.value} value={dest.value}>
                                    {dest.name[lang]}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="calc-weight" className="block text-gray-700 font-medium mb-2">{t('orderNow.calculator.weightLabel')}</label>
                        <input
                            type="number"
                            id="calc-weight"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder="e.g., 5"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-dark"
                        />
                    </div>
                     <div>
                        <label className="block text-gray-700 font-medium mb-2">{t('orderNow.calculator.serviceTypeLabel')}</label>
                        <div className="flex items-center space-x-4 rtl:space-x-reverse mt-2">
                             {serviceTypes.map(type => (
                                <label key={type.value} className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer">
                                    <input
                                        type="radio"
                                        name="serviceType"
                                        value={type.value}
                                        checked={serviceType === type.value}
                                        onChange={(e) => setServiceType(e.target.value)}
                                        className="form-radio h-4 w-4 text-primary focus:ring-primary"
                                    />
                                    <span>{type.name[lang]}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="text-center pt-4">
                    <button type="submit" className="bg-primary text-white font-bold py-2 px-8 rounded-lg hover:bg-blue-600 transition-colors shadow-md">
                        {t('orderNow.calculator.calculateButton')}
                    </button>
                </div>
            </form>
             {calcError && <p className="text-red-500 mt-4 text-center">{calcError}</p>}
            {estimatedCost !== null && (
                <div className="mt-6 text-center bg-gray-50 p-6 rounded-lg border">
                    <h3 className="text-lg text-gray-600 font-medium">{t('orderNow.calculator.resultTitle')}</h3>
                    <p className="text-4xl font-bold text-accent mt-2">
                        {estimatedCost.toFixed(2)} <span className="text-2xl">{t('orderNow.calculator.currency')}</span>
                    </p>
                </div>
            )}
        </div>
    );
};


const OrderNow: React.FC = () => {
    const { t, lang } = useLocalization();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [trackingCode, setTrackingCode] = useState('');
    const [copySuccess, setCopySuccess] = useState('');
    const [orderType, setOrderType] = useState('');
    
    const orderTypes = ['wood', 'glass', 'clothes', 'tablets', 'electrical', 'other'];

    useEffect(() => {
        if (location.hash) {
            const id = location.hash.substring(1);
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    }, [location.hash]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(trackingCode).then(() => {
            setCopySuccess(t('orderNow.modalCopied'));
            setTimeout(() => setCopySuccess(''), 2000);
        }, () => {
            setCopySuccess(t('orderNow.modalCopyError'));
        });
    };
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const form = e.currentTarget;
        const formData = new FormData(form);

        const code = 'TKT' + Math.floor(100000 + Math.random() * 900000);
        setTrackingCode(code);
        formData.set('tracking_code', code);
        
        // Save order to localStorage for tracking simulation
        const statusUpdates = mockStatuses(t, lang);
        const newOrder: Order = {
            trackingCode: code,
            statusUpdates: statusUpdates,
            firstTrack: false,
            adminMessage: '',
        };
        const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        localStorage.setItem('orders', JSON.stringify([...existingOrders, newOrder]));
        
        try {
            const response = await fetch("https://formspree.io/f/mldarwpq", {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                form.reset();
                setOrderType('');
                setIsModalOpen(true);
            } else {
                alert(t('orderNow.submitError'));
            }
        } catch (error) {
            alert(t('orderNow.submitError'));
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const closeModal = () => {
        setIsModalOpen(false);
        navigate('/');
    };

    return (
        <>
            <div className="py-12 md:py-20 bg-gray-50">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-bold text-dark">{t('orderNow.title')}</h1>
                        <p className="mt-4 text-lg text-gray-600">{t('orderNow.subtitle')}</p>
                    </div>

                    <ShippingCalculator />

                    <form id="order-form" onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-xl space-y-6 scroll-mt-20">
                        <h2 className="text-2xl font-bold text-primary border-b pb-4">{t('orderNow.senderInfo')}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="senderName" className="block text-gray-700 font-medium mb-2">{t('orderNow.name')}</label>
                                <input type="text" id="senderName" name="sender_name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-dark" required />
                            </div>
                            <div>
                                <label htmlFor="senderPhone" className="block text-gray-700 font-medium mb-2">{t('orderNow.phone')}</label>
                                <input type="tel" id="senderPhone" name="sender_phone" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-dark" required />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="senderAddress" className="block text-gray-700 font-medium mb-2">{t('orderNow.address')}</label>
                            <input type="text" id="senderAddress" name="sender_address" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-dark" required />
                        </div>

                        <h2 className="text-2xl font-bold text-primary border-b pb-4 pt-4">{t('orderNow.orderInfo')}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <label htmlFor="orderType" className="block text-gray-700 font-medium mb-2">{t('orderNow.orderType')}</label>
                                <select id="orderType" name="order_type" value={orderType} onChange={e => setOrderType(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-dark" required>
                                    <option value="" disabled>{t('orderNow.selectType')}</option>
                                    {orderTypes.map(type => (
                                        <option key={type} value={type}>{t(`orderNow.types.${type}`)}</option>
                                    ))}
                                </select>
                            </div>
                            {orderType === 'other' && (
                                 <div>
                                    <label htmlFor="otherType" className="block text-gray-700 font-medium mb-2">{t('orderNow.otherType')}</label>
                                    <input type="text" id="otherType" name="other_order_type" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-dark" required />
                                </div>
                            )}
                             <div>
                                <label htmlFor="orderWeight" className="block text-gray-700 font-medium mb-2">{t('orderNow.weight')}</label>
                                <input type="text" id="orderWeight" name="order_weight" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-dark" required />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-primary border-b pb-4 pt-4">{t('orderNow.recipientInfo')}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="recipientName" className="block text-gray-700 font-medium mb-2">{t('orderNow.recipientName')}</label>
                                <input type="text" id="recipientName" name="recipient_name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-dark" required />
                            </div>
                            <div>
                                <label htmlFor="recipientPhone" className="block text-gray-700 font-medium mb-2">{t('orderNow.recipientPhone')}</label>
                                <input type="tel" id="recipientPhone" name="recipient_phone" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-dark" required />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="recipientAddress" className="block text-gray-700 font-medium mb-2">{t('orderNow.recipientAddress')}</label>
                            <input type="text" id="recipientAddress" name="recipient_address" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-dark" required />
                        </div>
                        
                        <input type="hidden" name="tracking_code" />

                        <div className="pt-6 text-center">
                            <button type="submit" disabled={isSubmitting} className="w-full md:w-auto bg-accent text-white font-bold py-3 px-12 rounded-lg hover:bg-orange-600 transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed">
                                {isSubmitting ? t('orderNow.submitting') : t('orderNow.submit')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <div className="text-center p-4">
                    <h2 className="text-2xl font-bold text-primary mb-4">{t('orderNow.modalTitle')}</h2>
                    <p className="text-gray-600 mb-2">{t('orderNow.modalText')}</p>
                    <div className="my-6 p-4 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg">
                        <p className="text-2xl font-bold tracking-widest text-dark">{trackingCode}</p>
                    </div>
                    <p className="text-sm text-gray-500 mb-6">{t('orderNow.modalKeepCode')}</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={copyToClipboard} className="px-6 py-2 bg-gray-200 text-dark rounded-lg hover:bg-gray-300 transition-colors relative">
                            {t('orderNow.modalCopy')}
                            {copySuccess && <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dark text-white text-xs px-2 py-1 rounded">{copySuccess}</span>}
                        </button>
                        <button onClick={closeModal} className="px-8 py-2 bg-primary text-white rounded-lg hover:bg-blue-600">
                            OK
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default OrderNow;