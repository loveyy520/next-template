import { NextPage } from "next";
import { ReactNode } from "react";

interface ContainerProps {
    children?: ReactNode
}

const Container: NextPage<ContainerProps> = ({ children }) => {
    return ( <div className='py-5 px-10'>
        { children }
    </div> );
}
 
export default Container;