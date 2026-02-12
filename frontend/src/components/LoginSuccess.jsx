import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const LoginSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {

    const token = searchParams.get('token');
    const isProfileComplete = searchParams.get('complete');
    const userName = searchParams.get('name');
    const profileImage = searchParams.get('image');

    if (token) {
     
      localStorage.setItem('jwt', token);
      localStorage.setItem('userName', userName);
      localStorage.setItem('userImage', profileImage);

      navigate('/');
    }
  }, [searchParams, navigate]);

  return <div>Logging you in...</div>;
};

export default LoginSuccess;