import {useContext, useState} from "react";
import {UserContext} from "../context/UserContext";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {login} = useContext(UserContext);

    const onClickLogin = async () => {
        if(email.trim().length === 0 || password.trim().length === 0) {
            alert("Falta un parámetro");
            return;
        }

        await login({email, password});
    };

    return <div className="w-screen h-screen flex flex-col justify-center items-center">
        <div className="w-1/2 border rounded p-8 flex flex-col">
            <div className="w-full flex flex-col">
                <label htmlFor="email" className="font-bold">Email</label>
                <input type="email" className="w-full border p-2 h-12 mb-2"
                    value={email}
                    onChange={(ev) => {setEmail(ev.target.value)}}
                />
                <label htmlFor="password" className="font-bold">Password</label>
                <input type="password" className="w-full border p-2 h-12 mb-2"
                    value={password}
                    onChange={(ev) => {setPassword(ev.target.value)}}
                />
                <button
                    onClick={onClickLogin}
                    className="bg-blue-700 text-white p-2 h-12 rounded hover:shadow hover:opacity-75">
                    Enviar</button>
            </div>
        </div>
    </div>
}