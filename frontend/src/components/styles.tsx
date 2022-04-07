import Styled from 'styled-components'

export const SelectorAppContainer = Styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
`

export const SelectorAppButtonsContainer = Styled.section`
    display: flex;
    flex-direction: row;
    
    /* height: 100%; */
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

export const SelectorAppButtons = Styled.div`
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
    color: #ffe0d6;
    border-radius: 4px;
    box-shadow: 0px 0px 10px #888888;
    
    transition: filter 0.2s, transform 0.2s, color 0.2s;
    cursor: default;
    
    &:hover{
        filter: brightness(0.9);
        transform: scale(1.05);
        color: #000;
        cursor: pointer;
        
        background-color: transparent;
        border: 2px solid #8585c8cc;
    }
`

export const SelectorAppTitle = Styled.span`
    font-weight: bold;
    font-size: 2rem;
    color: #122;
    text-align: center;
    padding: 8px;
`