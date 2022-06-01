// @ts-nocheck
import React from "react";
import { Routes, Route} from 'react-router-dom';
import Erro from "./pages/Erro";
import NotFound from "./pages/NotFound";
import Administrador from "./pages/Administrador";
import Home from "./pages/Home";
import Login from "./pages/Login.js";
import Feed from "./pages/Feed.js";
import User from "./pages/User.js";
// eslint-disable-next-line import/no-anonymous-default-export
export default () => {    
    return (
        <Routes >            
            <Route exact path={`/home`} element={<Home />} />            
            <Route exact path={`/Login`} element={<Login />} />
            <Route exact path={`/feed`} element={<Feed />} />
            <Route exact path={`/user`} element={<User />} />
            <Route exact path={`/erro`} element={<Erro />} />
            <Route exact path={`/admingpco`} element={<Administrador />} />
            <Route exact path={'/erro'} element={<Erro />} />
            <Route exact path={`:uuid/*`} element={<NotFound />} />
            <Route exact index element={<div><Home /></div>} />
        </Routes>
    );
}
