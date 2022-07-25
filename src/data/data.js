
import moment from "moment-timezone";

export default [
    {
        "dataHash": 300500,
        "status": "paid",
        "dataInfo": "User Profile Information",
        "endpoint": "/users/:user-id",
        "issueDate": moment().subtract(1, "days").format("DD MMM YYYY"),
        "dueDate": moment().subtract(1, "days").add(1, "month").format("DD MMM YYYY")
    },
    {
        "dataHash": 300499,
        "status": "paid",
        "dataInfo": "Users Channels",
        "endpoint": "/users/:user-id",
        "issueDate": moment().subtract(2, "days").format("DD MMM YYYY"),
        "dueDate": "Discord"
    },
    {
        "dataHash": 300498,
        "status": "paid",
        "dataInfo": "User Servers",
        "endpoint": "/users/:user-id",
        "issueDate": moment().subtract(2, "days").format("DD MMM YYYY"),
        "dueDate": moment().subtract(2, "days").add(1, "month").format("DD MMM YYYY")
    },
    {
        "dataHash": 300497,
        "status": "paid",
        "dataInfo": "Users Friends/relations",
        "endpoint": "233,42",
        "issueDate": moment().subtract(3, "days").format("DD MMM YYYY"),
        "dueDate": moment().subtract(3, "days").add(1, "month").format("DD MMM YYYY")
    },
    {
        "dataHash": 300496,
        "status": "due",
        "dataInfo": "Gold dataInfo Plan",
        "endpoint": "533,42",
        "issueDate": moment().subtract(1, "day").subtract(1, "month").format("DD MMM YYYY"),
        "dueDate": moment().subtract(1, "day").format("DD MMM YYYY")
    },
    {
        "dataHash": 300495,
        "status": "due",
        "dataInfo": "Gold dataInfo Plan",
        "endpoint": "533,42",
        "issueDate": moment().subtract(3, "days").subtract(1, "month").format("DD MMM YYYY"),
        "dueDate": moment().subtract(3, "days").format("DD MMM YYYY")
    },
    {
        "dataHash": 300494,
        "status": "due",
        "dataInfo": "Flexible dataInfo Plan",
        "endpoint": "233,42",
        "issueDate": moment().subtract(4, "days").subtract(1, "month").format("DD MMM YYYY"),
        "dueDate": moment().subtract(4, "days").format("DD MMM YYYY")
    },
    {
        "dataHash": 300493,
        "status": "cancelled",
        "dataInfo": "Gold dataInfo Plan",
        "endpoint": "533,42",
        "issueDate": moment().subtract(20, "days").subtract(1, "month").format("DD MMM YYYY"),
        "dueDate": moment().subtract(20, "days").format("DD MMM YYYY")
    },
    {
        "dataHash": 300492,
        "status": "cancelled",
        "dataInfo": "Platinum dataInfo Plan",
        "endpoint": "799,00",
        "issueDate": moment().subtract(2, "months").format("DD MMM YYYY"),
        "dueDate": moment().subtract(3, "months").format("DD MMM YYYY")
    },
    {
        "dataHash": 300491,
        "status": "paid",
        "dataInfo": "Platinum dataInfo Plan",
        "endpoint": "799,00",
        "issueDate": moment().subtract(6, "days").format("DD MMM YYYY"),
        "dueDate": moment().subtract(6, "days").add(1, "month").format("DD MMM YYYY")
    }
]