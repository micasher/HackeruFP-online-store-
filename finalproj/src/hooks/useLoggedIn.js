import axios from "axios";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth";
import jwt_decode from "jwt-decode";
import { toast } from "react-toastify";
const useLoggedIn = () => {
  const dispatch = useDispatch();
  return async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      let { data } = await axios.get("/users/userInfo");
      if (!data) {
        localStorage.clear();
        throw new Error("invalid token");
      }
      console.log("here");
      delete data.__v;
      delete data.createdAt;
      delete data.password;
      const payload = jwt_decode(token);
      let fullObjOfRedux = { payload, data };
      dispatch(authActions.login(fullObjOfRedux));
      return true;
    } catch (err) {
      //server error
      //invalid token
      if (err && err.response && err.response.data && err.response.data.msg) {
        toast.error(err.response.data.msg);
      } else {
        toast.error("something went wrong, try again later please!");
      }
      return true;
    }
  };
};

export default useLoggedIn;
