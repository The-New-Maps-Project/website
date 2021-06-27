//props: text:string, percent:number (percent out of 100, not decimal representation)
export default function PercentBar(props){
    return <div className="percent-bar">
        <div className="inner-pb" style={{width: `${props.percent}%`}}></div>
        <label>{props.percent.toFixed(0)}% {props.text}</label>
    </div>
}