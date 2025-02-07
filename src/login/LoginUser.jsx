import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

const LoginUser = () => {
    
    const navigate = useNavigate();

    const handleSuccess = async (credentialResponse) => {
        try {
            const response = await fetch('http://localhost:3000/login/user', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify({
                    credential: credentialResponse.credential
                })
            });

            const data = await response.json();
            if (data.token) {
                localStorage.setItem('userToken', data.token);
                navigate('/user/beranda');
            }
            console.log('Login Success:', credentialResponse);
        } catch(error) {
            console.error('login gagal', error);
        }
    };

    const handleError = (error) => {
        console.error('Login Failed:', error);
    }

    return(
        <div className="container-fluid d-flex p-0 align-items-center justify-content-center" style={{height: '100vh', backgroundColor: '#E9F1FA'}}>
            <div className="container text-center p-5 rounded-2 shadow" style={{ maxWidth: '350px' ,  backgroundColor: '#00ABE4'}}>
                <h3 className="mb-3" style={{color: 'white'}}>Login Users</h3>
                <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={handleError}
                    useOneTap
                    theme="filled_blue"
                    size="large"
                    text="continue_with"
                    shape="rectangular"
                />
            </div>
        </div>
    )
}

export default LoginUser