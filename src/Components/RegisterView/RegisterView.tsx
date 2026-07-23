import { memo, useEffect } from "react"
import styles from "./RegisterView.module.css"
import { Led } from "../Led/Led";

interface RegisterProps {
    name: string,
    data: number | boolean | string,
    highlight: boolean
}

export const RegisterView = memo (
    function RegisterView( {
        name, data, highlight
    } : RegisterProps ) {

        useEffect( () => {
            if(name === "RI") {
                console.log(data);
            }
        }, [data])

        return (
            <div className = {highlight ? styles.container_highlight : styles.container}>
                <h3>{name}</h3>
                { typeof data === "string" && 
                    (
                        (data === "") ?
                        <p className={styles.register_p}>0000</p>
                        :
                        <p className={styles.register_p}>{data}</p>                    
                    )
                }
                { typeof data === "number" && 
                    <p className={styles.register_p}>{data}</p>
                }
                { typeof data === "boolean"  &&
                    <Led on={data}/>
                }
            </div>
        );
    }
)