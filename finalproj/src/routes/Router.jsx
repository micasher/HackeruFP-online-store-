import { Navigate, Route, Routes } from "react-router-dom";
// import Pages//
import HomePage from "../pages/HomePage";
import RegisterPage from "../pages/RegisterPage";
import ROUTES from "./ROUTES";
import LoginPage from "../pages/LoginPage";
import LogoutPage from "../pages/LogoutPage";
import AboutPage from "../pages/AboutPage";
import EditCardPage from "../pages/EditCardPage";
import ProfilePage from "../pages/ProfilePage";
import CardDataPage from "../pages/CardDataPage";
import ProtectedRoute from "../components/ProtectedRoute";
import SuperProtectedRoute from "../components/SuperProtectedRoute";
import CreateCardPage from "../pages/CreateCardPage";
import MyCardsPage from "../pages/MyCards";
import UsersTable from "../pages/CRMPage";
import ProfileDataPage from "../pages/ProfileDataPage";
import CartPage from "../pages/CartPage";

const Router = () => {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.FAKEHOME} element={<Navigate to={ROUTES.HOME} />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.ABOUT} element={<AboutPage />} />
      <Route
        path={ROUTES.CART}
        element={<ProtectedRoute element={<CartPage />} />}
      />
      <Route path={`${ROUTES.CARDDATA}/:id`} element={<CardDataPage />} />
      <Route
        path={ROUTES.LOGOUT}
        element={<ProtectedRoute element={<LogoutPage />} />}
      />
      <Route
        path={`${ROUTES.EDITCARD}/:id`}
        element={
          <SuperProtectedRoute isAdmin={true} element={<EditCardPage />} />
        }
      />

      <Route
        path={ROUTES.PROFILE}
        element={<ProtectedRoute element={<ProfilePage />} />}
      />
      <Route
        path={ROUTES.CREATE}
        element={
          <SuperProtectedRoute isAdmin={true} element={<CreateCardPage />} />
        }
      />
      <Route
        path={ROUTES.MYCARD}
        element={
          <SuperProtectedRoute isAdmin={true} element={<MyCardsPage />} />
        }
      />
      <Route
        path={ROUTES.CRM}
        element={
          <SuperProtectedRoute isAdmin={true} element={<UsersTable />} />
        }
      />
      <Route
        path={ROUTES.PROFILECRM + "/:id"}
        element={
          <SuperProtectedRoute isAdmin={true} element={<ProfileDataPage />} />
        }
      />
      <Route path="*" element={<h1>404</h1>} />
    </Routes>
  );
};

export default Router;
