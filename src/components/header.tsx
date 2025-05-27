import './header.css';
import Three2 from './three2';
import Bestseller from './bestseller';
import Homepage from './homepage';
import Desknavbar from './navbar/desknavbar';


export default function Header() {
  

  return (
    <>
    <Desknavbar/>

     <Homepage/>
      <Three2/>
      <Bestseller/>
      
    </>
  );
}
