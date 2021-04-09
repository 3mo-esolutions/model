# DialogAuthenticator

DialogAuthenticator is an abstract dialog component, consisting of its default template. It hides all its UI logic and let you implement only the authentication logic needed in every project to authenticate, unauthenticate, recover password and to check if the user is authenticated.

Implement the abstract methods and decorate the component with the `@authenticator` decorator to register the current component as the global authenticator of the application.