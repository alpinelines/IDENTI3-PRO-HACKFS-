
import React from "react";
import { v4 as uuidv4 } from "uuid";
import { BookOpenIcon, CalendarIcon, DeviceMobileIcon, LightBulbIcon, MapIcon, PhotographIcon } from "@heroicons/react/solid";

import { AccessibilityIcon, BootstrapIcon, GulpIcon, Html5Icon, ReactIcon, SassIcon } from "components/BrandIcons";


export default [
    {
        "id": uuidv4(),
        "title": "Import",
        "icon": <ReactIcon size="md" color="gray-500" className="mb-3" />,
        "description": "The most popular front-end library in the world"
    },
    {
        "id": uuidv4(),
        "title": "Encrypt",
        "icon": <BootstrapIcon size="md" color="gray-500" className="mb-3" />,
        "description": "Built with the most popular CSS Framework"
    },
    {
        "id": uuidv4(),
        "title": "Decrypt",
        "icon": <SassIcon size="md" color="gray-500" className="mb-3" />,
        "description": "Variables and mixins to empower development"
    },
    {
        "id": uuidv4(),
        "title": "Export",
        "icon": <DeviceMobileIcon className="icon icon-md text-gray-500 mb-3" />,
        "description": "All pages and components are 100% responsive"
    },
    {
        "id": uuidv4(),
        "title": "Send",
        "icon": <GulpIcon size="md" color="gray-500" className="mb-3" />,
        "description": "Gulp & BrowserSync for a flawless workflow"
    },
    {
        "id": uuidv4(),
        "title": "Grant Access",
        "icon": <PhotographIcon className="icon icon-md text-gray-500 mb-3" />,
        "description": "All images, icons and fonts are licensed & free to use"
    },
    {
        "id": uuidv4(),
        "title": "Recieve",
        "icon": <BookOpenIcon className="icon icon-md text-gray-500 mb-3" />,
        "description": "Everything that comes with Rocket is well documented"
    },
    {
        "id": uuidv4(),
        "title": "Message",
        "icon": <AccessibilityIcon size="md" color="gray-500" className="mb-3" />,
        "description": "Accessibility oriented design and functionality"
    },
    {
        "id": uuidv4(),
        "title": "Sign-in",
        "icon": <Html5Icon size="md" color="gray-500" className="mb-3" />,
        "description": "HTML pages are all valid by W3C Standards"
    },
    {
        "id": uuidv4(),
        "title": "Utilize",
        "icon": <CalendarIcon className="icon icon-md text-gray-500 mb-3" />,
        "description": "Advanced integration with FullCalendar.js"
    },
    {
        "id": uuidv4(),
        "title": "Mapbox",
        "icon": <MapIcon className="icon icon-md text-gray-500 mb-3" />,
        "description": "Custom integration with markers and cards"
    },
    {
        "id": uuidv4(),
        "title": "Design",
        "icon": <LightBulbIcon className="icon icon-md text-gray-500 mb-3" />,
        "description": "Crafted by professional UI/UX designers"
    }
];