import PropTypes from 'prop-types'

export function AppLogo({ isDark = false }) {
    const src = isDark ? '/img/taskio-logo-dark.png' : '/img/taskio-logo.png'
    return <img className="app-logo" src={src} alt="Taskio" width="132" height="44" />
}

AppLogo.propTypes = {
    isDark: PropTypes.bool,
}
