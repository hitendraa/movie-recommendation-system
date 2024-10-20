// NavBar Component
import { Link } from "react-router-dom";
import "./styles/NavBarStyles.css";

const NavBar = ({ isHome }) => {
    const gitRepoLink =
        "https://github.com/hitendraa";
    return (
        <div className="container header">
            <Link to="/ ">
                <h1 style={
                    {
                        fontSize: "30px"
                    }
                }>Movie System</h1>
            </Link>
            
            {isHome ? (
                <a href="/" className="header-btn1 bouncy">
                    <i className="fas fa-home"></i> Home
                </a>
            ) : (
                <a
                    href={gitRepoLink}
                    target="_blank"
                    rel="noreferrer"
                    className="header-btn1 bouncy"
                >
                    <i className="fa-brands fa-github"></i> Github
                </a>
            )}
        </div>
    );
};

export default NavBar;
