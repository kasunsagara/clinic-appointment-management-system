import axios from "axios";

export default function manageDoctorsPage() {

    axios.get("http://localhost:5000/api/doctors").then((res) => {
        console.log(res);
    })

    return (
        <div>
            Manage Doctors Page
        </div>
    )
}