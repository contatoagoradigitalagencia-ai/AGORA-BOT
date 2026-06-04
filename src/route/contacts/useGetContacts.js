import { useState, useEffect } from "react";
import { apiList } from "../../api/client.js";

/**
 * @author VAMPETA
 * @brief HOOK QUE CONTROLA O LOAD DOS CONTATOS
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
 */
export function useGetContacts() {
    const [contacts, setContacts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let active = true;

        apiList("/contacts")
            .then((data) => {
                if (!active) return ;
                setContacts(data);
            })
            .catch(() => {
                if (!active) return ;
                setError(true);
                setContacts([]);
            })
            .finally(() => {
                if (!active) return ;
                setLoading(false);
            });

        return (() => {
            active = false;
        });
    }, []);

    return ({ contacts, loading, error });
}
