import React from "react";

// 
// ----- <Panel /> -----
// 
class Panel extends React.Component{ 
  
  render() {
  
    // From <Dashboard /> during mapping of each <Panel /> (probably)
    const { label, value, onSelect } = this.props;

    return (
      <section
        className="dashboard__panel"
        // since our parent now uses inline arrow func for onSelect, just pass reference here
        onClick={onSelect}
      >
        <h1 className="dashboard__panel-header">{label}</h1>
        <p className="dashboard__panel-value">{value}</p>
      </section>
    );
  }
}

export default Panel;