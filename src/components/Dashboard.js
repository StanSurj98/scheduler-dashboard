import React, { Component } from "react";
// Libraries
import classnames from "classnames";
import axios from "axios";
// Helpers
import {
  getTotalInterviews,
  getLeastPopularTimeSlot,
  getMostPopularDay,
  getInterviewsPerDay
 } from "helpers/selectors";
 import { setInterview } from "helpers/reducers";
// Components
import Loading from "./Loading";
import Panel from "./Panel";

//
// ----- Fake Data -----
//
const data = [
  {
    id: 1,
    label: "Total Interviews",
    getValue: getTotalInterviews,
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    getValue:getLeastPopularTimeSlot,
  },
  {
    id: 3,
    label: "Most Popular Day",
    getValue: getMostPopularDay,
  },
  {
    id: 4,
    label: "Interviews Per Day",
    getValue: getInterviewsPerDay,
  },
];

//
// ----- <Dashboard /> -----
//
class Dashboard extends Component {
  state = {
    loading: true,
    // Set null to states that will change LATER but necessary for component
    focused: null,
    // States for the API data
    days: [],
    appointments: {},
    interviewers: {},
  };
  
  // 
  // ----- LocalStorage & API reqs on Initial Mount -----
  // 
  componentDidMount() {
    // check local storage if we have a key:val of "focused"
    const focused = JSON.parse(localStorage.getItem("focused"));
    // if truthy, set state as stored value, else keep it null as we've established
    if (focused) {
      this.setState({focused});
    }

    // 
    // ----- Axios GETs for initial data load -----
    // 
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ])
    .then(( [days, appointments, interviewers] ) => { 
      this.setState({
        loading: false,
        days: days.data,
        appointments: appointments.data,
        interviewers: interviewers.data
      });
    });

    
    // 
    // ----- WebSocket -----
    // 
    this.socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    // For when client makes interview object, listen to that data from dashboard
    this.socket.onmessage = (event) => {
      // Need to parse the incoming socket data (check on network tab)
      const data = JSON.parse(event.data)
      
      if (typeof data === "object" && data.type === "SET_INTERVIEW") {
        this.setState((prevState) => 
          setInterview(prevState, data.id, data.interview)
        );
      }
    }


  }

  // Whenever re-render from ANY state change...
  componentDidUpdate(prevProps, prevState) {
    // if the FOCUSED state changed... (this line checks to ignore other state changes)
    if (prevState.focused !== this.state.focused) {
      // set it as key:val to our localStorage, can use it next time as initial focused state
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }
  // CleanUp lifecycle
  componentWillUnmount() {
    // closing socket
    this.socket.close();
  }

  // 
  // ----- setState Functions -----
  // 

  // Without the arrow function, "this" here refers to "selectPanel" itself (funcs are objects!)
  selectPanel(id) {
    this.setState(previousState => ({
      focused: previousState.focused !== null ? null : id
    }))
  }

  


  render() {
    const dashboardClasses = classnames("dashboard", {
      "dashboard--focused": this.state.focused,
    });

    // Only render when Loading ( probably during data fetching? )
    if (this.state.loading) {
      return <Loading />;
    }

    // Mapping each panel children from fake data
    const panels =
      // Before rendering a <Panel />, check focused state => focused will take id of a panel
      (
        this.state.focused
          ? // if focused truthy, filter from the array the panel with matching ID, else all of them
            data.filter(( panel ) => this.state.focused === panel.id )
          : data
      ).map(( panel ) => {
        // THEN render the <Panel /> with that panel properties
        return (
          <Panel 
            key={ panel.id } 
            label={ panel.label }
            value={ panel.getValue(this.state) } 
            //  This arrow syntax here fixes the binding problem for 'selectPanel'
            onSelect={ () => this.selectPanel(panel.id) }
          />
        );
      });

    return <main className={dashboardClasses}>{panels}</main>;
  }
}

export default Dashboard;
