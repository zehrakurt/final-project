import React, { useState, useEffect, useRef } from 'react';
import './accordion.css';

import { Question, fakeQuestionsData } from './fakedata'; 


const Accordion: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [openQuestionId, setOpenQuestionId] = useState<number | null>(null);
    const contentRefs = useRef<Record<number, HTMLDivElement | null>>({});
useEffect(() => {

    window.scrollTo(0, 0);
  }, []); 
    useEffect(() => {
        setQuestions(fakeQuestionsData);
    }, []);

    const toggleAccordion = (id: number) => {
        setOpenQuestionId(prev => prev === id ? null : id);
    };

    const [selectedCategory, setSelectedCategory] = useState<string>('genel');

    const filterQuestions = (category: string) => {
        setSelectedCategory(category);
        setOpenQuestionId(null);
    };

    const filteredQuestions = questions.filter(q => q.category === selectedCategory);

    return (
        <> <div className='nn'>
            <div className="buttons-container container mx-auto justify-start">
                <button
                    className={`filter-button ${selectedCategory === 'genel' ? 'active' : ''}`}
                    onClick={() => filterQuestions('genel')}
                >
                    Genel
                </button>
                <button
                    className={`filter-button ${selectedCategory === 'ürünler' ? 'active' : ''}`}
                    onClick={() => filterQuestions('ürünler')}
                >
                    Ürünler
                </button>
                <button
                    className={`filter-button ${selectedCategory === 'kargo' ? 'active' : ''}`}
                    onClick={() => filterQuestions('kargo')}
                >
                    Kargo
                </button>
            </div>
            <div className="selected-category container mx-auto justify-start">
                <img className='logo-0' src="images/SVG (1).png" alt="" />
                {selectedCategory.toUpperCase()}
            </div>
            
            <div className='container mx-auto accordion-wrapper'> {/* Yeni wrapper div */}
                {filteredQuestions.map((question) => {
                    const isOpen = openQuestionId === question.id;
                    return (
                        <div key={question.id} className={`cn ${isOpen ? 'open' : ''}`}>
                            <button
                                className='sdf'
                                onClick={() => toggleAccordion(question.id)}
                                aria-expanded={isOpen}
                            >
                                <span className='asc'>{question.question}</span>
                                <img
                                    src="images/SVG (4).png"
                                    alt="arrow"
                                    className={`faq-arrow transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`}
                                />
                            </button>
                            <div
                                ref={(el) => {
                                    if (el) contentRefs.current[question.id] = el;
                                }}
                                style={{
                                    maxHeight: isOpen && contentRefs.current[question.id] ? `${contentRefs.current[question.id]?.scrollHeight}px` : '0px',
                                    overflow: 'hidden',
                                    transition: 'max-height 0.3s ease-in-out',
                                }}
                            >
                                <p className=''>{question.answer}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* İletişim Formu */}
            <div className="input-container zll flex flex-col items-center gap-4">
                <label htmlFor="name" className="label-align text-sm font-medium ff leading-6 text-gray-900 text-center mb-2">
                    Bize aşağıdaki iletişim ulaşabilirsiniz.
                </label>
                <div className="name-surname-container flex flex-col sm:flex-row gap-4 justify-center">
                    <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="İsim *"
                        className="label-4 block w-full sm:w-1/2 rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <input
                        id="price"
                        name="surname"
                        type="text"
                        placeholder="Soyad"
                        className="label-4 block w-full sm:w-1/2 rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                </div>
                <input
                    id="email"
                    name="e-posta"
                    type="text"
                    placeholder="E-Posta"
                    className="mail-input block w-full sm:w-2/3 rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-4"
                />
                <input
                    id="message"
                    name="mesaj"
                    type="text"
                    placeholder="Mesaj"
                    className="mesaj-input block w-full sm:w-2/3 rounded-md border-0 py-1.5 pl-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-4"
                />
                <button className="gndr-btn mt-4">GÖNDER</button>
            </div>
            </div>
        </>
    );
};

export default Accordion;