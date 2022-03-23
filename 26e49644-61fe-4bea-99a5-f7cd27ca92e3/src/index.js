import React, { useState } from "react";
import ReactDOM from "react-dom";

const App = () => {
  const [num, setNum] = useState(0); return ( <div> <p>{num}</p> <button onClick={() => setNum(num + 1)}>click me</button> </div> );
};

export const init = () => {
  ReactDOM.render(<App />, document.querySelector("[data-app]"));
};

init();
