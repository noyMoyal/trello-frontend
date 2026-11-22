import { Routes, Route, useLocation } from 'react-router'

import { HomePage } from './pages/HomePage'
import { BoardIndex } from './pages/BoardIndex.jsx'

import { BoardDetails } from './pages/BoardDetails'
import { UserDetails } from './pages/UserDetails'

import { AppHeader } from './cmps/AppHeader'
import { WorkspaceHeader } from './cmps/workspace/WorkspaceHeader'
import { AppFooter } from './cmps/AppFooter'
import { UserMsg } from './cmps/UserMsg.jsx'
import { LoginSignup, Login, Signup } from './pages/LoginSignup.jsx'


export function RootCmp() {
    const { pathname } = useLocation()
    const isWorkspace = pathname.replace(/\/$/, '') === '/board'

    return (
        <div className={`main-container ${isWorkspace ? 'workspace-layout' : ''}`}>
            {isWorkspace ? <WorkspaceHeader /> : <AppHeader />}
            <UserMsg />

            <main>
                <Routes>
                    <Route path="" element={<HomePage />} />
                    <Route path="board" element={<BoardIndex />} />
                    <Route path="board/:boardId" element={<BoardDetails />} />
                    <Route path="user/:id" element={<UserDetails />} />
                    <Route path="auth" element={<LoginSignup />}>
                        <Route path="login" element={<Login />} />
                        <Route path="signup" element={<Signup />} />
                    </Route>
                </Routes>
            </main>
            {!isWorkspace && <AppFooter />}
        </div>
    )
}


