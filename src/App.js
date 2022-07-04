import { Fragment, Suspense } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { routes, redirects } from "./configs/routes";
import MainLayout from "./layout/MainLayout";
function App() {
  const resolveRoutes = () => {
    return (
      <Fragment>
        {
          <MainLayout>
            <Switch>
              {routes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  exact={route.exact === true}
                  render={(props) => {
                    return (
                      <Suspense fallback={null}>
                        <route.component {...props} />
                      </Suspense>
                    );
                  }}
                />
              ))}
              <Redirect to={"/dashboard"}/>
            </Switch>
          </MainLayout>
        }
        {redirects.map((route) => {
          <Route
            key={route.path}
            path={route.path}
            exact={route.exact === true}
          >
            <Redirect to={route.to} />
          </Route>;
        })}
      </Fragment>
    );
  };
  return (
    <Router>
      <Switch>{resolveRoutes()}</Switch>
    </Router>
  );
}

export default App;
