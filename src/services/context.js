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

    const [loading, setLoading] = useState(false);

    const [user, setUser] = useState(undefined);
    const [messages, setMessages] = useState(MESSAGES_DATA);
    const [conversation, setConversation] = useState(CONVERSATION_MESSAGES);
    const [body, setBody] = useState("");
    // const [messageText, setMessageText] = useState("");

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

    const messageService = {
        messages,
        setMessages,
        conversation,
        setConversation,
        body,
        setBody,
        /** We are calling the Orbis SDK to share a new post from this user */
        createConversation: async (recipients) => {
            setLoading(true);

            /**
             * The createConversation() function accept a JSON object that must contain a 'recipients' object
             * which is an array containing all of the 'dids' that will be part of the conversation. The sender's
             * 'did' will be added automatically.
            */
            let res = await orbis.createConversation({recipients: [recipients]});

            /** Check if conversation was created with success or not */
            if(res.status == 200) {
                console.log("Save this conversation_id to use in the following examples: ", res.doc);
                alert("Save this conversation_id to use in the following examples: " + res.doc);
                setConversation(res.doc);
            } else {
                console.error("Error creating conversation: ", res);
                alert("Error creating conversation.");
            }

            setLoading(false);
        },
        /** We are calling the Orbis SDK to share a new post from this user */
        send: async (message) => {
            setLoading(true);

            /**
             * The sendMessage() function accept a JSON object that must contain the 'conversation_id'
             * and 'body' key.
             */
            let res = await orbis.sendMessage({conversation_id: conversation, body: message});

            /** Check if conversation was created with success or not */
            if(res.status == 200) {
                alert("Message sent!");
                console.log("Message sent with stream_id: ", res.doc);
                setLoading(false);
                // setMessage("");
            } else {
                console.error("Error sending message: ", res);
                alert("Error sending sending. You might need to refresh the page.");
            }
            
            setLoading(false);
        },
        /** Query our API to load the messages */
        loadMessages: async () => {
            setLoading(true);

            let { data, error, status } = await orbis.getMessages(conversation);

            if(data) {
                setMessages(data);
                setLoading(false);
            } else if (error) {
                console.error(`Error #${status}`);
            }
            
            setLoading(false);
        },
        /**
         * Because the messages sent using Orbis are encrypted we need to decrypt it
         * before displaying the content on the screen.
         */
        decryptMessage: async (message) => {
            let res = await orbis.decryptMessage(message.content);
            setBody(res.result);
        }
    };

    return (
        <OrbisContext.Provider
            value={{
                orbis,
                connect,
                user,
                setUser,
                loading,
                setLoading,
                messages,
                setMessages,
                conversation,
                setConversation,
                body,
                messageService
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