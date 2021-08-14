import Map from "./Map";
import Header from "./Header";
import Parameters from "./Parameters";
import ImportFile from "./ImportFile";
import ViewContainer from "./ViewContainer";
import DistrictsEdit from "./DistrictsEdit";
import { useContext } from "react";
import RunAlgorithm from "./RunAlgorithm";
import ListView from "./ListView";
import Analysis from "./Analysis";
import ExportFile from "./ExportFile";
import DistrictsList from "./DistrictsList";

export default function Scaffold(){

    return <div id="scaffold">
        <section id="first-row">
            <div className="left">
                <Parameters></Parameters>
            </div>
            <div className="right">
                <div className="row">
                    
                    <ExportFile></ExportFile>
                    <ImportFile></ImportFile>
                </div>
                <div className="second-row">
                    <RunAlgorithm></RunAlgorithm>
                    <DistrictsEdit></DistrictsEdit>
                </div>
            </div>
        </section>
        <section id="body">
            <Map></Map>
            <ListView></ListView>
        </section>
        <section id="districts">
            <DistrictsList></DistrictsList>
        </section>
        <section id="analysis">
            <Analysis></Analysis>
        </section>
    </div>
}