import React, { Component } from "react";
// Libraries
import classnames from "classnames";
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
    value: 6,
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    value: "1pm",
  },
  {
    id: 3,
    label: "Most Popular Day",
    value: "Wednesday",
  },
  {
    id: 4,
    label: "Interviews Per Day",
    value: "2.3",
  },
];

//
// ----- <Dashboard /> -----
//
class Dashboard extends Component {
  state = {
    loading: false,
    // Set null to states that will change LATER but necessary for component
    focused: null,
  };
  
  // 
  // ----- LocalStorage for INITIAL state on component mount -----
  // 
  componentDidMount() {
    // check local storage if we have a key:val of "focused"
    const focused = JSON.parse(localStorage.getItem("focused"));
    // if truthy, set state as stored value, else keep it null as we've established
    if (focused) {
      this.setState({focused});
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
            data.filter((panel) => this.state.focused === panel.id)
          : data
      ).map((panel) => {
        // THEN render the <Panel /> with that panel properties
        return (
          <Panel 
            key={panel.id} 
            {...panel} 
            //  This arrow syntax here fixes the binding problem for 'selectPanel'
            onSelect={event => this.selectPanel(panel.id)} 
          />
        );
      });

    return <main className={dashboardClasses}>{panels}</main>;
  }
}

export default Dashboard;
