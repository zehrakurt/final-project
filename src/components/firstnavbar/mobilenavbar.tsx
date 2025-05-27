import { useDisclosure } from '@mantine/hooks';
import { Drawer } from '@mantine/core';
import '@mantine/core/styles.css';
import { GiHamburgerMenu } from "react-icons/gi";
import './mobilenavbar.css';
import { Link } from 'react-router-dom';
import { MdOutlineShoppingCart } from "react-icons/md";
import { useCartStore } from '../../store/sepet';
import { calculateTotalPrice } from './calculateTotalPrice';

export default function Mobilenavbar({ openMainDrawer }) {
  const [opened, { open, close }] = useDisclosure(false);
  const bears = useCartStore((state) => state.bears);

  return (
    <>
      <div className='container stl mx-auto'>
        <Drawer opened={opened} size="sm" onClose={close}>
          <div className="flex flex-col ...">
            <div> 
              <ul className='kuu'>
                <Link to={`protein`}>Protein</Link>
                <img src="images/right-caret.svg.png" className='tyr-7' alt="" />
                <li>Spor Gıdaları  <img src="images/right-caret.svg.png" className='tyr-7' alt="" /></li>
                <li>Sağlık  <img src="images/right-caret.svg.png" className='tyr-7' alt="" /></li>
                <li>Gıda  <img src="images/right-caret.svg.png" className='tyr-7' alt="" /></li>
                <li>Vitamin  <img src="images/right-caret.svg.png" className='tyr-7' alt="" /></li>
                <li>Tüm Ürünler </li>
              </ul>
            </div>
            <div className='alt-5'>
              <ul>
                <li className='mtt'>HESABIM</li>
                <li>MÜŞTERİ YORUMLARI</li>
                <li>İLETİŞİM</li>
              </ul>
            </div>
          </div>
        </Drawer>
        
        <GiHamburgerMenu className='icn-hm' onClick={open} />
        <Link to="/">
          <img className='logo-mobl' src="/images/logo.png" alt="Logo" />
        </Link>
        <div className="cart-container">
          <MdOutlineShoppingCart onClick={openMainDrawer} className='icn-7' />
          <div className="roundedd-2">{bears.length}</div>
        </div>
      </div>
      <div className="search-container">
        <img className='search-icon' src="/images/search-icon.svg.png" alt="search icon" />
        <input className='mbl-input' placeholder='ARADIĞINIZ ÜRÜNÜ YAZINIZ' type="text" />
      </div>
    </>
  );
}
