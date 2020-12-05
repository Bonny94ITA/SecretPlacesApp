import serverURL from "../components/ServerInfo";
import {sha256} from 'js-sha256';
const fetch = require("node-fetch");
const {matchersWithOptions} = require('jest-json-schema');

const guestInfo = {
    $id: "/GuestInfo",
    type: "object",
    properties: {
        name: {
            type: 'string',
        },
        id: {
            type: 'number',
        },
        email: {
            type: 'string',
        },
    },
    required: ["name", "id", "email"]
};

const tokenInfo = {
    $id: "/TokenInfo",
    type: "object",
    properties: {
        idToken: {
            type: 'string',
        },
        ttl: {
            type: 'number',
        },
    },
    required: ["idToken", "ttl"]
};

const loginSuccessfulSchema = {
    $id: "/LoginSuccessful",
    type: "object",
    properties: {
        guest: {
            $ref: "/GuestInfo"
        },
        token: {
            $ref: "/TokenInfo"
        }
    },
    required: ['guest', 'token'],
};

const loginFailedSchema = {
    $id: "/LoginFailed",
    type: "object",
    properties: {
        error: {
            type: "string"
        }
    },
    required: ['error']
};

expect.extend(matchersWithOptions({
    schemas: [loginSuccessfulSchema, loginFailedSchema, tokenInfo, guestInfo]
}));

function timeout(milliseconds, promise) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error("Timeout exceeded."))
        }, milliseconds);
        promise.then(resolve, reject);
    });
}

const login = async (email, password) => {
    let res = null;

    await timeout(5000, fetch(serverURL + '/guests/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            pwd: sha256(password)
        })
    })).then(function (response) {
        res = response.json();
    });

    return res;
}

describe('<LoginScreen />', () => {
    it('login successful', async () => {
        const resData = await login("f@f.com", "ciao");
        expect(resData).toMatchSchema(loginSuccessfulSchema);
    });
    it('login fail', async () => {
        const resData = await login("f@f.com", "ciao1");
        expect(resData).toMatchSchema(loginFailedSchema);
    });
});