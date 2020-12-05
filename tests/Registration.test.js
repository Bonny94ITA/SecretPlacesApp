import serverURL from "../components/ServerInfo";
import {sha256} from 'js-sha256';
const fetch = require("node-fetch");
const {matchersWithOptions} = require('jest-json-schema');

const registrationSuccessfulSchema = {
    $id: "/RegistrationSuccessful",
    type: "object",
    properties: {
        info: {
            type: "string"
        }
    },
    required: ['info']
};

const registrationFailedSchema = {
    $id: "/RegistrationFailed",
    type: "object",
    properties: {
        error: {
            type: "string"
        }
    },
    required: ['error']
};

expect.extend(matchersWithOptions({
    schemas: [registrationSuccessfulSchema, registrationFailedSchema]
}));

function timeout(milliseconds, promise) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error("Timeout exceeded."))
        }, milliseconds);
        promise.then(resolve, reject);
    });
}

const register = async (email, password, username) => {
    let res = null;

    await timeout(5000, fetch (serverURL + '/guests/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            pwd: sha256(password),
            name: username
        })
    })).then(function (response) {
        res = response.json();
    });

    return res;
};


describe('<RegistrationScreen />', () => {
    it('registration successful', async () => {
        const resData = await register("test@unito.com", "ciao", "test");
        expect(resData).toMatchSchema(registrationSuccessfulSchema);
    });
    it('registration fail', async () => {
        const resData = await register("f@f.com", "ciao", "test");
        expect(resData).toMatchSchema(registrationFailedSchema);
    });
});