import { Apartment } from "../../context/ApartmentContext";
import PetsIcon from "@mui/icons-material/Pets";
import SmokingRoomsIcon from "@mui/icons-material/SmokingRooms";
import WifiIcon from "@mui/icons-material/Wifi";
import BalconyIcon from "@mui/icons-material/Balcony";
import LocalParkingIcon from "@mui/icons-material/LocalParking";

const checkboxStyle = {
    mr: "0.5em",
};
const checkboxesData: {
    id: string;
    label: string;
    key: keyof Apartment;
    value: boolean;
    icon: JSX.Element;
}[] = [
    {
        id: "pet_friendly",
        label: "Pet friendly?",
        key: "petFriendly",
        value: false,
        icon: <PetsIcon sx={{ ...checkboxStyle }} />,
    },
    {
        id: "smoke_friendly",
        label: "Smoke friendly?",
        key: "smokeFriendly",
        value: false,
        icon: <SmokingRoomsIcon sx={{ ...checkboxStyle }} />,
    },
    {
        id: "is_wifi",
        label: "Is there WiFi?",
        key: "isWifi",
        value: false,
        icon: <WifiIcon sx={{ ...checkboxStyle }} />,
    },
    {
        id: "is_balcony",
        label: "Is there a balcony?",
        key: "isBalcony",
        value: false,
        icon: <BalconyIcon sx={{ ...checkboxStyle }} />,
    },
    {
        id: "is_parking",
        label: "Is there private parking?",
        key: "isParking",
        value: false,
        icon: <LocalParkingIcon sx={{ ...checkboxStyle }} />,
    },
];

export default checkboxesData;
