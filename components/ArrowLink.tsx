import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"

export default function ArrowLink({href,text}){
    return <Link href={href}>
        <a className="arrowLink">
            <span>{text}</span>
            <span className="icon-wrapper"><FontAwesomeIcon className="icon" icon={faArrowRight}></FontAwesomeIcon></span>
        </a>
    </Link>
}