import React, { useEffect, useState } from 'react';
import { Accordion } from '@mantine/core';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './accordion.css'
const Accordionn = () => {
    const { productId } = useParams<{ productId: string }>();
    const [description, setDescription] = useState('');
    const [features, setFeatures] = useState('');
    const [usage, setUsage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
const { slug } = useParams<{ slug: string }>();
    useEffect(() => {
        if (slug) {
            setLoading(true);
            axios
                .get(`https://fe1111.projects.academy.onlyjs.com/api/v1/products/${slug}`)
                .then((response) => {
                    if (response.data.status === 'success') {
                        const explanation = response.data.data.explanation;
                        setDescription(explanation.description);
                        setFeatures(explanation.features);
                        setUsage(explanation.usage);
                        setLoading(false);
                    } else {
                        setError('Ürün verisi alınamadı');
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    setError('Veri çekme hatası: ' + error.message);
                    setLoading(false);
                });
        }
    }, [slug]);

    if (loading) return <p>Yükleniyor...</p>;
    if (error) return <p>Hata: {error}</p>;

    return (
        <div>
            <Accordion transitionDuration={0} className='item-1'>
                <Accordion.Item value="item-1">
                    <Accordion.Control className="acc">ÖZELLİKLER</Accordion.Control>
                    <Accordion.Panel>
                        <p>{features}</p>
                    </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item value="item-2">
                    <Accordion.Control className="acc">BESİN İÇERİĞİ</Accordion.Control>
                    <Accordion.Panel>
                        <p>{description}</p>
                    </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item value="item-3">
                    <Accordion.Control className="acc">KULLANIM ŞEKLİ</Accordion.Control>
                    <Accordion.Panel>
                        <p>{usage}</p>
                    </Accordion.Panel>
                </Accordion.Item>
            </Accordion>
        </div>
    );
};

export default Accordionn;