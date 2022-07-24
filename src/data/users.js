
import { v4 as uuidv4 } from "uuid";
import moment from "moment-timezone";

import Profile1 from "assets/img/team/profile-picture-1.jpg"
import Profile2 from "assets/img/team/profile-picture-2.jpg"
import Profile3 from "assets/img/team/profile-picture-3.jpg"
import Profile4 from "assets/img/team/profile-picture-4.jpg"

export default [
    {
        "id": uuidv4(),
        "image": Profile1,
        "verified": true,
        "status": "active",
        "name": "Roy Fendley",
        "email": "did:pkh:eip155:137:0x6ab7cd21c2387db6c4989fe88a3d242ec243f620",
        "dateCreated": moment().format("DD MMM YYYY"),
    },
    {
        "id": uuidv4(),
        "image": Profile3,
        "verified": true,
        "status": "active",
        "name": "Bonnie Green",
        "email": "did:pkh:eip155:137:0x6ab7cd21c2387db6c4989fe88a3d242ec243f620",
        "dateCreated": moment().subtract(2, "days").format("DD MMM YYYY"),
    },
    {
        "id": uuidv4(),
        "verified": true,
        "status": "active",
        "name": "Scott Anderson",
        "email": "did:pkh:eip155:137:0x6ab7cd21c2387db6c4989fe88a3d242ec243f620",
        "dateCreated": moment().subtract(2, "days").format("DD MMM YYYY"),
    },
    {
        "id": uuidv4(),
        "verified": true,
        "status": "active",
        "image": Profile4,
        "name": "Ronnie Buchanan",
        "email": "did:pkh:eip155:137:0x6ab7cd21c2387db6c4989fe88a3d242ec243f620",
        "dateCreated": moment().subtract(3, "days").format("DD MMM YYYY"),
    },
    {
        "id": uuidv4(),
        "verified": false,
        "status": "sharing",
        "image": Profile3,
        "name": "Jane Rinehart",
        "email": "did:pkh:eip155:137:0x6ab7cd21c2387db6c4989fe88a3d242ec243f620",
        "dateCreated": moment().subtract(4, "days").format("DD MMM YYYY"),
    },
    {
        "id": uuidv4(),
        "verified": false,
        "status": "pending",
        "name": "William Ginther",
        "email": "did:pkh:eip155:137:0x6ab7cd21c2387db6c4989fe88a3d242ec243f620",
        "dateCreated": moment().subtract(5, "days").format("DD MMM YYYY"),
    },
    {
        "id": uuidv4(),
        "image": Profile2,
        "verified": false,
        "status": "pending",
        "name": "George Driskell",
        "email": "did:pkh:eip155:137:0x6ab7cd21c2387db6c4989fe88a3d242ec243f620",
        "dateCreated": moment().subtract(5, "days").format("DD MMM YYYY"),
    },
    {
        "id": uuidv4(),
        "image": Profile4,
        "verified": false,
        "status": "suspended",
        "name": "Ronnie Buchanan",
        "email": "did:pkh:eip155:137:0x6ab7cd21c2387db6c4989fe88a3d242ec243f620",
        "dateCreated": moment().subtract(5, "days").format("DD MMM YYYY"),
    },
    {
        "id": uuidv4(),
        "verified": false,
        "status": "suspended",
        "name": "Jane Rinehart",
        "email": "did:pkh:eip155:137:0x6ab7cd21c2387db6c4989fe88a3d242ec243f620",
        "dateCreated": moment().subtract(6, "days").format("DD MMM YYYY"),
    }
]