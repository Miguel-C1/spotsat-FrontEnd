import styled from 'styled-components';

export const Section = styled.section`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f4f7fb;
    padding: 20px;
`;

export const Title = styled.h1`
    font-size: 2rem;
    color: #333;
    margin-bottom: 20px;
`;

export const ErrorMessage = styled.p`
    color: #dc3545;
    background-color: #f8d7da;
    padding: 10px;
    border: 1px solid #f5c6cb;
    border-radius: 5px;
    width: 100%;
    max-width: 400px;
    text-align: center;
    margin-bottom: 20px;
`;

export const Offscreen = styled.div`
    display: none;
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
    max-width: 400px;
    background-color: #ffffff;
    padding: 25px;
    border-radius: 8px;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
`;

export const Label = styled.label`
    font-size: 1rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 5px;
`;

export const Input = styled.input`
    padding: 12px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-sizing: border-box;
    margin-bottom: 15px;
    transition: border-color 0.3s ease;
    
    &:focus {
        border-color: #007bff;
        outline: none;
    }
`;

export const Button = styled.button`
    background-color: #0fc77a;
    color: white;
    padding: 12px;
    font-size: 1rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s ease;

    &:hover {
        background-color: #206d4d;
        transform: translateY(-2px);
    }

    &:active {
        background-color: #155f39;
        transform: translateY(1px);
    }
`;

// Estilos responsivos
export const MediaQuery = styled.div`
    @media (max-width: 768px) {
        section {
            padding: 15px;
        }

        form {
            width: 100%;
            max-width: 100%;
        }

        h1 {
            font-size: 1.5rem;
        }

        input[type="text"],
        input[type="password"] {
            font-size: 0.95rem;
        }

        button {
            font-size: 0.95rem;
        }
    }
`;
