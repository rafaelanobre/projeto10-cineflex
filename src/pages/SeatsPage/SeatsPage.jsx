import styled, { css } from 'styled-components';
import React,{ useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import loading from '../../assets/loading.gif';
import axios from "axios";

export default function SeatsPage() {
    const [seats, setSeats] = useState(undefined);
    const [mySeats, setMySeats] = useState([]);
    const [name, setName] = useState("");
    const [cpf, setCpf] = useState("");

    const parametros = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        console.log(mySeats);
    }, [mySeats]);

    useEffect(() => {
        const URL = `https://mock-api.driven.com.br/api/v8/cineflex/showtimes/${parametros.idSessao}/seats`;

        const promise = axios.get(URL);

        promise.then((resposta) =>{
            setSeats(resposta.data);
            console.log(resposta.data);
        });

        promise.catch((erro) =>{
            console.log(erro.response.data);
        });
    }, []);

    function selectSeats(available, isSelected, seat) {
        if (available === false) {
            alert("Esse assento não está disponível.");
        } else {
            if (available === true && isSelected === true) {
                setMySeats(prevSeats => prevSeats.filter(prevSeat => prevSeat.id !== seat.id));
            }
            if (available === true && isSelected === false) {
                setMySeats(prevSeats => [...prevSeats, seat]);
            }
        }
    }


    const cpfMask = (value) => {
        return value
          .replace(/\D/g, "") // substitui qualquer caracter que nao seja numero por nada
          .replace(/(\d{3})(\d)/, "$1.$2") // captura 2 grupos de numero o primeiro de 3 e o segundo de 1, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})/, "$1-$2")
          .replace(/(-\d{2})\d+?$/, "$1"); // captura 2 numeros seguidos de um traço e não deixa ser digitado mais nada
    };

    function reserveTickets(e){
        e.preventDefault();

        if (mySeats.length === 0){
            alert("Escolha seus assentos primeiro");
        }
        else{
            const reserve = {
                ids: mySeats.map(seat => seat.id),
                name: name,
                cpf: cpf
            }

            const reserveInfo = {
                movie: seats.movie.title,
                day: seats.day.date,
                hour: seats.name,
                seats: mySeats.map(seat => seat.name),
                cpf,
                name,
            };

            const URL2 = "https://mock-api.driven.com.br/api/v8/cineflex/seats/book-many";

            const promise2 = axios.post(URL2, reserve);

            promise2.then((resposta) =>{
                console.log(resposta.data);
                navigate(`/sucesso`, { state: { reserveInfo } });
            });

            promise2.catch((erro) =>{
                console.log(erro.response.data);
            });
        }
    }

    if(seats === undefined){
        return(
            <LoadingDiv>
                <img src={loading}></img>
            </LoadingDiv>
        )
    }

    return (
        <PageContainer>
            Selecione o(s) assento(s)

            <SeatsContainer>
            {seats.seats.map(seat => (
                <SeatItem
                    className={seat.isAvailable}
                    key={seat.id}
                    data-test="seat"
                    isSelected={mySeats.includes(seat)}
                    onClick={() => selectSeats(seat.isAvailable, mySeats.includes(seat), seat)}
                >{seat.name}</SeatItem>
                ))}
            </SeatsContainer>

            <CaptionContainer>
                <CaptionItem>
                    <CaptionCircle className="selected"  />
                    Selecionado
                </CaptionItem>
                <CaptionItem>
                    <CaptionCircle className="true" />
                    Disponível
                </CaptionItem>
                <CaptionItem>
                    <CaptionCircle className="false" />
                    Indisponível
                </CaptionItem>
            </CaptionContainer>

            <FormContainer onSubmit={reserveTickets}>
                <label htmlFor="name">Nome do Comprador:</label>
                <input
                placeholder="Digite seu nome..."
                id='name'
                data-test="client-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                />

                <label htmlFor="cpf">CPF do Comprador:</label>
                <input
                placeholder="Digite seu CPF..."
                id='cpf'
                data-test="client-cpf"
                required
                value={cpfMask(cpf)}
                maxLength='14'
                onChange={(e) => setCpf(e.target.value)}
                />

                <button type="submit" data-test="book-seat-btn">Reservar Assento(s)</button>
            </FormContainer>

            <FooterContainer data-test="footer">
                <div>
                    <img src={seats.movie.posterURL} alt="poster" />
                </div>
                <div>
                    <p>{seats.movie.title}</p>
                    <p>{seats.day.weekday} - {seats.name}</p>
                </div>
            </FooterContainer>

        </PageContainer>
    )
}

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Roboto';
    font-size: 24px;
    text-align: center;
    color: #293845;
    margin-top: 30px;
    padding-bottom: 120px;
    padding-top: 70px;
`
const SeatsContainer = styled.div`
    width: 330px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
`
const FormContainer = styled.form`
    width: calc(100vw - 40px); 
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 20px 0;
    font-size: 18px;
    button {
        margin-top: 20px;
        align-self: center;
        font-size: 18px;
        padding: 15px;
        padding-left: 35px;
        padding-right: 35px;
        color: #FFFFFF;
        background-color: #E8833A;
        border: none;
        border-radius: 3px;
        cursor: pointer;
    }
    input {
        width: calc(100vw - 60px);
        border: 1px solid #D5D5D5;
        border-radius: 3px;
        padding-left: 10px;
        padding: 15px;
        margin-top: 10px;
        margin-bottom: 15px;

        &::placeholder {
            color: #AFAFAF;
            font-size: 18px;
        }
    }
`
const CaptionContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 300px;
    justify-content: space-between;
    margin: 20px;
`
const CaptionCircle = styled.div`
    border: 1px solid blue;         // Essa cor deve mudar
    background-color: lightblue;    // Essa cor deve mudar
    height: 25px;
    width: 25px;
    border-radius: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 3px;

    ${props =>
    props.className === "true" &&
    css`
        background: #C3CFD9;
        border: 1px solid #7B8B99;
    `}

    ${props =>
    props.className === "false" &&
    css`
        background: #FBE192;
        border: 1px solid #F7C52B;
    `}

    ${props =>
    props.className === 'selected' &&
    css`
        background: #1AAE9E;
        border: 1px solid #0E7D71;
    `}
`
const CaptionItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 12px;
    color: #4E5A65;
`
const SeatItem = styled.div`
    border: 1px solid blue;         // Essa cor deve mudar
    background-color: lightblue;    // Essa cor deve mudar
    height: 25px;
    width: 25px;
    border-radius: 25px;
    font-family: 'Roboto';
    font-size: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 3px;
    cursor: pointer;

    ${props =>
    props.className === true &&
    css`
        background: #C3CFD9;
        border: 1px solid #7B8B99;
    `}

    ${props =>
    props.className === false &&
    css`
        background: #FBE192;
        border: 1px solid #F7C52B;
    `}

    ${props =>
    props.isSelected &&
    css`
        background: #1AAE9E;
        border: 1px solid #0E7D71;
    `}
`
const FooterContainer = styled.div`
    width: 100%;
    height: 120px;
    background-color: #C3CFD9;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 20px;
    position: fixed;
    bottom: 0;

    div:nth-child(1) {
        box-shadow: 0px 2px 4px 2px #0000001A;
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: white;
        margin: 12px;
        img {
            width: 50px;
            height: 70px;
            padding: 8px;
        }
    }

    div:nth-child(2) {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        p {
            text-align: left;
            &:nth-child(2) {
                margin-top: 10px;
            }
        }
    }
`
const LoadingDiv = styled.div`
    padding-top: 10%;
    width:100%;
    display: flex;
    align-items: center;
    justify-content: center;
    img{
        width: 200px;
    }
`