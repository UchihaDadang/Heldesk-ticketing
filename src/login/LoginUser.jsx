const LoginUser = () => {
    return(
        <div className="container-fluid d-flex p-0 align-items-center justify-content-center" style={{height: '100vh', backgroundColor: '#E9F1FA'}}>
            <div className="container text-center p-5 rounded-2 shadow" style={{ maxWidth: '350px' ,  backgroundColor: '#00ABE4'}}>
                <h3 className="mb-3" style={{color: 'white'}}>Login Users</h3>
                <button type="button" className="btn-login-user p-2" style={{backgroundColor: '#E9F1FA', border: 'none', borderRadius: '10px'}}>
                    <i className="bi bi-google" style={{marginRight: '5px', color: '#00ABE4'}}></i>Login Dengan Akun Google
                </button>
            </div>
        </div>
    )
}

export default LoginUser