import React from "react";

// 
// ----- <Panel /> -----
// 
class Panel extends React.Component{ 
  
  render() {
  
    // From <Dashboard /> during mapping of each <Panel /> (probably)
    const {id, label, value, onSelect} = this.props;

    return (
      <section
        className="dashboard__panel"
        onClick={(event) => onSelect(id)}
      >
        <h1 className="dashboard__panel-header">{label}</h1>
        <p className="dashboard__panel-value">{value}</p>
      </section>
    );
  }
}

export default Panel;