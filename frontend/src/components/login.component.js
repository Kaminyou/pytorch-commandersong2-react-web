import React, { useCallback } from "react";
import { useHistory } from "react-router";
import configData from "../config.json";

function Login({ level, setLevel, account, setAccount, pw, setPw, setRemain }) {
    const history = useHistory();

    const handleAccountChange = useCallback(event => {
        setAccount(event.target.value)
      }, [setAccount])

    const handlePasswordChange = useCallback(event => {
        setPw(event.target.value)
    }, [setPw])

    const handleClick = () => {
        console.log("click");
        fetch(`${configData.SERVER_URL}/login`, 
        {method:'POST', 
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
        body:JSON.stringify({"account":account, "password":pw})})
        .then(function(response) {
            //return response.json()
            return response.json()
            })
        .then(data => {
            if (data.level !== "guest") {
                setLevel(data.level);
                setRemain(data.remain)
                history.push({
                    pathname:  "/",
                });
            } else {
                alert("User does not exist!");
                setAccount("");
                setPw("");
                
            }
            })
        .catch(error=>{
            console.log(error)
            setLevel("guest")
        })

    }
  
    return (
    <div className="auth-wrapper">
    <div className="auth-inner">
        <form>
            <h3>Login</h3>

            <div className="form-group">
                <label>Account</label>
                <input type="text" className="form-control" placeholder="Enter your account" onChange={handleAccountChange} value={account}/>
            </div>

            <div className="form-group">
                <label>Password</label>
                <input type="password" className="form-control" placeholder="Enter password" onChange={handlePasswordChange} value={pw}/>
            </div>

            <button type="button" className="btn btn-primary btn-block pantoneZOZl" onClick={handleClick}>Submit</button>
        </form>
    </div>
    </div>
    )
  }

export default Login