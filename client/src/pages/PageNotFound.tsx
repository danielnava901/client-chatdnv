import {Link} from "react-router-dom";

export const PageNotFound = () => (
    <div className="w-screen h-screen flex justify-center items-center flex-col">
        <div className="w-1/2 flex flex-col justify-center items-center">
            <h1 className="font-bold text-2xl text-center mb-6">
                404 - Página no encontrada
            </h1>
            <span className="underline text-blue-500 cursor-pointer">
                <Link to="/login">Entrar</Link>
            </span>
        </div>
    </div>
);
