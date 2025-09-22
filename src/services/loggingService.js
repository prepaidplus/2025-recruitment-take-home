import RestAPIService from "./restAPIService";
import store from "../js/store";

/**
 * Service class for logging errors and activities, interacting with a remote logging service.
 */
export default class LoggingService {
    /**
     * Initializes the LoggingService by setting up the REST service with the GCP Log Explorer repository.
     */
    constructor(loggingRepository) {
        // Initialize REST service for logging
        this.restService = new RestAPIService(loggingRepository);
    }

    /**
     * Logs an error and displays an alert to the user with the error message.
     *
     * @param {Object} app The app object used for showing the alert dialog.
     * @param {Error} e The error object that contains the error details.
     * @param {string} trail Additional information or context to append to the error message.
     */
    logAndShowError(app, e, trail, moreInfo = null, title = "Ooops") {
        // Send a request to the GCP endpoint and display an alert with the error message
        app.dialog
            .create({
                title: title,
                text: `${trail} - ${e.message}`,
                buttons: [
                    {
                        text: `
					<a class="button button-large button-fill button-raised color-blue menu-button" style="height:90% !important;"
						><span class="text-spacer"></span>
                        Okay
                        </a>`,

                        /**
                         * handle button clicks
                         */
                        async onClick() {},
                    },
                ],
            })
            .open();

        const data = {
            title: e.message,
            account: store.state?.pairingData?.outletId,
            errorMesage: e.message,
            errorStack: e.stack,
            more: moreInfo,
        };
        this.restService.makePostCall(data);
    }

    /**
     * Displays an alert dialog with the error message.
     *
     * @param {Object} app The app object used for showing the alert dialog.
     * @param {Error} e The error object that contains the error details.
     * @param {string} trail Additional information or context to append to the error message.
     */
    showError(app, e, trail) {
        app.dialog
            .create({
                title: "Ooops",
                text: `${trail} - ${e.message}`,
                buttons: [
                    {
                        text: `
					<a class="button button-large button-fill button-raised color-blue menu-button" style="height:90% !important;"
						><span class="text-spacer"></span>
                        Okay
                        </a>`,

                        /**
                         * handle button clicks
                         */
                        async onClick() {},
                    },
                ],
            })
            .open();
    }

    /**
     * Logs an error to the logging service. Placeholder for future error logging functionality.
     */
    logError(e, moreInfo = null) {
        //something is about to happen
        const data = {
            title: e.message,
            account: store.state?.pairingData?.outletId || "n/a",
            errorMesage: e.message,
            errorStack: e.stack,
            more: moreInfo,
        };
        this.restService.makePostCall(data);
    }

    /**
     * Logs user activity to the logging service. Placeholder for future activity logging functionality.
     */
    logActivity(title, moreInfo = null) {
        const data = {
            title: title,
            account: store.state?.pairingData?.outletId,
            errorMesage: null,
            errorStack: null,
            more: moreInfo,
        };
        this.restService.makePostCall(data);
    }
}
