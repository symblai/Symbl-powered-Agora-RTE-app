import React, {useContext} from 'react';
import {Route, Redirect} from './Router';
import StorageContext from './StorageContext';

import type {RouteProps} from 'react-router';

interface PrivateRouteProps extends RouteProps {
  failureRedirectTo: string;
  redirectProps?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = (props) => {
  const {store} = useContext(StorageContext);
  return (
    <>
      {store.token === null ? (
        <Redirect to={props.failureRedirectTo} {...props.redirectProps} />
      ) : (
        <Route {...props}>{props.children}</Route>
      )}
    </>
  );
};

export default PrivateRoute;
