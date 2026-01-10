import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/dashboard${window.location.search}`);
  }, [navigate]);

  return null;
};

export default Index;
