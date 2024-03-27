import style from "./topbar.module.css"
const Topbar = () => {
    return (<div className={style.container}>
        <h1 className={style.title}>Rooms</h1>
        <button className={style.btn}><b>Create invite code</b></button>
    </div>)
}

export default Topbar
