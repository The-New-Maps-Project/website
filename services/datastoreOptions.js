const options = [
    {
        name: "Connecticut",
        districts: "5 congressional districts",
        info: "10 parameters, Census Tracts as precincts",
        fileName: "ct5ct.txt",
        zoom: {
            lat: 41.6032, 
            lng: -73.0877,
            zoom: 8,
        },
        runAlgoNotes: "~40 secs; RSD: ~2%"
    },
    {
        name: "North Carolina",
        districts: "14 congressional districts",
        info: "10 parameters, ZIP codes as precincts",
        fileName: "nc14zc.txt",
        zoom: {
            lat: 35.7596, 
            lng: -79.0193,
            zoom: 6,
        },
        runAlgoNotes: "~60 secs; RSD: ~3%"
    },
    {
        name: "Massachusetts",
        districts: "9 congressional districts",
        info: "10 parameters, ZIP codes as precincts",
        fileName: "ma9zc.txt",
        zoom: {
            lat: 42.4072, 
            lng: -71.3824,
            zoom: 8,
        },
        runAlgoNotes: "~40 secs; RSD: ~2%"
    },
    {
        name: "Georgia",
        districts: "14 congressional districts",
        info: "10 parameters, ZIP codes as precincts",
        fileName: "ga14zc.txt",
        zoom: {
            lat: 32.1656, 
            lng: -82.9001,
            zoom: 6,
        },
        runAlgoNotes: "~60 secs; RSD: ~4%"
    },
    {
        name: "New Jersey",
        districts: "12 congressional districts",
        info: "10 parameters, ZIP codes as precincts",
        fileName: "nj12zc.txt",
        zoom: {
            lat: 40.0583, 
            lng: -74.4057,
            zoom: 7,
        },
        runAlgoNotes: "~60 secs; RSD: ~3%"
    },
    {
        name: "Colorado",
        districts: "8 congressional districts",
        info: "10 parameters, ZIP codes as precincts",
        fileName: "co8zc.txt",
        zoom: {
            lat: 39.5501, 
            lng: -105.7821,
            zoom: 6,
        },
        runAlgoNotes: "~2 min; RSD: ~3%"
    },
    {
        name: "Kentucky",
        districts: "6 congressional districts",
        info: "10 parameters, ZIP codes as precincts",
        fileName: "ky6zc.txt",
        zoom: {
            lat: 37.8393, 
            lng: -84.27,
            zoom: 6,
        },
        runAlgoNotes: "~30 secs; RSD: ~3%"
    },
    {
        name: "New Mexico",
        districts: "3 congressional districts",
        info: "10 parameters, ZIP codes as precincts",
        fileName: "nm3zc.txt",
        zoom: {
            lat: 34.51, 
            lng: -105.87,
            zoom: 6,
        },
        runAlgoNotes: "~20 secs; RSD: ~3%"
    },
    {
        name: "Texas",
        districts: "38 congressional districts",
        info: "10 parameters, ZIP codes as precincts",
        fileName: "tx38zc.txt",
        zoom: {
            lat: 31.9686, 
            lng: -99.9018,
            zoom: 5,
        },
        runAlgoNotes: "~3 min; RSD: ~8%"
    },
    {
        name: "Florida",
        districts: "28 congressional districts",
        info: "10 parameters, ZIP codes as precincts",
        fileName: "fl28zc.txt",
        zoom: {
            lat: 27.6648, 
            lng: -81.5158,
            zoom: 6,
        },
        runAlgoNotes: "~70 secs; RSD: ~12%"
    },
    {
        name: "New Hampshire",
        districts: "2 congressional districts",
        info: "10 parameters, ZIP codes as precincts",
        fileName: "nh2zc.txt",
        zoom: {
            lat: 42.19, 
            lng: -71.57,
            zoom: 7,
        },
        runAlgoNotes: "~20 secs; RSD: ~7%"
    },
    {
        name: "New York",
        districts: "26 congressional districts",
        info: "10 parameters, ZIP codes as precincts",
        fileName: "ny26zc.txt",
        zoom: {
            lat: 40.7128, 
            lng: -74.0060,
            zoom: 6,
        },
        runAlgoNotes: "~6 min; RSD: ~12%"
    },
    // {
    //     name: "Illinois",
    //     districts: "18 congressional districts",
    //     info: "Zero parameters, ZIP codes as precincts",
    //     fileName: "il18zc.txt",
    //     zoom: {
    //         lat: 40.6331, 
    //         lng: -89.3985,
    //         zoom: 6,
    //     }
    // },
]

export default options;
