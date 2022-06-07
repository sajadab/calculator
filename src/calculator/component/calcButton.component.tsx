import {FC} from "react";

interface ButtonProps{
    text:string,
    onClick:any,
    colored?:boolean,
    bold?:boolean,
}

export const CalcButtonComponent: FC<ButtonProps> = (props) => {
    return(
        <div className="ratio ratio-1x1 align-items-center justify-content-center m-2" onClick={props.onClick}>
            <div className="d-flex card-1 text-center align-items-center justify-content-center" >
                <div className={`fs-4 ${props.bold?"fw-bold":""} ${props.colored?"orangeColor":"mText"}`}>
                    {props.text}
                </div>
            </div>
        </div>
    )
}