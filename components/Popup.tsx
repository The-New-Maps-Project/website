export default function Popup(props){
    return <div className="gob">
        <div className="popup">
            {props.children}
        </div>
    </div>
}