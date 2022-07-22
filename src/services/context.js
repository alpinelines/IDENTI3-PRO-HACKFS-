import { createContext, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { Orbis } from "@orbisclub/orbis-sdk";
// import { providers } from "ethers";
import { Routes } from "routes";
  
const OrbisContext = createContext(undefined);

const OrbisProvider = ({ children }) => {
    /**
     * Initialize the Orbis class object:
     * You can make this object available on other components by passing it as
     * a prop or by using a context.
     */
    let orbis = new Orbis();
    let history = useHistory();
    const [user, setUser] = useState();
    const [inbox, setInbox] = useState();

    /** Calls the Orbis SDK and handle the results */
	async function connect() {
        let res = await orbis.connect();
        /** Check if connection is successful or not */
        if(res.status == 200) {
            setUser(res.did);
            history.push(Routes.DashboardOverview.path);
        } else {
            console.log("Error connecting to Ceramic: ", res);
            alert("Error connecting to Ceramic.");
        }
      }

    return (
        <OrbisContext.Provider
            value={{
                orbis,
                user,
                setUser,
                inbox,
                connect
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