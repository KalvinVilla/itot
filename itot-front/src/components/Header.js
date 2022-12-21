import '../assets/css/components/Header.css'
import Logo from '../assets/img/evian.png'

const Header = () => {

    return (

        <div className='header'>
            <img className="header-logo"  src={Logo} alt="Logo evian" />
            <h1 className='header-title'>IT/OT Management</h1>
        </div>

    )

}

export default Header