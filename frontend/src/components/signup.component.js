import React, { useState, useCallback} from "react";
import { useHistory } from "react-router";
import configData from "../config.json";

function SignUp () {
    const history = useHistory();

    const [tempaccount, setTempAccount] = useState("");
    const [temppassword, setTempPassword] = useState("");
    const [tempinvitation, setTempInvitation] = useState("");

    const handleAccountChange = useCallback(event => {
        setTempAccount(event.target.value)
      }, [setTempAccount])

    const handlePasswordChange = useCallback(event => {
        setTempPassword(event.target.value)
    }, [setTempPassword])

    const handleInvitationChange = useCallback(event => {
        setTempInvitation(event.target.value)
    }, [setTempInvitation])


    const handleClick = () => {
        if ((tempaccount.length === 0) || (temppassword.length === 0) || (tempinvitation.length === 0)){
            alert("Please fill your account, password, and invitation code!")
            return
        }

        fetch(`${configData.SERVER_URL}/signup`, 
        {method:'POST', 
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
        body:JSON.stringify({"account":tempaccount, "password":temppassword, "invitation":tempinvitation})})
        .then(function(response) {
            return response.json()
            })
        .then(data => {
            if (data.level === "exist") {
                alert("You cannot use this account!")
            } else if (data.level === "member") {
                alert("Registration Successful!");
                history.push({
                    pathname:  "/",
                });
            } else {
                alert("NOOOOO! YOU ARE NOT QUALIFIED ENOUGH!");
            }
            })
        .catch(error=>{
            console.log(error)
        })
    }

    return (
        <div className="auth-wrapper">
        <div className="auth-inner">
        <form>
            <h3>Sign Up</h3>

            <div className="form-group">
                <label>Account</label>
                <input type="text" className="form-control" placeholder="Enter account" onChange={handleAccountChange} value={tempaccount}/>
            </div>

            <div className="form-group">
                <label>Password</label>
                <input type="password" className="form-control" placeholder="Enter password" onChange={handlePasswordChange} value={temppassword} />
            </div>

            <div className="form-group">
                <label>Invitation Code</label>
                <input type="password" className="form-control" placeholder="Enter invitation code" onChange={handleInvitationChange} value={tempinvitation} />
            </div>

            <button type="button" className="btn btn-primary btn-block pantoneZOZl" onClick={handleClick}>Sign Up</button>
            <p className="forgot-password text-right">
                Already registered? <a href="/sign-in" className="pantoneZOZ1a">Login</a>
            </p>
        </form>
        </div>
        </div>
    );
}

export default SignUp