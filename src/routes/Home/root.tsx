
import { Outlet } from 'react-router-dom';
import Firstnavbar from '../../components/firstnavbar/firstnavbar';
import Desknavbar from '../../components/navbar/desknavbar';
import Bfooter from '../../components/bfooter';
import MobileFooter from '../../components/mobilefooter';



const RootLayout = () => {
  return (
    <div className="root-layout">
      <Firstnavbar />
      <Desknavbar />
      <div className="main-layout">
        
        <div className="content">
          <Outlet />  
        </div>
      </div>
      <Bfooter />
      <MobileFooter />
    </div>
  );
};

export default RootLayout;
