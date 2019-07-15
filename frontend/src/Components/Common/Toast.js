import { ToastsContainer, ToastsStore } from "react-toasts";
import React from "react";

const Toast = () => {
  return (
    <div>
      <button onClick={() => ToastsStore.success("Succesfully Logged In!")}>
        Click me
      </button>
      <ToastsContainer store={ToastsStore} />
    </div>
  );
};
export default Toast;
