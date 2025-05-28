import { useEffect } from "react"
import { useState } from "react"
import { onChangerUser } from "../Firebase/auth"

const useUsuario = () => {
    const [usuario, setUsuario] = useState(undefined)

    useEffect(()=>{
        onChangerUser(setUsuario)
    }, [])

    return usuario

}

export default useUsuario