import conf from "../Config";

function Footer(){
    return (
        <div className="footer">
            <p>{new Date().getFullYear()} © {conf.SITE_NAME} ☄️</p>
        </div>
    )
}

export default Footer;