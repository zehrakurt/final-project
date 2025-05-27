import { useEffect, useState } from "react";
import axios from "axios";

export default function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://fe1111.projects.academy.onlyjs.com/api/v1/categories"
        );
        setCategories(response.data.data.data); // Doğru diziyi alıyoruz
      } catch (err) {
        console.error("Veri çekilirken hata oluştu!", err);
      }
    };
    fetchData();
  }, []);

  // 📌 Recursive (Özyinelemeli) Fonksiyon: Alt kategorileri iç içe listelemek için
  const renderCategories = (categoryList) => {
    return (
      <ul>
        {categoryList.map((category) => (
          <li key={category.id}>
            <strong>{category.name}</strong>
            {/* Eğer bu kategorinin alt kategorileri varsa onları da listele */}
            {category.children && category.children.length > 0 && (
              <div style={{ marginLeft: "20px" }}>{renderCategories(category.children)}</div>
            )}
            {/* Eğer bu kategorinin altındaki "sub_children" varsa onları da listele */}
            {category.sub_children && category.sub_children.length > 0 && (
              <ul style={{ marginLeft: "40px" }}>
                {category.sub_children.map((sub) => (
                  <li key={sub.slug}>{sub.name}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <h2>Kategoriler</h2>
      {renderCategories(categories)}
    </div>
  );
}
