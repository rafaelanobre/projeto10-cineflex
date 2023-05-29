import styled from "styled-components"
import HomePage from "./pages/HomePage/HomePage"
import SeatsPage from "./pages/SeatsPage/SeatsPage"
import SessionsPage from "./pages/SessionsPage/SessionsPage"
import SuccessPage from "./pages/SuccessPage/SuccessPage"
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom"
import backArrow from "./assets/backarrow.svg"

export default function App() {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    return (
        <>
            <NavContainer>
            {pathname !== "/" ? (
                <img src={backArrow} data-test="go-home-header-btn" onClick={() => navigate(-1)} />
            ) : null}
                CINEFLEX
            </NavContainer>

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/sessoes/:idFilme" element={<SessionsPage />} />
                <Route path="/assentos/:idSessao" element={<SeatsPage />} />
                <Route path="/sucesso" element={<SuccessPage />} />
            </Routes>
        </>
    )
}

const NavContainer = styled.div`
    width: 100%;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #C3CFD9;
    color: #E8833A;
    font-family: 'Roboto', sans-serif;
    font-size: 34px;
    position: fixed;
    top: 0;
    a {
        text-decoration: none;
        color: #E8833A;
    }
    img{
        position: fixed;
        left: 25px;
        top: 25px;
        width: 24px;
        cursor: pointer;
    }
`
