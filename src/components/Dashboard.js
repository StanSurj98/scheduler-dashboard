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

  // Without the arrow function, "this" here refers to "selectPanel" itself (funcs are objects!)
  selectPanel(id) {
    // "this.setState" -> "access the property called 'setState' of this object called selectPanel"
    this.setState({
     focused: id
    });
  }
  // Since this would return undefined, we must use fat arrow syntax in our RENDER


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
