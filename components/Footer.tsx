import Link from "next/link";

export default function Footer(){
    return <footer>
        <div>&copy; The New Maps Project 2021</div>
        <Link href="/privacy"><a target="_blank" className="grey-tb ml15">Privacy {"&"} Disclaimers</a></Link>
    </footer>
}