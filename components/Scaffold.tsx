import Map from "./Map";
import Header from "./Header";
import Parameters from "./Parameters";
import ImportFile from "./ImportFile";
import ViewContainer from "./ViewContainer";
import DistrictsEdit from "./DistrictsEdit";
import { useState } from "react";
import RunAlgorithm from "./RunAlgorithm";
import ListView from "./ListView";

export default function Scaffold(){
    return <div id="scaffold">
        <section id="first-row">
            <div className="left">
                <Parameters></Parameters>
            </div>
            <div className="right">
                <ImportFile></ImportFile>
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
    </div>
}