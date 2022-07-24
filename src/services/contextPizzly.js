import { createContext, useContext, useState} from 'react'
import Pizzly from 'pizzly-js';
import axios from 'axios'
import { useHistory } from "react-router-dom"; // Use for HashRouter 

// import { providers } from "ethers";
import { Routes } from "routes";

// https://reactjs.org/docs/context.html#api
const PizzlyContext = createContext(undefined);

const PizzlyProvider = ({ children }) => {
    let pizzly = new Pizzly({host: 'https://hackfs-oauth.herokuapp.com/'});
    let history = useHistory();
    
    const [loading, setLoading] = useState(false);
    const [authId, setAuthId] = useState('');
    
    
    // const [messageText, setMessageText] = useState("");
    
    /** Calls the Orbis SDK and handle the results */
    const myDiscordAPI = pizzly.integration('discord');
    
    const connect = () => {

        myDiscordAPI
            .connect()
            .then(({authId}) => {
                console.log('Sucessfully connected!', authId);
                setAuthId(authId);
            })
            .catch((err)=> {
                console.error(err);
                alert('Error connecting to Discord');
            });


    };

    // Api Call 1
    const fetchProfile = async () => {
            await myDiscordAPI
                .auth(authId)
                .get('/users/@me')
                .then((response) => response.json())
                .then((json) => console.log(json));

    };


    return (
        <PizzlyContext.Provider
            value={{
                pizzly,
                authId,
                connect,
                fetchProfile
            }}
        >
            {children}
        </PizzlyContext.Provider>
    );
};

const usePizzly = () => {
    const context = useContext(PizzlyContext);
    if (context === undefined) {
      throw new Error('usePizzly must be used within a PizzlyProvider');
    }
    return context;
};

export { PizzlyProvider, usePizzly };