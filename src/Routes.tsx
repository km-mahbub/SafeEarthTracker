import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Header } from "./Header";
import { Home } from "./pages/Home";

export const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
        </Switch>
      </div>
    </BrowserRouter>
  );
};
