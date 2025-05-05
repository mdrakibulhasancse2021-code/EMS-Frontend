import { Outlet } from "react-router";
import Navber from "../Components/Navber/Navber";
import Footer from "../Components/Footer/Footer";

const MainLayout = () => {

  return (
    <div>
      {/* <Navber /> */}
      <Outlet />
      {/* <Footer /> */}
    </div>
  );
};

export default MainLayout;
