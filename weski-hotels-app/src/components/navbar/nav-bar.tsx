import React from "react";
import "./nav-bar.scss";
import WeSkiLogo from "../weski-logo/weski-logo";
import SearchForm from "../search-form/search-form";
import { SearchParams } from "../../types";

interface Props {
    onSearch: (params: SearchParams) => void;
}

const NavBar: React.FC<Props> = ({ onSearch }) => {
    return (
        <div className="nav-bar">
            <WeSkiLogo />
            <SearchForm onSearch={onSearch} />
        </div>
    );
}

export default NavBar;