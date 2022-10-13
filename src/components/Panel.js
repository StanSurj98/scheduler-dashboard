import React from "react";

// 
// ----- <Panel /> -----
// 
class Panel extends React.Component{ 
  
  render() {
  
    // From <Dashboard /> during mapping of each <Panel /> (probably)
    const {label, value} = this.props;

    return (
      <section
        className="dashboard__panel"
      >
        <h1 className="dashboard__panel-header">{label}</h1>
        <p className="dashboard__panel-value">{value}</p>
      </section>
    );
  }
}

export default Panel;