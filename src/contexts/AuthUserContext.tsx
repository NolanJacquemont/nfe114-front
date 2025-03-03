import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { User } from "../models/User";
import {getMe, getMePractitioner} from "../rest/queries";

export interface AuthUser {
    token: string | undefined;
    user?: User | undefined;
    updateToken: (token: string) => void;
    refreshUser: () => void;
    disconnect: () => void;
    type: "user" | "practitioner" | undefined;
    defineType: (type: "user" | "practitioner" | undefined) => void;
}

const useAuthUserValues = () => {
    const localStorageToken = localStorage.getItem("token");
    const localStorageType = localStorage.getItem("type") as "user" | "practitioner" | undefined;
    const [token, setToken] = useState(localStorageToken ? localStorageToken : undefined);
    const [user, setUser] = useState<User | undefined>(undefined);
    const [type, setType] = useState<"user" | "practitioner" | undefined>(localStorageType ? localStorageType : undefined);

    const updateToken = (token: string) => {
        setToken(token);
        localStorage.setItem("token", token);
    }

    const defineType = (type: "user" | "practitioner" | undefined) => {
        setType(type);
        localStorage.setItem("type", type as string);
        console.log("type:" + type);
    }

    const refreshUser = useCallback(() => {
        if (token) {
            if (type === "practitioner") {
                getMePractitioner(token).then((response) => {
                        if (response.responseCode === 200) {
                            if (response.data) {
                                setUser(response.data);
                            }
                        } else {
                            disconnect()
                            console.log("Error while logging in: " + response.errorMessage);
                        }
                    }
                );
            } else {
                getMe(token).then((response) => {
                        if (response.responseCode === 200) {
                            if (response.data) {
                                setUser(response.data);
                            }
                        } else {
                            disconnect()
                            console.log("Error while logging in: " + response.errorMessage);
                        }
                    }
                );
            }
        }
    }, [token]);

    const disconnect = () => {
        setToken(undefined);
        setType(undefined);
        localStorage.removeItem("token");
        localStorage.removeItem("type");
        setUser(undefined);
    }

    useEffect(() => {
        if (token) {
            refreshUser();
        }
    }, [token, refreshUser]);

    return { token, user, updateToken, refreshUser, disconnect, defineType, type } as AuthUser;
}

export const AuthUserContext = createContext<AuthUser | null>(null)

export const AuthUserProvider = (props: { children: ReactNode }) => {
    const authUser = useAuthUserValues();

    return (
        <AuthUserContext.Provider value={authUser}>
            {props.children}
        </AuthUserContext.Provider>
    )
}

export const useAuthUser = () => {
    const authUser = useContext(AuthUserContext);
    if (!authUser) {
        throw new Error("You probably forgot to put <AuthUserProvider>.");
    }
    return authUser;
}