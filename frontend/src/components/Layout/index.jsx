import Footer from '../Footer'

const Layout = props => {
    return (
        <>        
            {props.children}
            {props.useFooter ? <Footer /> : ''}
        </>
    )
}

export default Layout;
