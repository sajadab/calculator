import {FC} from "react";

interface ButtonProps{
    onClick:any
}

export const CalcImageButtonComponent: FC<ButtonProps> = (props) => {
    return(
        <div className="ratio ratio-1x1 align-items-center justify-content-center m-2">
            <div className="d-flex card-1 text-center align-items-center justify-content-center" >
                <div className="fs-4 fw-bold" onClick={props.onClick}>
                    {props.children}
                </div>
            </div>
        </div>
    )
}