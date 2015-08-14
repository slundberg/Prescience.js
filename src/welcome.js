import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import {App} from "./app"

@inject(HttpClient, App)
export class Welcome {
    constructor(http, app) {
        this.app = app;
        this.http = http;
        window.this7 = this;
        console.log("building Welcome")
    }

    attached() {

        // if we are already logged in then go right to the dashboard
        this.http.createRequest("/db/prescience/_status")
            .withHeader('Prescience-User', sessionStorage.user)
            .withHeader('Prescience-Token', sessionStorage.token)
            .asGet().send()
            .then(() => this.app.authenticated = true)
            .catch(() => this.app.authenticated = false);

        NProgress.done();
    }

    begin() {
        this.app.router.navigateToRoute("dashboard");
    }

    login() {
        this.http.createRequest("/auth")
            .asPost()
            .withContent({user: this.doctorId, password: this.doctorPassword})
            .send()
            .then(response => {
                this.loginFailed = undefined;
                this.app.user = sessionStorage.user = this.doctorId;
                sessionStorage.token = response.content;
                this.doctorPassword = undefined;
                this.app.router.navigateToRoute("dashboard");
            })
            .catch(e => {
                console.log("fail", e)
                this.loginFailed = true;
            });
    }
}
