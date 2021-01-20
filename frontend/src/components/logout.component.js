import { useHistory } from "react-router";

function LogOut({ level, setLevel, account, setAccount, pw, setPw, setRemain }) {
    const history = useHistory();

    const handleLogOut = () => {
        console.log("click logout");
        setLevel("guest");
        setAccount("");
        setPw("");
        setRemain(0);
        history.push({
            pathname:  "/",
        });
    }
  
    return (
    <div className="auth-wrapper">
    <div className="auth-inner">
        <h3>Log out?</h3>

        <button type="button" className="btn btn-primary btn-block pantoneZOZl" onClick={handleLogOut}>Logout</button>
    </div>
    </div>
    )
  }

export default LogOut