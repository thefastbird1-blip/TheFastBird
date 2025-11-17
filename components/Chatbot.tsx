
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GoogleGenAI, Modality } from '@google/genai';
import { useLocalization } from '../hooks/useLocalization';
import { content } from '../constants/content';

// Audio decoding helpers (as per Gemini docs)
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length;
  const buffer = ctx.createBuffer(1, frameCount, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
}


type Message = {
  sender: 'user' | 'bot';
  text: string;
};

const availableVoices = [
    { name: 'Kore', gender: 'Female' },
    { name: 'Zephyr', gender: 'Female' },
    { name: 'Puck', gender: 'Male' },
    { name: 'Charon', gender: 'Male' },
    { name: 'Fenrir', gender: 'Male' },
];

const Chatbot: React.FC = () => {
    const { t, lang } = useLocalization();
    const [isOpen, setIsOpen] = useState(false);
    
    // Load state from sessionStorage or use initial values
    const [messages, setMessages] = useState<Message[]>(() => {
        const savedMessages = sessionStorage.getItem('chatMessages');
        return savedMessages ? JSON.parse(savedMessages) : [];
    });
    const [userInput, setUserInput] = useState('');
    const [userName, setUserName] = useState<string>(() => sessionStorage.getItem('chatUserName') || '');
    const [isNameSet, setIsNameSet] = useState<boolean>(() => sessionStorage.getItem('isChatNameSet') === 'true');

    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [ttsVoice, setTtsVoice] = useState('Kore');
    // NOTE: Speech rate is for UI demonstration; Gemini API doesn't support it directly yet.
    const [speechRate, setSpeechRate] = useState(1);


    const fullSiteContent = JSON.stringify(content);
    
    // Save state to sessionStorage whenever it changes
    useEffect(() => {
        sessionStorage.setItem('chatMessages', JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
        sessionStorage.setItem('chatUserName', userName);
    }, [userName]);

    useEffect(() => {
        sessionStorage.setItem('isChatNameSet', String(isNameSet));
    }, [isNameSet]);
    
    // Initialize chat with welcome message if it's a new session
    useEffect(() => {
        if (isOpen && messages.length === 0 && !isNameSet) {
            setMessages([
                { sender: 'bot', text: t('chatbot.welcome') },
                { sender: 'bot', text: t('chatbot.askName') }
            ]);
        }
    }, [isOpen, t, messages.length, isNameSet]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    const playAudio = async (base64Audio: string) => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const audioContext = audioContextRef.current;
        const audioBuffer = await decodeAudioData(decode(base64Audio), audioContext);
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start();
    };

    const getBotResponse = async (message: string, currentUserName: string) => {
      setIsLoading(true);
      try {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set.");
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const systemInstruction = `You are 'Sha'a', a friendly, enthusiastic, and helpful AI assistant for 'The Fast Bird' shipping company. Your persona is trustworthy and you speak in Egyptian Arabic. Your goal is to answer user questions based ONLY on the provided context. If the answer is not in the context, politely say you don't have that information. If asked about prices, you MUST respond in Egyptian Arabic. Address the user by their name, ${currentUserName}. First, state that a representative will contact them with details. Then, offer two options clearly: 1. Suggest they can get an initial cost estimate using the shipping calculator, providing a link formatted exactly as '[حساب الشحن](/order-now#shipping-calculator)'. 2. Suggest they can place their order directly using the order form, providing a link formatted exactly as '[اطلب الآن](/order-now#order-form)'. The company's info is in this JSON: ${fullSiteContent}`;

        const chatResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [{text: message}] }],
            config: { systemInstruction },
        });

        const botText = chatResponse.text;
        setMessages(prev => [...prev, { sender: 'bot', text: botText }]);

        // Text-to-Speech
        const ttsResponse = await ai.models.generateContent({
          model: "gemini-2.5-flash-preview-tts",
          contents: [{ parts: [{ text: `Say cheerfully in an Egyptian Arabic voice: ${botText}` }] }],
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: ttsVoice },
                },
            },
          },
        });
        const base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if(base64Audio) {
            await playAudio(base64Audio);
        }

      } catch (error) {
        console.error("Error with Gemini API:", error);
        setMessages(prev => [...prev, { sender: 'bot', text: t('chatbot.error') }]);
      } finally {
        setIsLoading(false);
      }
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        const messageText = userInput.trim();
        if (!messageText) return;

        setUserInput('');

        if (!isNameSet) {
            setUserName(messageText);
            setIsNameSet(true);
            setMessages(prev => [
                ...prev,
                { sender: 'user', text: messageText },
                { sender: 'bot', text: `${t('chatbot.hello')} ${messageText}! ${t('chatbot.howHelp')}` }
            ]);
        } else {
            setMessages(prev => [...prev, { sender: 'user', text: messageText }]);
            getBotResponse(messageText, userName);
        }
    };

    // Find the index of the last user message to apply processing style.
    const lastUserMessageIndex = messages.map(m => m.sender).lastIndexOf('user');

    const renderMessageWithLinks = (text: string) => {
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        // Fix: Changed (string | JSX.Element) to React.ReactNode to resolve "Cannot find namespace 'JSX'".
        const elements: React.ReactNode[] = [];
        let lastIndex = 0;
        let match;

        while ((match = linkRegex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                elements.push(text.substring(lastIndex, match.index));
            }
            const [, linkText, linkUrl] = match;
            elements.push(
                <Link
                    to={linkUrl}
                    key={match.index}
                    className="text-accent underline font-semibold hover:opacity-80"
                >
                    {linkText}
                </Link>
            );
            lastIndex = linkRegex.lastIndex;
        }

        if (lastIndex < text.length) {
            elements.push(text.substring(lastIndex));
        }

        return <p className="text-sm">{elements.map((el, i) => <React.Fragment key={i}>{el}</React.Fragment>)}</p>;
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-5 right-5 rtl:right-auto rtl:left-5 z-50 bg-primary text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-110"
                aria-label={t('chatbot.toggle')}
            >
                {isOpen ? (
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                )}
            </button>
            {isOpen && (
                <div className="fixed bottom-20 right-5 rtl:right-auto rtl:left-5 z-50 w-full max-w-sm h-[70vh] bg-white rounded-lg shadow-2xl flex flex-col transition-all duration-300 origin-bottom-right transform scale-100 opacity-100">
                    <header className="bg-primary text-white p-4 rounded-t-lg flex items-center justify-between">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            <img src="https://g.top4top.io/p_3580g7etb1.png" alt="Chatbot avatar" className="w-10 h-10 rounded-full bg-white p-1" />
                            <div>
                                <h3 className="font-bold text-lg">{t('chatbot.name')}</h3>
                                <p className="text-sm opacity-80">{t('chatbot.tagline')}</p>
                            </div>
                        </div>
                        <div className="relative">
                            <button onClick={() => setIsSettingsOpen(prev => !prev)} className="text-white opacity-80 hover:opacity-100" aria-label={t('chatbot.settings')}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </button>
                            {isSettingsOpen && (
                                <div className={`absolute top-full mt-2 w-64 bg-white rounded-lg shadow-xl p-4 border text-dark z-10 ${lang === 'ar' ? 'left-0' : 'right-0'}`}>
                                    <h4 className="font-bold mb-3">{t('chatbot.settings')}</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="tts-voice" className="block text-sm font-medium text-gray-700 mb-1">{t('chatbot.voice')}</label>
                                            <select
                                                id="tts-voice"
                                                value={ttsVoice}
                                                onChange={(e) => setTtsVoice(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm bg-white text-dark"
                                            >
                                                {availableVoices.map(voice => (
                                                    <option key={voice.name} value={voice.name}>{`${voice.name} (${voice.gender})`}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="speech-rate" className="block text-sm font-medium text-gray-700 mb-1">{t('chatbot.speechRate')}</label>
                                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                                <input
                                                    type="range"
                                                    id="speech-rate"
                                                    min="0.5"
                                                    max="2"
                                                    step="0.1"
                                                    value={speechRate}
                                                    onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                                />
                                                <span className="text-sm font-mono w-10 text-center">{speechRate.toFixed(1)}x</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">{t('chatbot.speechRateNote')}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </header>
                    <main className="flex-1 p-4 overflow-y-auto bg-gray-50">
                        <div className="space-y-4">
                            {messages.map((msg, index) => {
                                const isUser = msg.sender === 'user';
                                // The user's last message is being processed if isLoading is true.
                                const isProcessing = isUser && isLoading && index === lastUserMessageIndex;

                                return (
                                    <div key={index} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] p-3 rounded-lg transition-opacity duration-300 ${isUser ? 'bg-white text-primary border border-gray-200 rounded-br-none' : 'bg-primary text-white rounded-bl-none'} ${isProcessing ? 'opacity-50' : ''}`}>
                                            {renderMessageWithLinks(msg.text)}
                                        </div>
                                    </div>
                                );
                            })}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="max-w-[80%] p-3 rounded-lg bg-gray-200 text-dark rounded-bl-none flex items-center space-x-2">
                                       <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                                       <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></span>
                                       <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div ref={messagesEndRef} />
                    </main>
                    <footer className="p-4 border-t">
                        <form onSubmit={handleSendMessage} className="flex items-center space-x-2 rtl:space-x-reverse">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder={t('chatbot.placeholder')}
                                className="flex-1 w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary bg-white text-dark"
                                disabled={isLoading}
                            />
                            <button type="submit" className="bg-primary text-white p-3 rounded-full hover:bg-blue-600 disabled:bg-gray-400 transition-colors" disabled={isLoading}>
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rtl:rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </button>
                        </form>
                    </footer>
                </div>
            )}
        </>
    );
};

export default Chatbot;
