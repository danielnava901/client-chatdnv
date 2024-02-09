import React from "react";

type Props = {
    children: React.ReactNode
}

export const RightSide = ({children} : Props) => {
    return <div className="bg-gray-100 grow">
        {children}
    </div>
}