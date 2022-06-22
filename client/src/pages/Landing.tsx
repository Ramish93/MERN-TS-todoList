import React,{useState} from "react";
import Login from '../components/auth/Login'
import Signup from '../components/auth/Signup'

const Landing = () => {
    const [isSignup, setIsSignup] = useState<boolean>(false);

    return (
        <div className = 'flex w-full h-screen'>
            <div className='w-1/2 max-w-sm mx-auto relative'>
            <div className='absolute inset-0 m-auto' style={{height: '300px'}}>

               {isSignup && <Signup renderLogin ={() => setIsSignup(false)}/> || <Login renderSignup ={() => setIsSignup(true)}/>}
            </div>
            </div>
            <div className='w-1/2 bg-blue-300'/>
        </div>
    )
}

export default Landing;