import React, { Component, lazy } from "react";
import ReactDOM from 'react-dom/client';
import './index.scss'
import reportWebVitals from './reportWebVitals';
import { Provider } from "react-redux";
import Store from "./ReduxToolkit/Store";
import { unstable_batchedUpdates } from "react-dom";

// Lazy load the App component
const App = lazy(() => import("./App"));

interface Props {
  children: React.ReactNode;
}
unstable_batchedUpdates(() => {
  console.error = () => {};
});

class ErrorBoundary extends Component<Props> {
  componentDidCatch(error: { message: string | string[]; }) {
    if (error.message.includes("ToastContainer")) {
      return;
    }
  }

  render() {
    return this.props.children;
  }
}
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <ErrorBoundary>
    <Provider store={Store}>
        <App />
    </Provider>
  </ErrorBoundary>
);



// Log web vitals to the console
reportWebVitals(console.log);

