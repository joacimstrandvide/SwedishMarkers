import { NavLink } from "react-router-dom"

function Error() {
    return (
        <>
            <div className="error">
                <h2>Page not found!</h2>
                <p>The page you requested does not exist or has been moved.</p>
                <p>
                    Go to the <NavLink to="/">Homepage</NavLink>
                </p>
            </div>
        </>
    )
}

export default Error
