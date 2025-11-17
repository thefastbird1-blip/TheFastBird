
import React, { useState } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';

const Contact: React.FC = () => {
    const { t } = useLocalization();
    const navigate = useNavigate();
    const [status, setStatus] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);
        
        try {
            const response = await fetch("https://formspree.io/f/xzzypayb", {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                form.reset();
                setStatus('SUCCESS');
                setIsModalOpen(true);
            } else {
                setStatus('ERROR');
            }
        } catch (error) {
            setStatus('ERROR');
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        navigate('/');
    };

  return (
    <>
    <div className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-dark">{t('contact.title')}</h1>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">{t('contact.subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-primary mb-6">{t('contact.detailsTitle')}</h2>
                <div className="space-y-4 text-gray-700">
                    <p><strong>{t('contact.adminTitle')}:</strong> {t('contact.adminText')}</p>
                    <p><strong>{t('contact.mainCenterTitle')}:</strong> {t('contact.mainCenterText')}</p>
                    <p><strong>{t('contact.mainWarehouseTitle')}:</strong> {t('contact.mainWarehouseText')}</p>
                    <p><strong>{t('contact.emailTitle')}:</strong> <a href={`mailto:${t('contact.emailText')}`} className="text-primary hover:underline">{t('contact.emailText')}</a></p>
                    <p><strong>{t('contact.phoneTitle')}:</strong> <a href={`tel:${t('contact.phoneText')}`} className="text-primary hover:underline">{t('contact.phoneText')}</a></p>
                </div>
                <div className="mt-8 pt-6 border-t">
                    <h3 className="text-xl font-bold text-primary mb-4">{t('contact.hoursTitle')}</h3>
                    <p className="text-gray-700">{t('contact.hoursText')}</p>
                    <p className="text-gray-700 font-semibold mt-2">{t('contact.hoursNote')}</p>
                </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-primary mb-6">{t('contact.formTitle')}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 font-medium mb-2">{t('contact.formName')}</label>
                        <input type="text" id="name" name="name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-dark" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">{t('contact.formEmail')}</label>
                        <input type="email" id="email" name="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-dark" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">{t('contact.formPhone')}</label>
                        <input type="tel" id="phone" name="phone" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-dark" required />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="message" className="block text-gray-700 font-medium mb-2">{t('contact.formMessage')}</label>
                        <textarea id="message" name="message" rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-dark" required></textarea>
                    </div>
                    <button type="submit" className="w-full bg-accent text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors shadow-md">
                        {t('contact.formSubmit')}
                    </button>
                    {status === 'ERROR' && <p className="text-red-500 mt-4">{t('contact.formError')}</p>}
                </form>
            </div>
        </div>
        <div className="mt-12 text-center bg-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-primary">{t('contact.chatTitle')}</h3>
            <p className="mt-2 text-gray-600">{t('contact.chatText')}</p>
            <p className="mt-4 text-sm text-gray-500">{t('contact.note')}</p>
        </div>
      </div>
    </div>
    <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="text-center">
            <h2 className="text-2xl font-bold text-primary mb-4">{t('contact.modalTitle')}</h2>
            <p className="text-gray-600 mb-6">{t('contact.modalText')}</p>
            <button onClick={closeModal} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600">
                OK
            </button>
        </div>
    </Modal>
    </>
  );
};

export default Contact;
