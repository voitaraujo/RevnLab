import Styled from 'styled-components'

export const SelectorContainer = Styled.div`
    display: flex;
    flex-direction: row;
    
    height: 100%;
    width: 100%;
    
    background-color: rgba(255,255,255,0.2);
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    
    @media (max-width: 700px) {
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
`

export const AppButtons = Styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    
    width: 200px;
    height: 200px;
    margin: 8px;
    padding: 8px;
    
    font-family: sans-serif;
    border: none;
    background-color: #8585c8cc;
    border-radius: 4px;
    box-shadow: 0px 0px 10px #888888;
    
    transition: filter 0.2s;
    transition: transform 0.2s;
    cursor: default;
    
    &:hover{
        cursor: pointer;
        filter: brightness(0.9);
        transform: scale(1.05);
        background-color: transparent;
        border: 2px solid #8585c8cc;
    }
`