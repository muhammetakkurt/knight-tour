import React, { useEffect, useState } from "react";

const Cell = (props) => {
  const [nameState, setNameState] = useState("");

  useEffect(() => {
    if (props.children !== -1) {
      setTimeout(() => {
        setNameState(props.children);
      }, 500);
    } else {
      setNameState("");
    }
  }, [props.children]);

  return (
    <button {...props}>
      {props.children !== -1 && nameState === "" ? (
        <span className="text-7xl">♞</span>
      ) : (
        nameState
      )}
    </button>
  );
};

export default React.memo(Cell);
