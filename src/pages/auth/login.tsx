import { CircleButton } from '@components/button';
import { Typography } from '@components/typography';
import styled from '@styles/auth.module.css';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@context/auth-context';
import { useNavigate } from 'react-router-dom';

//----------------------------------------------------------------------

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleLogin = async (response: any) => {
    console.log('Response from Google:', response);
    const loginResponse = await login(response);
    console.log('Response from server:', loginResponse);
    navigate('/buyer');
  };

  return (
    <>
      <div className="bg-auth w-full h-svh flex flex-col justify-around items-center px-[2.5rem]">
        <div id="stars" className={styled.stars}></div>
        <div className="w-full mx-auto md:mt-0 md:w-[25.5rem] md:p-[2.5rem] md:bg-neutral1-5 md:rounded-[2rem] md:shadow-auth-card md:backdrop-blur-[3.125rem]">
          <div className="flex flex-col mb-[2.5rem] items-center gap-6">
            <CircleButton className="size-[3.75rem] p-[1.125rem]">
              <img src="/svg/circle_logo.svg" alt="Bento Logo" />
            </CircleButton>
            <Typography level="h4" className="text-primary">
              Sign in to GoodEx
            </Typography>
          </div>

          <div className="flex flex-col gap-3">
            <GoogleLogin text="continue_with" onSuccess={handleLogin} />
          </div>
        </div>
      </div>
    </>
  );
}
