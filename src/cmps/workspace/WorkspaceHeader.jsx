import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AppLogo } from '../AppLogo'

import { logout } from '../../store/actions/user.actions'
import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'

export function WorkspaceHeader() {
    const user = useSelector(storeState => storeState.userModule.user)
    const navigate = useNavigate()

    async function onLogout() {
        try {
            await logout()
            navigate('/')
            showSuccessMsg('Bye now')
        } catch (err) {
            showErrorMsg('Cannot logout')
        }
    }

    return (
        <header className="app-header full workspace-app-header">
            <nav aria-label="Main navigation">
                <Link to="/" className="logo">
                    <AppLogo />
                </Link>
                <NavLink to="/board">Workspace</NavLink>
                {!user && <>
                    <span className="workspace-guest">Guest workspace</span>
                    <Link to="/auth/login" className="login-link">Login</Link>
                </>}
                {user && (
                    <div className="user-info">
                        <Link to={`/user/${user._id}`}>
                            {user.imgUrl && <img src={user.imgUrl} alt="" />}
                            {user.fullname}
                        </Link>
                        <button onClick={onLogout}>Logout</button>
                    </div>
                )}
            </nav>
        </header>
    )
}
