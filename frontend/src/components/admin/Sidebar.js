import { Link } from 'react-router-dom';

export default function Sidebar () {



    return (
        <div className="sidebar-wrapper">
            <nav id="sidebar">
                <ul className="list-unstyled components">
                    <li>
                        <Link to="/admin/dashboard"><i className="fas fa-tachometer-alt"></i> Dashboard</Link>
                    </li>

                    <li>
                        <Link to="/admin/products/create"><i className="fas fa-tachometer-alt"></i> Create Product</Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}