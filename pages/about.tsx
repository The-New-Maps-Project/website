import Link from "next/link";

export default function About(){
    return <div id='about'>
        <div className="page-header">
            <h2>About</h2>
            <p>About The New Map Project</p>
        </div>
        <section id="about-paragraph">
            The New Maps Project uses online tools and software to help draw congressional districts 
            and fight gerrymandering. The goal of The New Maps Project is to provide everyone access 
            to flexible and interactive map drawing resources, as well as to aid the the redistring process
            following the 2020 US Census. On The New Maps Project's website, there is an interactive 
            Editing Suite to visualize, analyze and draw congressional districts. The New Maps Project also
            provides an algorithm to programmatically redraw districts that are compact, continous, and 
            evenly populated, that is integrated into the online tools and Editing Suite. The New Maps Project's 
            tools are extremely flexible, supporting demographic data and statistical analysis. With just a
            web browser, you can unlock all of The New Maps Project's resources for free with just the click of
            a button. 
        </section>
        <section className="links">
            <Link href="/"><a>Editing Suite</a></Link>
            <Link href="/documentation"><a>Documentation</a></Link>
        </section>
    </div>
}