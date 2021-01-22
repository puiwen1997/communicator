export const CREDENTIALS = {
    appId: 3772,
    authKey: "wkAD8TLZjzTftPS",
    authSecret: "VBgFhQj35UawBs9",
};

export const CONFIG = {
    debug: { mode: 1 }, // enable DEBUG mode (mode 0 is logs off, mode 1 -> console.log())
    on: {
        sessionExpired: (handleResponse, retry) => {
          // call handleResponse() if you do not want to process a session expiration,
          // so an error will be returned to origin request
          // handleResponse();

          ConnectyCube.createSession()
            .then(retry)
            .catch((error) => {});
        },
      },
};