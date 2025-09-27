//wrapper to call backend auth endpoints using existing RestAPIService.

import RestAPIService from "../services/restAPIService.js";

export default class AuthService {
    constructor(restApiService) {
        this.rest = restApiService;

        this.urls = {
            login: `${"https://us-central1-portal-tps.cloudfunctions.net/"}auth/login`,
            register: `${"https://us-central1-portal-tps.cloudfunctions.net/"}auth/register`,
            requestReset: `${"https://us-central1-portal-tps.cloudfunctions.net/"}auth/password-reset-request`,
            reset: `${"https://us-central1-portal-tps.cloudfunctions.net/"}auth/password-reset`,
        };
    }

    async login(credentials) {
        const res = await fetch(this.urls.login, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });
        const payload = await res.json();
        if (!res.ok) throw new Error(payload?.message || "Login failed");
        return payload;
    }

    async register(payload) {
        const res = await fetch(this.urls.register, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Registration failed");
        return data;
    }

    async requestPasswordReset(payload) {
        const res = await fetch(this.urls.requestReset, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Request failed");
        return data;
    }

    async resetPassword(payload) {
        const res = await fetch(this.urls.reset, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Reset failed");
        return data;
    }
}
