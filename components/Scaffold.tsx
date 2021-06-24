import Map from "./Map";
import Header from "./Header";
import Parameters from "./Parameters";
import ImportFile from "./ImportFile";
import ViewContainer from "./ViewContainer";
import DistrictsEdit from "./DistrictsEdit";

export default function Scaffold(){
    return <div id="scaffold">
        <section id="first-row">
            <div className="left">
                <Parameters></Parameters>
            </div>
            <div className="right">
                <ImportFile></ImportFile>
                <DistrictsEdit></DistrictsEdit>
            </div>
        </section>
        <section id="body">
            <Map></Map>
            <ViewContainer></ViewContainer>
        </section>
    </div>
}