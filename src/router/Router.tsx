import React from 'react';
import {
  Router as BaseRouter, Switch, Route,
} from 'react-router-dom';
import routerPath from '@/router/router-path';
import User from '@/pages/User';
import Login from '@/pages/Login';
import { NeedLoginRoute } from './NeedLoginRoute';
import NotFind from '@/pages/NotFind';
import { LoginPartRoute } from '@/router/LoginPartRoute';
import Question from '@/pages/Question';
import Home from '@/pages/Home';
import CarFixForm from '@/pages/CarFixForm';
import InfoReport from '@/pages/InfoReport';
import QualityClaims from '@/pages/QualityClaims';
import Quotation from '@/pages/Quotation';
import ServiceCheck from '@/pages/ServiceCheck';
import ServiceDelegation from '@/pages/ServiceDelegation';
import ServiceReport from '@/pages/ServiceReport';
import NoAuth from '@/pages/NoAuth';
import getHistory from '@/utils/getHistory';

const Router: React.FC = () => {
  const history = getHistory;
  return (
    <BaseRouter history={history}>
      <Switch>
        <LoginPartRoute path={routerPath.Login} exact component={Login} />
        <NeedLoginRoute path={routerPath.Home} exact component={Home} />
        <NeedLoginRoute path={routerPath.User} exact component={User} />
        <NeedLoginRoute path={routerPath.Question} exact component={Question} />
        <NeedLoginRoute path={routerPath.CarFixForm} exact component={CarFixForm} />
        <NeedLoginRoute path={routerPath.InfoReport} exact component={InfoReport} />
        <NeedLoginRoute path={routerPath.QualityClaims} exact component={QualityClaims} />
        <NeedLoginRoute path={routerPath.Quotation} exact component={Quotation} />
        <NeedLoginRoute path={routerPath.ServiceCheck} exact component={ServiceCheck} />
        <NeedLoginRoute path={routerPath.ServiceDelegation} exact component={ServiceDelegation} />
        <NeedLoginRoute path={routerPath.ServiceReport} exact component={ServiceReport} />
        <Route path={routerPath.NoAuth} exact component={NoAuth} />
        <Route path="*" exact component={NotFind} />
      </Switch>
    </BaseRouter>
  );
};

export default Router;
