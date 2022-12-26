import { Navigate } from "react-router-dom"

const Login = () => {

    let auth = {'token': true}

    return(
        auth.token ? <Navigate to="/"/> : <div>Need to login</div>
    )

}

export default Login