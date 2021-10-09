export default function Contact(){
    const people = [{
        name: "Vincent Cai",
        position: "Creator",
        description: "Hi! I'm Vincent Cai. I'm a student from Connecticut who's passionate about creating fair representation in government. I am the creator of The New Maps Project; I develop all the software from the editing suite to the algorithm and visualizer, and I submit all the maps. Please reach out if you have any questions about this site or The New Maps Project in general",
        email: "vincent.cai48@gmail.com",
        imageURL: "vincentcai.jpg"
    }]


    return <div>
        <div className="page-header">
            <h2>Contact</h2>
            <p>Contact The New Maps Project</p>
            <div className="background" style={{backgroundImage: 'url("/images/contact.jpg")'}}></div>

        </div>



        <ul id="people-list">
            {people.map(person=>{
                return <li key={person.name}>
                    <div className="person-image" style={{backgroundImage: `url(/images/${person.imageURL})`}}></div>
                    <div className="p-info">
                        <div className="p-name">{person.name}</div>
                        <p className="p-position">{person.position}</p>
                        <p className="p-description">{person.description}</p>
                        <p className="p-email">Email: <a href={`mailto:${person.email}`}>{person.email}</a></p>
                    </div>
                    
                </li>
            })}
        </ul>
    </div>
}
