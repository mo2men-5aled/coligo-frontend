import { useAppSelector } from "../store/hooks";
import Unauthorized from "../pages/Unauthorized";

interface PrivateRouteProps {
  children: React.ReactNode; // Ensure children is ReactNode
}

const RequireAuth: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthorized } = useAppSelector(state => state.auth);
  
  return isAuthorized ? <>{children}</> : <Unauthorized />;
};

export default RequireAuth;
