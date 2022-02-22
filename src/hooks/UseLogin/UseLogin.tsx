import  {useEffect, useState} from 'react';

type LoggedInState = {
    state: "trying_to_login"
} | {
    state: "logged_out"
} | {
    state: "logged_in"
    details: {
        expert: boolean;
        first_name: string;
        last_name: string;
        uuid: string;
        verified: boolean;
    }
}

function UseLogin() {
    const [loginState, setLoginState] = useState<LoggedInState>({state: "trying_to_login"});

    useEffect(() => {
        tryFetchDetails()
    }, [])

    const tryFetchDetails = async () => {
        console.log("trying web request")

        const response = await fetch("/api/user/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        });

        if (response.ok) {
            const body = await response.json();
            setLoginState({state: "logged_in", details: body});
        } else {
            setLoginState({state: "logged_out"});
        }
    }

    return loginState;
}

export default UseLogin
