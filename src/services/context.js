import { createContext, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { Orbis } from "@orbisclub/orbis-sdk";
import moment from "moment-timezone";
import { v4 as uuidv4 } from "uuid";

import CONVERSATION_MESSAGES from "data/conversation";
import Profile1 from "assets/img/team/profile-picture-1.jpg"
import Profile2 from "assets/img/team/profile-picture-2.jpg"
import MESSAGES_DATA from "data/messages";

// import { providers } from "ethers";
import { Routes } from "routes";
  
const OrbisContext = createContext(undefined);

const OrbisProvider = ({ children }) => {
    let orbis = new Orbis();
    let history = useHistory();
    const [user, setUser] = useState();
    const [messages, setMessages] = useState(MESSAGES_DATA);
    const [conversation, setConversation] = useState(CONVERSATION_MESSAGES);

    /** Calls the Orbis SDK and handle the results */
	const connect = async () => {
        let res = await orbis.connect();
        if(res.status == 200) {
            setUser(res.did);
            // TODO: add isLoading state variable.
            history.push(Routes.DashboardOverview.path);
        } else {
            console.log("Error connecting to Ceramic: ", res);
            alert("Error connecting to Ceramic.");
        }
    };

    return (
        <OrbisContext.Provider
            value={{
                orbis,
                connect,
                user,
                setUser,
                messages,
                setMessages,
                conversation,
                setConversation
            }}
        >
            {children}
        </OrbisContext.Provider>
    );
}

const useOrbis = () => {
    const context = useContext(OrbisContext);
    if (context === undefined) {
      throw new Error('useOrbis must be used within a OrbisProvider');
    }
    return context;
};

export { OrbisProvider, useOrbis };