import React from "react";

type Props = {
    children: React.ReactNode
}

const LeftSide = ({children} : Props) => {
    return <div className="border border-r h-screen w-[300px]">
        {children}
    </div>
}

export default LeftSide;