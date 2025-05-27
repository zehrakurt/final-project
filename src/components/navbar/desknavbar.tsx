import React, { useState, useEffect } from "react";
import { HoverCard } from "@mantine/core";
import { Link } from "react-router-dom";
import "./desknavbar.css";

export default function Desknavbar() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(
                    "https://fe1111.projects.academy.onlyjs.com/api/v1/categories"
                );
                if (!response.ok) {
                    throw new Error(`API hatası: ${response.status}`);
                }

                const data = await response.json();
                if (data?.data?.data) {
                    setCategories(data.data.data);
                } else {
                    setError("Kategoriler yüklenemedi.");
                }
            } catch (err) {
                setError("Kategori verisi getirilemedi.");
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) return <div>Yükleniyor...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="kef">
            <nav>
                <ul className="navbar-menu">
                    {categories.map((category) => (
                        <li key={`category-${category.slug}`}>
                            <HoverCard width="80%" shadow="md">
                                <HoverCard.Target>
                                    <Link to={`/products/${category.slug}`}>
                                        <p>{category.name}</p>
                                    </Link>
                                </HoverCard.Target>
                                <HoverCard.Dropdown className="aa">
                                    <div className="hover-dropdown-content">
                                        <div className="category-columns">
                                            {category.children?.map((sub) => (
                                                <div key={`sub-${sub.slug}`} className="category-column">
                                                    <ul>
                                                        <li>
                                                            <Link className="ss" to={`/products/${sub.slug}`}>
                                                                {sub.name}
                                                            </Link>
                                                            {sub.sub_children?.length > 0 && (
                                                                <ul className="sub-children">
                                                                    {sub.sub_children.map((sub2, index) => (
                                                                        <li
                                                                            key={`sub2-${sub2.slug}-${index}`}
                                                                        >
                                                                            <Link
                                                                                className="ll"
                                                                                to={`/product/${sub2.slug}`}
                                                                            >
                                                                                {sub2.name}
                                                                            </Link>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </li>
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </HoverCard.Dropdown>
                            </HoverCard>
                        </li>
                    ))}
                    {/* "Tüm Ürünler" kategorisi */}
                    <li>
                        <Link className="spe"  to="/products/all-products">
                            <p>TÜM ÜRÜNLER</p>
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}